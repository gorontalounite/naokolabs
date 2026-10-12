import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildPlannerPrompt } from "./prompts/build";
import { PROMPT_VERSION } from "./prompts/global";
import { PlanSchema, type Plan, type PlanRequest, type Voiceover } from "./schema";
import { hasErrors, validatePlan, type Issue } from "./validate";

export const PLANNER_MODEL = "claude-opus-5-5";
const MAX_ATTEMPTS = 2;

export type PlannerUsage = { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number };

export type PlannerResult =
  | { ok: true; mode: "contoh" | "ai"; plan: Plan; issues: Issue[]; usage: PlannerUsage | null; promptVersion: string; attempts: number }
  | { ok: false; error: string };

export function plannerMode(): "contoh" | "ai" {
  return process.env.ANTHROPIC_API_KEY ? "ai" : "contoh";
}

export async function generatePlan(req: PlanRequest): Promise<PlannerResult> {
  if (plannerMode() === "contoh") {
    const plan = samplePlan(req);
    return { ok: true, mode: "contoh", plan, issues: validatePlan(plan, req), usage: null, promptVersion: PROMPT_VERSION, attempts: 0 };
  }
  return generateWithClaude(req);
}

// ---------------------------------------------------------------------------
// Mode AI: Claude dengan structured outputs, validasi server, dan satu kali perbaikan.

async function generateWithClaude(req: PlanRequest): Promise<PlannerResult> {
  const client = new Anthropic();
  const { system, userText } = buildPlannerPrompt(req);
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: userText }];
  const usage: PlannerUsage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response;
    try {
      response = await client.beta.messages.parse({
        model: PLANNER_MODEL,
        max_tokens: 16000,
        system,
        messages,
        output_config: { format: betaZodOutputFormat(PlanSchema), effort: "medium" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      });
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) return { ok: false, error: "Layanan AI sedang sibuk. Coba lagi sebentar lagi." };
      if (error instanceof Anthropic.AuthenticationError) return { ok: false, error: "Kunci API AI tidak valid. Hubungi admin." };
      if (error instanceof Anthropic.APIError) return { ok: false, error: `Layanan AI gagal (${error.status ?? "jaringan"}).` };
      throw error;
    }

    usage.inputTokens += response.usage.input_tokens;
    usage.outputTokens += response.usage.output_tokens;
    usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
    usage.cacheWriteTokens += response.usage.cache_creation_input_tokens ?? 0;

    if (response.stop_reason === "refusal") return { ok: false, error: "Permintaan ini tidak bisa diproses AI. Ubah bahan atau ide lalu coba lagi." };
    if (response.stop_reason === "max_tokens") return { ok: false, error: "Rencana terlalu panjang. Kurangi bahan lalu coba lagi." };
    const plan = response.parsed_output;
    if (!plan) return { ok: false, error: "Jawaban AI tidak sesuai format." };

    const issues = validatePlan(plan, req);
    if (!hasErrors(issues) || attempt === MAX_ATTEMPTS) {
      return { ok: true, mode: "ai", plan, issues, usage, promptVersion: PROMPT_VERSION, attempts: attempt };
    }

    // Kembalikan pelanggaran ke model untuk diperbaiki, history tetap utuh (append-only).
    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: `Rencana belum memenuhi aturan berikut. Perbaiki dan kirim ulang rencana lengkap:\n${issues
        .filter((i) => i.level === "error")
        .map((i) => `- ${i.scene ? `Adegan ${i.scene}: ` : ""}${i.message}`)
        .join("\n")}`,
    });
  }
  return { ok: false, error: "Rencana gagal disusun." };
}

// ---------------------------------------------------------------------------
// Mode contoh: brief dan storyboard berbasis template, dipakai selama API key belum dipasang.
// Durasi tetap mengikuti isi ide (jumlah poin) seperti aturan planner AI, dan selalu lolos validatePlan.

