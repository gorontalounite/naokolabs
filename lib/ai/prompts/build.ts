import type Anthropic from "@anthropic-ai/sdk";
import type { PlanRequest } from "../schema";
import { GLOBAL_RULES } from "./global";
import { PLANNER_STAGE } from "./planner";
import { examplePrompt } from "./examples";
import { stylePrompt } from "./styles/index";
import { TONE_GUIDE } from "./tones";

// Susunan prompt: [aturan global + tahap] → [system prompt gaya] → [arahan contoh video] → pesan pengguna berisi data.
// Bagian stabil di depan dengan penanda cache, data klien di belakang (prompt caching = prefix match).
export function buildPlannerPrompt(req: PlanRequest) {
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: `${GLOBAL_RULES}\n\n${PLANNER_STAGE}`, cache_control: { type: "ephemeral" } },
    { type: "text", text: stylePrompt(req.styleId), cache_control: { type: "ephemeral" } },
  ];
  // Contoh video hanya berlaku untuk gaya yang sama.
  const example = examplePrompt(req.exampleId);
  if (example && example.includes(`style="${req.styleId}"`)) {
    system.push({ type: "text", text: `Pelanggan memilih video contoh berikut sebagai acuan tampilan dan ritme. Ikuti arahannya, tetapi isi dan fakta tetap dari ide dan brand kit pelanggan.\n${example}`, cache_control: { type: "ephemeral" } });
  }

  const lines: string[] = [];
  lines.push("<pesanan>");
  lines.push("Format: rasio 9:16 (Reels, Story, TikTok); durasi Anda tentukan dari isi ide");
  lines.push(TONE_GUIDE[req.tone] ?? TONE_GUIDE.promosi);
  lines.push(`Voice-over: ${req.vo ? `aktif (${req.voice})` : "mati — kosongkan narration"}`);
  lines.push(`Musik latar: ${req.music ? "aktif" : "mati — kosongkan sound kecuali efek penting"}`);
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

  lines.push("<ide>");
  lines.push(req.idea);
  lines.push("</ide>");
  lines.push("Susun brief, durasi, dan storyboard sesuai aturan dan format JSON yang diminta.");

  return { system, userText: lines.join("\n") };
}
