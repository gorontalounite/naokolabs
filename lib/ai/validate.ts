import { countWords, readingSeconds } from "@/lib/video-data";
import type { Plan, PlanRequest } from "./schema";

// Aturan kualitas yang ditegakkan kode, bukan hanya diminta di prompt.
// Sumber: docs/FULLSET-SPEC.md, docs/STORYBOARD-PREVIEW.md, aturan copy dari referensi motion design.

export type Issue = { level: "error" | "warning"; scene?: number; message: string };

const SCENE_RANGE: Record<number, [number, number]> = { 15: [2, 4], 30: [3, 6], 60: [5, 9] };
const MAX_WORDS_PER_LINE = 8;
const MAX_LINES = 2;
const CAPTION_LIMIT = 2200; // batas caption Instagram

export function validatePlan(plan: Plan, req: PlanRequest): Issue[] {
  const issues: Issue[] = [];
  if (plan.status !== "ok") return issues; // needs_input / unsupported ditangani pemanggil

  const [minScenes, maxScenes] = SCENE_RANGE[req.duration];
  if (plan.scenes.length < minScenes || plan.scenes.length > maxScenes) {
    issues.push({ level: "error", message: `Jumlah adegan ${plan.scenes.length}; untuk ${req.duration} detik gunakan ${minScenes}–${maxScenes} adegan.` });
  }

  const total = plan.scenes.reduce((n, s) => n + s.seconds, 0);
  if (Math.abs(total - req.duration) > 3) {
    issues.push({ level: "error", message: `Total durasi ${total} detik; target ${req.duration} detik (toleransi 3 detik).` });
  }

  const assetIds = new Set(req.assets.map((a) => a.id));
  plan.scenes.forEach((s, i) => {
    const n = i + 1;
    const lines = s.screenText.split("\n").filter((l) => l.trim());
    if (lines.length > MAX_LINES) issues.push({ level: "error", scene: n, message: `Teks layar ${lines.length} baris; maksimal ${MAX_LINES}.` });
    lines.forEach((line) => {
      if (countWords(line) > MAX_WORDS_PER_LINE) issues.push({ level: "error", scene: n, message: `Baris "${line}" lebih dari ${MAX_WORDS_PER_LINE} kata.` });
    });
    if (req.vo) {
      if (!s.narration.trim()) issues.push({ level: "error", scene: n, message: "Narasi kosong padahal voice-over aktif." });
      if (readingSeconds(s.narration) > s.seconds + 1) issues.push({ level: "error", scene: n, message: `Narasi butuh ± ${readingSeconds(s.narration)} detik, adegan hanya ${s.seconds} detik.` });
      if (s.narration.trim() && s.screenText.trim() && normalize(s.narration) === normalize(s.screenText)) {
        issues.push({ level: "warning", scene: n, message: "Teks layar sama persis dengan narasi; teks layar sebaiknya kata kunci saja." });
      }
    }
    if (s.seconds < 2) issues.push({ level: "error", scene: n, message: "Adegan kurang dari 2 detik." });
    if (s.assetId && !assetIds.has(s.assetId)) issues.push({ level: "error", scene: n, message: `Aset "${s.assetId}" tidak ada di unggahan klien.` });
  });

  if (!plan.caption.trim()) issues.push({ level: "error", message: "Caption kosong." });
  if (plan.caption.length > CAPTION_LIMIT) issues.push({ level: "error", message: `Caption ${plan.caption.length} karakter; maksimal ${CAPTION_LIMIT}.` });
  return issues;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function hasErrors(issues: Issue[]) {
  return issues.some((i) => i.level === "error");
}
