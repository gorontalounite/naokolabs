import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildPlannerPrompt } from "./prompts/build";
import { PROMPT_VERSION } from "./prompts/global";
import { PlanSchema, type Plan, type PlanRequest } from "./schema";
import type { SourceContent } from "./source";
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

export async function generatePlan(req: PlanRequest, source: SourceContent | null): Promise<PlannerResult> {
  if (plannerMode() === "contoh") {
    const plan = samplePlan(req, source);
    return { ok: true, mode: "contoh", plan, issues: validatePlan(plan, req), usage: null, promptVersion: PROMPT_VERSION, attempts: 0 };
  }
  return generateWithClaude(req, source);
}

// ---------------------------------------------------------------------------
// Mode AI: Claude dengan structured outputs, validasi server, dan satu kali perbaikan.

async function generateWithClaude(req: PlanRequest, source: SourceContent | null): Promise<PlannerResult> {
  const client = new Anthropic();
  const { system, userText } = buildPlannerPrompt(req, source);
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
// Mode contoh: rencana tetap berbasis template, dipakai selama API key belum dipasang.
// Selalu lolos validatePlan agar alur Studio → rencana → persetujuan bisa diuji tanpa biaya.

const LAYOUT: Record<number, number[]> = { 15: [5, 5, 5], 30: [5, 6, 7, 6, 6], 60: [8, 9, 9, 9, 9, 8, 8] };

const STOPWORDS = new Set(["di", "ke", "dari", "dan", "yang", "untuk", "dengan", "pada", "atau", "agar", "supaya", "dalam", "the", "of", "and"]);

function shortTopic(req: PlanRequest, source: SourceContent | null) {
  const raw =
    req.mode === "ide"
      ? req.idea
      : req.mode === "naskah"
        ? req.script.split(/[.!?\n]/)[0]
        : source?.title || req.pastedText.split(/[.!?\n]/)[0] || safeHost(req.link);
  const words = raw.replace(/[?!.,:;]+$/g, "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).slice(0, 6);
  // Jangan berhenti di kata sambung ("monstera di").
  while (words.length > 1 && STOPWORDS.has(words[words.length - 1].toLowerCase())) words.pop();
  const topic = words.join(" ");
  // Huruf kecil di awal karena topik dipakai di tengah kalimat, kecuali singkatan/merek berhuruf kapital.
  return topic && !/^[A-Z]{2,}/.test(topic) ? topic.charAt(0).toLowerCase() + topic.slice(1) : topic || "produk Anda";
}

function safeHost(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function samplePlan(req: PlanRequest, source: SourceContent | null): Plan {
  const t = shortTopic(req, source);
  const brand = req.brand?.name?.trim();
  const cta = req.brand?.tagline?.trim() || `Simpan video ini dan ikuti ${req.brand?.handle?.trim() || "kami"} untuk info berikutnya.`;
  const video = req.assets.find((a) => a.kind === "video");
  const image = req.assets.find((a) => a.kind === "gambar");

  const beats: { purpose: string; screen: string; narration: string; visual: string }[] = [
    { purpose: "Penonton berhenti menggulir karena topiknya relevan", screen: `${t.charAt(0).toUpperCase() + t.slice(1)}?`, narration: `Pernah penasaran soal ${t}?`, visual: "Judul besar di tengah layar dengan latar warna brand" },
    { purpose: "Penonton mengenali masalah atau keinginannya", screen: "Banyak yang masih bingung\nharus mulai dari mana", narration: "Banyak orang masih bingung harus mulai dari mana.", visual: "Ikon tanda tanya bergeser membentuk daftar pendek" },
    { purpose: "Penonton melihat solusi utama", screen: "Mulai dari langkah\npaling sederhana", narration: "Kuncinya, mulai dari langkah yang paling sederhana dulu.", visual: image ? `Foto dari aset klien: ${image.name}` : "Placeholder: foto produk atau suasana" },
    { purpose: "Penonton memahami detail yang sering terlewat", screen: "Perhatikan detail ini", narration: "Perhatikan detail ini, karena sering terlewat.", visual: "Garis penanda menyorot satu bagian penting" },
    { purpose: "Penonton yakin bisa mencobanya", screen: "Hasilnya lebih terasa", narration: "Langkah kecil ini membuat hasilnya jauh lebih terasa.", visual: "Perbandingan sebelum dan sesudah dalam dua kolom" },
    { purpose: "Penonton tahu contoh penerapannya", screen: "Contoh yang bisa\nlangsung dicoba", narration: "Contohnya bisa langsung Anda coba hari ini juga.", visual: "Tiga kartu contoh muncul berurutan" },
  ];

  const seconds = LAYOUT[req.duration];
  const middle = beats.slice(1, 1 + seconds.length - 2);
  const ordered = [beats[0], ...middle];
  const scenes = seconds.map((s, i) => {
    const isLast = i === seconds.length - 1;
    const beat = isLast
      ? { purpose: "Penonton tahu langkah berikutnya", screen: brand ? `${brand.split(" ").slice(0, 4).join(" ")}` : "Langkah berikutnya", narration: cta.split(" ").slice(0, 11).join(" "), visual: "Logo brand dan ajakan penutup" }
      : ordered[i];
    return {
      purpose: beat.purpose,
      seconds: s,
      screenText: beat.screen,
      narration: req.vo ? beat.narration : "",
      visual: req.styleId === "ugc-edit" && video ? `Potongan rekaman klien (${video.name}): ${beat.visual.toLowerCase()}` : beat.visual,
      motion: { enter: i === 0 ? "Teks masuk dari bawah" : "Elemen bergeser dari adegan sebelumnya", action: "Kata kunci membesar sekali", exit: isLast ? "Tahan sampai akhir" : "Memudar ke adegan berikutnya" },
      sound: req.music ? (i === 0 ? "Ketukan pembuka" : "") : "",
      assetId: req.styleId === "ugc-edit" && video ? video.id : i === 2 && image ? image.id : null,
    };
  });

  return {
    status: "ok",
    title: brand ? `${brand}: ${t}` : t.charAt(0).toUpperCase() + t.slice(1),
    concept: `Video ${req.duration} detik yang menjelaskan ${t} secara singkat dan mudah dipahami.`,
    hook: `Pernah penasaran soal ${t}?`,
    scenes,
    caption: `${t.charAt(0).toUpperCase() + t.slice(1)} — dijelaskan singkat dalam ${req.duration} detik. ${cta}`,
    hashtags: ["NaokoLabs", "TipsBisnis", "UMKM"],
    missingInputs: ["Ini contoh rencana: penyusunan otomatis oleh AI aktif setelah kunci API dipasang."],
    sourcesUsed: source ? [source.title || source.url] : [],
  };
}