const STOPWORDS = new Set(["di", "ke", "dari", "dan", "yang", "untuk", "dengan", "pada", "atau", "agar", "supaya", "dalam", "the", "of", "and"]);
const POINT_NOUNS = "alasan|cara|langkah|tips|tip|hal|manfaat|kesalahan|fakta|ide|rahasia|jenis|trik|keunggulan|ciri|tanda";
const ORDINAL = ["pertama", "kedua", "ketiga", "keempat", "kelima", "keenam"];

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function clip(text: string, maxWords: number) {
  const words = text.replace(/[?!.,:;]+$/g, "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).slice(0, maxWords);
  while (words.length > 1 && STOPWORDS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(" ");
}

// Baca struktur ide: "3 alasan kopi lokal lebih segar" → 3 poin bernama "alasan", topik "kopi lokal lebih segar".
export function readIdea(idea: string) {
  const text = idea.replace(/\s+/g, " ").trim();
  const listed = text.match(new RegExp(`(\\d+)\\s+(${POINT_NOUNS})\\b\\s*(.*)`, "i"));
  if (listed) {
    const count = Math.min(6, Math.max(2, Number(listed[1])));
    return { count, noun: listed[2].toLowerCase(), topic: clip(listed[3] || text, 6) || "produk Anda", headline: clip(text, 8) };
  }
  const words = text.split(" ").length;
  // Tanpa daftar eksplisit: ide pendek = satu pesan, ide panjang = beberapa poin.
  const count = words <= 8 ? 1 : words <= 18 ? 2 : 3;
  const topic = clip(text, 6) || "produk Anda";
  return { count, noun: "poin", topic: /^[A-Z]{2,}/.test(topic) ? topic : topic.charAt(0).toLowerCase() + topic.slice(1), headline: clip(text, 8) };
}

const GOAL: Record<string, string> = {
  promosi: "Penonton tertarik mencoba atau membeli",
  edukasi: "Penonton paham dan bisa mempraktikkan",
  hook: "Penonton berhenti menggulir, menonton sampai habis, lalu menyimpan video",
  santai: "Penonton merasa dekat dengan brand dan ingin tahu lebih lanjut",
  formal: "Penonton menerima informasi resmi dengan jelas",
};

export function samplePlan(req: PlanRequest): Plan {
  if (req.voiceover) return sampleFromVoiceover(req, req.voiceover);
  const idea = readIdea(req.idea);
  const brand = req.brand?.name?.trim();
  const handle = req.brand?.handle?.trim();
  const cta = req.brand?.tagline?.trim() || `Simpan video ini dan ikuti ${handle || "kami"} untuk info berikutnya.`;
  const video = req.assets.find((a) => a.kind === "video");
  const image = req.assets.find((a) => a.kind === "gambar");
  const ugc = req.styleId === "ugc-edit" && video;

  const points =
    idea.noun === "poin"
      ? idea.count === 1
        ? [`Pesan utama: ${idea.topic}`]
        : Array.from({ length: idea.count }, (_, i) => `Poin ${ORDINAL[i]} tentang ${idea.topic}`)
      : Array.from({ length: idea.count }, (_, i) => `${cap(idea.noun)} ${ORDINAL[i]}`);

  type Beat = { purpose: string; seconds: number; screen: string; narration: string; visual: string };
  const hook: Beat = {
    purpose: "Penonton berhenti menggulir karena topiknya relevan",
    seconds: 4,
    screen: cap(idea.headline),
    narration: idea.noun === "poin" ? `Pernah penasaran soal ${idea.topic}?` : `Ini ${idea.count} ${idea.noun} ${idea.topic}.`,
    visual: "Judul besar di tengah layar dengan latar warna brand",
  };
  const body: Beat[] = points.map((pt, i) => ({
    purpose: idea.count === 1 ? "Penonton menangkap pesan utama" : `Penonton memahami ${pt.toLowerCase()}`,
    seconds: 6,
    screen: idea.count === 1 ? clip(idea.topic, 8) : `${idea.noun === "poin" ? `Poin ${ORDINAL[i]}` : pt}\n(isi dari brief)`,
    narration: idea.count === 1 ? "Ini yang perlu Anda tahu, singkat dan jelas." : `${cap(ORDINAL[i])}, penjelasan singkat sesuai brief.`,
    visual: i === 0 && image ? `Foto dari aset klien: ${image.name}` : "Ikon dan kata kunci tersusun rapi",
  }));
  const end: Beat = {
    purpose: "Penonton tahu langkah berikutnya",
    seconds: 5,
    screen: brand ? clip(brand, 4) : "Langkah berikutnya",
    narration: clip(cta, 11),
    visual: "Logo brand dan ajakan penutup",
  };

  const beats = [hook, ...body, end];
  const scenes = beats.map((b, i) => {
    const isLast = i === beats.length - 1;
    return {
      purpose: b.purpose,
      seconds: b.seconds,
      screenText: b.screen,
      narration: req.vo ? b.narration : "",
      visual: ugc ? `Potongan rekaman klien (${video.name}): ${b.visual.toLowerCase()}` : b.visual,
      motion: { enter: i === 0 ? "Teks masuk dari bawah" : "Elemen bergeser dari adegan sebelumnya", action: "Kata kunci membesar sekali", exit: isLast ? "Tahan sampai akhir" : "Memudar ke adegan berikutnya" },
      sound: req.music ? (i === 0 ? "Ketukan pembuka" : "") : "",
      assetId: ugc ? video.id : i === 1 && image ? image.id : null,
    };
  });
  const duration = scenes.reduce((n, sc) => n + sc.seconds, 0);

  return {
    status: "ok",
    title: brand ? `${brand}: ${idea.headline}` : cap(idea.headline),
    brief: {
      goal: GOAL[req.tone] ?? GOAL.promosi,
      audience: `Pengikut ${handle || "akun brand"} dan calon pelanggan yang tertarik dengan ${idea.topic}`,
      keyMessage: cap(req.idea.trim().replace(/\s+/g, " ")),
      angle: idea.count > 1 ? `Dipecah menjadi ${idea.count} ${idea.noun} yang mudah diingat` : "Satu pesan singkat yang langsung ke inti",
      points,
      cta,
    },
    duration,
    durationReason:
      idea.count === 1 ? `Satu pesan + pembuka dan penutup, cukup ${duration} detik.` : `${idea.count} ${idea.noun} + pembuka dan penutup, sekitar ${duration} detik.`,
    concept: `Video ${duration} detik tentang ${idea.topic}.`,
    hook: hook.narration,
    scenes,
    caption: `${cap(idea.headline)}. ${cta}`,
    hashtags: ["NaokoLabs", "TipsBisnis", "UMKM"],
    missingInputs: ["Ini contoh brief dan storyboard dari template: isi tiap poin disusun AI setelah kunci API dipasang."],
    sourcesUsed: [req.idea],
  };
}

// Mode contoh dengan voice-over pelanggan: narasi = transkrip persis, adegan mengikuti waktu kalimat.
export function groupSegments(vo: Voiceover) {
  const total = Math.max(MIN_SCENE_SECONDS * 2, Math.round(vo.seconds));
  const chunks: { text: string; start: number; end: number }[] = [];
  for (const sg of vo.segments) {
    const last = chunks[chunks.length - 1];
    // Satukan kalimat pendek sampai satu adegan sekitar 3,5 detik atau lebih.
    if (last && last.end - last.start < 3.5) {
      last.text = `${last.text} ${sg.text}`;
      last.end = sg.end;
    } else chunks.push({ ...sg });
  }
  // Batas adegan dalam detik bulat; adegan terakhir berakhir di durasi rekaman.
  const bounds = chunks.map((c, i) => (i === chunks.length - 1 ? total : Math.round(c.end)));
  const scenes: { text: string; seconds: number }[] = [];
  let prev = 0;
  chunks.forEach((c, i) => {
    const seconds = bounds[i] - prev;
    if (seconds < MIN_SCENE_SECONDS && scenes.length) {
      scenes[scenes.length - 1].text += ` ${c.text}`;
      scenes[scenes.length - 1].seconds += seconds;
    } else scenes.push({ text: c.text, seconds });
    prev = bounds[i];
  });
  if (scenes.length > 1 && scenes[0].seconds < MIN_SCENE_SECONDS) {
    scenes[1].text = `${scenes[0].text} ${scenes[1].text}`;
    scenes[1].seconds += scenes[0].seconds;
    scenes.shift();
  }
  return { total, scenes };
}

const MIN_SCENE_SECONDS = 2;

function sampleFromVoiceover(req: PlanRequest, vo: Voiceover): Plan {
  const { total, scenes } = groupSegments(vo);
  const brand = req.brand?.name?.trim();
  const handle = req.brand?.handle?.trim();
  const headline = clip(req.idea || vo.segments[0].text, 8) || "Voice-over Anda";
  const image = req.assets.find((a) => a.kind === "gambar");
  return {
    status: "ok",
    title: brand ? `${brand}: ${headline}` : cap(headline),
    brief: {
      goal: GOAL[req.tone] ?? GOAL.promosi,
      audience: `Pengikut ${handle || "akun brand"} dan calon pelanggan`,
      keyMessage: cap(clip(vo.segments[0].text, 14)),
      angle: "Mengikuti alur voice-over pelanggan, visual menegaskan kata yang sedang diucapkan",
      points: scenes.map((sc) => clip(sc.text, 8)),
      cta: req.brand?.tagline?.trim() || clip(vo.segments[vo.segments.length - 1].text, 12),
    },
    duration: total,
    durationReason: `Mengikuti panjang voice-over Anda (${total} detik).`,
    concept: `Video ${total} detik yang mengikuti voice-over pelanggan.`,
    hook: clip(vo.segments[0].text, 12),
    scenes: scenes.map((sc, i) => ({
      purpose: i === 0 ? "Penonton berhenti menggulir dan menangkap topik" : i === scenes.length - 1 ? "Penonton tahu langkah berikutnya" : "Penonton menangkap kalimat yang sedang diucapkan",
      seconds: sc.seconds,
      screenText: clip(sc.text, 6),
      narration: sc.text,
      visual: i === 1 && image ? `Foto dari aset klien: ${image.name}` : "Kata kunci dari kalimat ini tampil besar di tengah",
      motion: { enter: "Teks masuk mengikuti kata pertama yang diucapkan", action: "Kata kunci membesar saat diucapkan", exit: i === scenes.length - 1 ? "Tahan sampai akhir" : "Memudar ke adegan berikutnya" },
      sound: "",
      assetId: i === 1 && image ? image.id : null,
    })),
    caption: `${cap(headline)}. ${req.brand?.tagline?.trim() ?? ""}`.trim(),
    hashtags: ["NaokoLabs", "UMKM"],
    missingInputs: ["Ini contoh storyboard dari template: visual dan teks layar disusun AI setelah kunci API Anthropic aktif."],
    sourcesUsed: [vo.fileName],
  };
}
