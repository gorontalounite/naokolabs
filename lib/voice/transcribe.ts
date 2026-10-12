import type { Voiceover, VoiceoverSegment } from "@/lib/ai/schema";

// Transkripsi voice-over pelanggan lewat ElevenLabs Speech-to-Text (D-21).
// Kunci hanya dibaca di server; file audio tidak disimpan.

const STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
export const MAX_AUDIO_BYTES = 4 * 1024 * 1024; // batas body fungsi Vercel ± 4,5 MB
export const MIN_AUDIO_SECONDS = 3;
export const MAX_AUDIO_SECONDS = 60;

type SttWord = { text: string; start?: number; end?: number; type?: string };
type SttResponse = { text?: string; language_code?: string; words?: SttWord[] };

export type TranscribeResult = ({ ok: true } & Voiceover & { language?: string }) | { ok: false; status: number; error: string };

export function transcriptionEnabled() {
  return !!process.env.ELEVENLABS_API_KEY;
}

export async function transcribe(file: File): Promise<TranscribeResult> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return { ok: false, status: 503, error: "Transkripsi voice-over belum aktif." };

  const form = new FormData();
  form.append("model_id", process.env.ELEVENLABS_STT_MODEL || "scribe_v2");
  form.append("file", file, file.name);
  form.append("timestamps_granularity", "word");
  form.append("tag_audio_events", "false");

  let res: Response;
  try {
    res = await fetch(STT_URL, { method: "POST", headers: { "xi-api-key": key }, body: form, signal: AbortSignal.timeout(45_000) });
  } catch {
    return { ok: false, status: 504, error: "Layanan transkripsi tidak merespons. Coba lagi." };
  }
  if (!res.ok) {
    console.error("stt_error", res.status, (await res.text().catch(() => "")).slice(0, 300));
    if (res.status === 401 || res.status === 403) return { ok: false, status: 502, error: "Kunci layanan suara tidak valid. Hubungi admin." };
    if (res.status === 429 || res.status === 402) return { ok: false, status: 503, error: "Kuota layanan suara sedang habis. Coba lagi nanti." };
    if (res.status === 422 || res.status === 400) return { ok: false, status: 422, error: "File audio tidak bisa dibaca. Gunakan MP3 atau M4A." };
    return { ok: false, status: 502, error: `Transkripsi gagal (${res.status}).` };
  }

  const data = (await res.json()) as SttResponse;
  const words = (data.words ?? []).filter((w) => w.type === undefined || w.type === "word");
  const transcript = (data.text ?? words.map((w) => w.text).join(" ")).replace(/\s+/g, " ").trim();
  if (!transcript) return { ok: false, status: 422, error: "Tidak ada suara bicara yang terdeteksi di file ini." };

  const segments = toSegments(words, transcript);
  const seconds = Math.max(segments[segments.length - 1]?.end ?? 0, 0);
  if (seconds > MAX_AUDIO_SECONDS + 1) return { ok: false, status: 422, error: `Voice-over ${Math.round(seconds)} detik; maksimal ${MAX_AUDIO_SECONDS} detik.` };

  return { ok: true, fileName: file.name, transcript, seconds: Math.max(seconds, MIN_AUDIO_SECONDS), segments, language: data.language_code };
}

// Gabungkan kata menjadi kalimat: putus di tanda baca akhir atau jeda bicara > 0,6 detik.
export function toSegments(words: SttWord[], transcript: string): VoiceoverSegment[] {
  const timed = words.filter((w) => typeof w.start === "number" && typeof w.end === "number" && w.text.trim());
  if (timed.length === 0) return [{ text: transcript, start: 0, end: Math.max(MIN_AUDIO_SECONDS, transcript.split(/\s+/).length / 2.3) }];

  const segments: VoiceoverSegment[] = [];
  let current: SttWord[] = [];
  const flush = () => {
    if (!current.length) return;
    segments.push({ text: current.map((w) => w.text.trim()).join(" "), start: round(current[0].start!), end: round(current[current.length - 1].end!) });
    current = [];
  };
  timed.forEach((w, i) => {
    current.push(w);
    const next = timed[i + 1];
    const gap = next ? next.start! - w.end! : 0;
    if (/[.!?…]$/.test(w.text.trim()) || gap > 0.6 || current.length >= 25) flush();
  });
  flush();
  return segments;
}

const round = (n: number) => Math.round(n * 100) / 100;
