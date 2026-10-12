import type Anthropic from "@anthropic-ai/sdk";
import type { PlanRequest } from "../schema";
import type { SourceContent } from "../source";
import { GLOBAL_RULES } from "./global";
import { PLANNER_STAGE } from "./planner";
import { STYLE_PROFILES, TONE_GUIDE } from "./styles";

// Susunan prompt: [aturan global + tahap] → [profil gaya] → pesan pengguna berisi data.
// Bagian stabil di depan dengan penanda cache, data klien di belakang (prompt caching = prefix match).
export function buildPlannerPrompt(req: PlanRequest, source: SourceContent | null) {
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: `${GLOBAL_RULES}\n\n${PLANNER_STAGE}`, cache_control: { type: "ephemeral" } },
    {
      type: "text",
      text: STYLE_PROFILES[req.styleId] ?? STYLE_PROFILES["motion-graphic"],
      cache_control: { type: "ephemeral" },
    },
  ];

  const lines: string[] = [];
  lines.push("<pesanan>");
  lines.push(`Durasi: ${req.duration} detik, rasio 9:16`);
  lines.push(TONE_GUIDE[req.tone] ?? TONE_GUIDE.promosi);
  lines.push(`Voice-over: ${req.vo ? `aktif (${req.voice})` : "mati — kosongkan narration"}`);
  lines.push(`Musik latar: ${req.music ? "aktif" : "mati — kosongkan sound kecuali efek penting"}`);
  lines.push(`Subtitle: ${req.subtitles ? "aktif" : "mati"}`);
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

  lines.push(`<bahan sumber="${req.mode}">`);
  if (req.mode === "link" && source) {
    lines.push(`URL: ${source.url}`);
    if (source.title) lines.push(`Judul: ${source.title}`);
    if (source.description) lines.push(`Deskripsi: ${source.description}`);
    if (source.price) lines.push(`Harga di halaman: ${source.price}`);
    lines.push("Isi halaman:");
    lines.push(source.text);
  } else if (req.mode === "link" && req.pastedText) {
    lines.push(`URL: ${req.link}`);
    lines.push("Teks yang ditempel pelanggan:");
    lines.push(req.pastedText);
  } else if (req.mode === "naskah") {
    lines.push("Naskah dari pelanggan (pakai isinya; boleh dibagi ke adegan, jangan ubah fakta):");
    lines.push(req.script);
  } else {
    lines.push(`Ide singkat: ${req.idea}`);
  }
  lines.push("</bahan>");
  lines.push("Susun rencana video sesuai aturan dan format JSON yang diminta.");

  return { system, userText: lines.join("\n") };
}
