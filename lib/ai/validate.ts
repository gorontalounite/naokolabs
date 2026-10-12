import { countWords, MAX_VIDEO_SECONDS, MIN_VIDEO_SECONDS, readingSeconds } from "@/lib/video-data";
import type { Plan, PlanRequest } from "./schema";

// Aturan kualitas yang ditegakkan kode, bukan hanya diminta di prompt.
// Sumber: docs/FULLSET-SPEC.md, docs/STORYBOARD-PREVIEW.md, aturan copy dari referensi motion design.

export type Issue = { level: "error" | "warning"; scene?: number; message: string };

const SCENE_SECONDS: [number, number] = [2, 10]; // rata-rata durasi per adegan yang masih nyaman ditonton
const MAX_WORDS_PER_LINE = 8;
const MAX_LINES = 2;
const CAPTION_LIMIT = 2200; // batas caption Instagram

export function validatePlan(plan: Plan, req: PlanRequest): Issue[] {
  const issues: Issue[] = [];
  if (plan.status !== "ok") return issues; // needs_input / unsupported ditangani pemanggil

  if (plan.duration < MIN_VIDEO_SECONDS || plan.duration > MAX_VIDEO_SECONDS) {
    issues.push({ level: "error", message: `Durasi ${plan.duration} detik; gunakan ${MIN_VIDEO_SECONDS}–${MAX_VIDEO_SECONDS} detik sesuai isi ide.` });
  }

  const total = plan.scenes.reduce((n, s) => n + s.seconds, 0);
  const vo = req.voiceover;
  if (vo) {
    if (Math.abs(plan.duration - Math.round(vo.seconds)) > 2) {
      issues.push({ level: "error", message: `Durasi ${plan.duration} detik harus mengikuti voice-over (${Math.round(vo.seconds)} detik).` });
    }
    const spoken = normalize(plan.scenes.map((sc) => sc.narration).join(" "));
    if (spoken !== normalize(vo.transcript)) {
      issues.push({ level: "error", message: "Narasi harus sama persis dengan transkrip voice-over, berurutan, tanpa kata ditambah atau dibuang." });
    }
  }
  if (Math.abs(total - plan.duration) > 2) {
    issues.push({ level: "error", message: `Total durasi adegan ${total} detik tidak sama dengan durasi video ${plan.duration} detik.` });
  }

  const minScenes = Math.max(2, Math.ceil(plan.duration / SCENE_SECONDS[1]));
  const maxScenes = Math.max(minScenes, Math.floor(plan.duration / SCENE_SECONDS[0]));
  if (plan.scenes.length < minScenes || plan.scenes.length > maxScenes) {
    issues.push({ level: "error", message: `Jumlah adegan ${plan.scenes.length}; untuk ${plan.duration} detik gunakan ${minScenes}–${maxScenes} adegan.` });
  }

  if (!plan.brief.keyMessage.trim()) issues.push({ level: "error", message: "Brief belum punya pesan utama." });

  const assetIds = new Set(req.assets.map((a) => a.id));
  plan.scenes.forEach((s, i) => {
    const n = i + 1;
    const lines = s.screenText.split("\n").filter((l) => l.trim());
    if (lines.length > MAX_LINES) issues.push({ level: "error", scene: n, message: `Teks layar ${lines.length} baris; maksimal ${MAX_LINES}.` });
    lines.forEach((line) => {
      if (countWords(line) > MAX_WORDS_PER_LINE) issues.push({ level: "error", scene: n, message: `Baris "${line}" lebih dari ${MAX_WORDS_PER_LINE} kata.` });
    });
    if (req.vo && !vo) {
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
