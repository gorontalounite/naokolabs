// Menyiapkan suara sebelum render (dijalankan worker): TTS ElevenLabs per adegan, unduh file, ukur durasi.
// Kunci ELEVENLABS_API_KEY hanya dibaca di sini (secret GitHub Actions), tidak pernah masuk spesifikasi.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { FPS, type SpecAudio, type VideoSpec } from "../video/spec";

const API = "https://api.elevenlabs.io/v1";
const MODEL = process.env.ELEVENLABS_TTS_MODEL || "eleven_multilingual_v2"; // mendukung Bahasa Indonesia
const PAD_FRAMES = 9; // jeda ± 0,3 detik setelah kalimat selesai

type AiVoice = Extract<NonNullable<SpecAudio["voice"]>, { mode: "ai" }>;
type VoiceInfo = { voice_id: string; name: string; labels?: Record<string, string> };

export const audioDir = path.resolve("video/public/audio");

export function durationSeconds(file: string) {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { encoding: "utf8" });
  return Number(out.trim());
}

async function pickVoice(key: string, want: AiVoice): Promise<string> {
  // Pengaturan eksplisit: ELEVENLABS_VOICE_PRIA_HANGAT dst. (atau ELEVENLABS_VOICE_PRIA).
  const env = process.env[`ELEVENLABS_VOICE_${want.kind}_${want.style}`.toUpperCase()] || process.env[`ELEVENLABS_VOICE_${want.kind}`.toUpperCase()];
  if (env) return env;
  const res = await fetch(`${API}/voices`, { headers: { "xi-api-key": key } });
  if (!res.ok) throw new Error(`Daftar suara gagal (${res.status})`);
  const { voices } = (await res.json()) as { voices: VoiceInfo[] };
  const gender = want.kind === "pria" ? "male" : "female";
  const match = voices.filter((v) => v.labels?.gender === gender);
  const pool = match.length ? match : voices;
  if (!pool.length) throw new Error("Akun ElevenLabs tidak punya suara yang bisa dipakai");
  // Utamakan suara dengan kecocokan gaya di deskripsi/usecase; bila tidak ada, pakai yang pertama.
  const hint: Record<string, RegExp> = { hangat: /warm|calm|narrat|soft/i, tegas: /deep|authorit|strong|confident/i, ramah: /friendly|warm|soft|casual/i, energik: /energ|upbeat|young|cheer/i };
  const best = pool.find((v) => hint[want.style].test(Object.values(v.labels ?? {}).join(" "))) ?? pool[0];
  console.log(`suara dipilih: ${best.name} (${best.voice_id})`);
  return best.voice_id;
}

async function tts(key: string, voiceId: string, text: string, outFile: string) {
  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, language_code: "id" }),
  });
  if (!res.ok) throw new Error(`TTS gagal (${res.status}): ${(await res.text()).slice(0, 200)}`);
  writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
}

async function fetchTo(url: string, outFile: string) {
  if (!/^https:\/\//.test(url)) {
    // Berkas lokal (uji): salin ke folder publik.
    if (!existsSync(url)) throw new Error(`Berkas audio tidak ditemukan: ${url}`);
    copyFileSync(url, outFile);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unduh audio gagal (${res.status})`);
  writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
}

/** Mengisi voiceSrc per adegan atau menyalin trek; menyesuaikan durasi adegan agar suara tidak terpotong. */
export async function prepareAudio(spec: VideoSpec): Promise<VideoSpec> {
  const audio = spec.audio;
  if (!audio?.voice && !audio?.music) return spec;
  mkdirSync(audioDir, { recursive: true });
  const next: VideoSpec = structuredClone(spec);

  if (audio.voice?.mode === "ai") {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ELEVENLABS_API_KEY belum diatur: suara AI tidak bisa dibuat");
    const voiceId = await pickVoice(key, audio.voice);
    for (const scene of next.scenes) {
      if (!scene.narration.trim()) continue;
      const rel = `audio/${scene.id}.mp3`;
      const file = path.join(audioDir, `${scene.id}.mp3`);
      await tts(key, voiceId, scene.narration, file);
      const frames = Math.ceil(durationSeconds(file) * FPS) + PAD_FRAMES;
      scene.voiceSrc = rel;
      if (frames > scene.frames) scene.frames = frames; // adegan diperpanjang bila narasi lebih panjang
    }
  } else if (audio.voice?.mode === "track") {
    const ext = path.extname(new URL(audio.voice.src, "https://x/").pathname) || ".mp3";
    const rel = `audio/voice${ext}`;
    await fetchTo(audio.voice.src, path.join(audioDir, `voice${ext}`));
    next.audio = { ...audio, voice: { mode: "track", src: rel } };
  }

  if (audio.music) {
    const ext = path.extname(audio.music.src.split("?")[0]) || ".mp3";
    const rel = `audio/music${ext}`;
    await fetchTo(audio.music.src, path.join(audioDir, `music${ext}`));
    next.audio = { ...(next.audio ?? audio), music: { src: rel } };
  }
  return next;
}
