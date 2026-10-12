import type Anthropic from "@anthropic-ai/sdk";
import type { PlanRequest } from "../schema";
import { GLOBAL_RULES } from "./global";
import { PLANNER_STAGE } from "./planner";
import { examplePrompt } from "./references";
import { STYLE_CHOICE, STYLE_PROMPTS, stylePrompt } from "./styles/index";
import { TONE_GUIDE } from "./tones";

// Susunan prompt: [aturan global + tahap] → [system prompt gaya] → [arahan contoh video] → pesan pengguna berisi data.
// Bagian stabil di depan dengan penanda cache, data klien di belakang (prompt caching = prefix match).
export function buildPlannerPrompt(req: PlanRequest) {
  // Pelanggan tidak memilih gaya (D-23): planner memilih. Acuan dari Katalog menentukan gayanya.
  const example = examplePrompt(req.exampleId);
  const refStyle = example?.match(/style="([^"]+)"/)?.[1];
  const fixed = refStyle && STYLE_PROMPTS[refStyle] ? refStyle : STYLE_PROMPTS[req.styleId] ? req.styleId : null;
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: `${GLOBAL_RULES}\n\n${PLANNER_STAGE}`, cache_control: { type: "ephemeral" } },
    fixed
      ? { type: "text", text: `Gaya yang dipakai: ${fixed}. Isi field style dengan "${fixed}".\n\n${stylePrompt(fixed)}`, cache_control: { type: "ephemeral" } }
      : { type: "text", text: `${STYLE_CHOICE}\n\n${Object.values(STYLE_PROMPTS).join("\n\n")}`, cache_control: { type: "ephemeral" } },
  ];
  if (example) {
    system.push({ type: "text", text: `Pelanggan memilih video acuan berikut. Ambil ritme, struktur adegan, jumlah kata per layar, dan jenis gerak dari acuan. Palet, latar, dan huruf TETAP mengikuti arah visual NaokoLabs (latar putih, gaya Apple), bukan palet acuan. Isi dan fakta tetap dari ide dan brand kit pelanggan.\n${example}`, cache_control: { type: "ephemeral" } });
  }

  const lines: string[] = [];
  lines.push("<pesanan>");
  lines.push("Format: rasio 9:16 (Reels, Story, TikTok); durasi Anda tentukan dari isi ide");
  lines.push(TONE_GUIDE[req.tone] ?? TONE_GUIDE.promosi);
  lines.push(
    req.voiceover
      ? "Voice-over: rekaman milik pelanggan (lihat <voiceover_pelanggan>); narration = transkrip persis"
      : `Voice-over: ${req.vo ? `aktif (${req.voice})` : "mati — kosongkan narration"}`,
  );
  const musicFile = req.assets.find((a) => a.kind === "audio");
  lines.push(
    req.musicSource === "upload" && musicFile
      ? `Backsound: file milik pelanggan (${musicFile.name}); sound boleh menandai ketukan`
      : req.musicSource === "library" || (req.music && req.musicSource !== "none")
        ? "Backsound: musik dari pustaka NaokoLabs"
        : "Backsound: tidak ada — kosongkan sound kecuali efek penting",
  );
  if (req.assets.filter((a) => a.kind === "gambar" || a.kind === "video").length === 0) {
    lines.push("Footage: tidak ada — semua visual dibuat dari tipografi, bentuk, ikon, dan warna; assetId selalu null");
  }
  lines.push("</pesanan>");

  if (req.brand && (req.brand.name || req.brand.handle || req.brand.tagline)) {
    lines.push("<brand_kit>");
    if (req.brand.name) lines.push(`Nama brand: ${req.brand.name}`);
    if (req.brand.handle) lines.push(`Handle: ${req.brand.handle}`);
    if (req.brand.tagline) lines.push(`Ajakan penutup: ${req.brand.tagline}`);
    lines.push("</brand_kit>");
  }

  lines.push("<aset_pelanggan>");
  if (req.assets.length === 0) lines.push("(tidak ada aset; semua visual placeholder)");
  req.assets.forEach((a) => lines.push(`- id: ${a.id} | jenis: ${a.kind} | nama berkas: ${a.name}`));
  lines.push("</aset_pelanggan>");

  if (req.voiceover) {
    lines.push(`<voiceover_pelanggan durasi_detik="${req.voiceover.seconds.toFixed(1)}">`);
    req.voiceover.segments.forEach((sg) => lines.push(`[${sg.start.toFixed(1)}–${sg.end.toFixed(1)}] ${sg.text}`));
    lines.push("</voiceover_pelanggan>");
  }

  lines.push("<ide>");
  lines.push(req.idea || "(tidak ada; susun brief dari voice-over)");
  lines.push("</ide>");
  lines.push("Susun brief, durasi, dan storyboard sesuai aturan dan format JSON yang diminta.");

  return { system, userText: lines.join("\n") };
}
