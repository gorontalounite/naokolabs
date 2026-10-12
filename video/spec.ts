// Spesifikasi video: satu-satunya masukan komposisi Remotion (pratinjau di browser dan render di worker).
// Dibuat dari storyboard yang disetujui; tidak memuat kunci atau data akun.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type SpecScene = {
  id: string;
  frames: number;
  /** Berkas suara narasi adegan (diisi worker setelah TTS), relatif terhadap video/public. */
  voiceSrc?: string;
  /** Nama ikon (video/icons.tsx). */
  icon?: string;
  /** Baris teks di layar (maksimal 2). */
  lines: string[];
  narration: string;
  /** Footage pelanggan untuk adegan ini (URL), bila ada. */
  media?: { url: string; kind: "gambar" | "video" };
};

// Suara (D-22): default tanpa suara dan tanpa musik. Worker mengisi voiceSrc dan mengunduh src URL ke video/public.
export type SpecAudio = {
  voice?: { mode: "ai"; kind: "pria" | "wanita"; style: "hangat" | "tegas" | "ramah" | "energik" } | { mode: "track"; src: string };
  music?: { src: string };
};

export type VideoSpec = {
  style: "motion-graphic" | "explainer";
  title: string;
  audio?: SpecAudio;
  brand: { name: string; handle: string; tagline: string; accent: string; ink: string };
  scenes: SpecScene[];
};

export const specFrames = (spec: VideoSpec) => spec.scenes.reduce((n, s) => n + s.frames, 0);

type StoryboardScene = { id: string; seconds: number; screenText: string; narration: string; icon?: string; media?: { url: string; kind: "gambar" | "video" } };
export type AudioChoice = { voMode: "none" | "upload" | "ai"; voice: string; musicMode: "none" | "upload" | "library" };
type BrandKit = { name?: string; handle?: string; tagline?: string; primary?: string; secondary?: string };

const hex = /^#[0-9a-fA-F]{6}$/;

export function buildSpec(input: { style: string; title: string; scenes: StoryboardScene[]; brand?: BrandKit; audio?: AudioChoice }): VideoSpec {
  const b = input.brand ?? {};
  return {
    style: input.style === "explainer" ? "explainer" : "motion-graphic",
    title: input.title,
    audio: input.audio?.voMode === "ai" ? { voice: aiVoice(input.audio.voice) } : undefined,
    brand: {
      name: (b.name ?? "").trim(),
      handle: (b.handle ?? "").trim(),
      tagline: (b.tagline ?? "").trim(),
      // Merah bawaan formulir Brand Kit dianggap belum diisi; video memakai biru Apple (D-25).
      accent: b.primary && hex.test(b.primary) && b.primary.toLowerCase() !== "#c43a24" ? b.primary : "#0071E3",
      ink: b.secondary && hex.test(b.secondary) && b.secondary.toLowerCase() !== "#1d1d1b" ? b.secondary : "#1D1D1F",
    },
    scenes: input.scenes.map((s) => ({
      id: s.id,
      frames: Math.max(Math.round(s.seconds * FPS), FPS),
      lines: s.screenText.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2),
      narration: s.narration,
      icon: s.icon,
      media: s.media,
    })),
  };
}

const VOICES: Record<string, NonNullable<Extract<NonNullable<SpecAudio["voice"]>, { mode: "ai" }>>> = {
  "pria-hangat": { mode: "ai", kind: "pria", style: "hangat" },
  "pria-tegas": { mode: "ai", kind: "pria", style: "tegas" },
  "wanita-ramah": { mode: "ai", kind: "wanita", style: "ramah" },
  "wanita-energik": { mode: "ai", kind: "wanita", style: "energik" },
};

function aiVoice(id: string) {
  return VOICES[id] ?? VOICES["pria-hangat"];
}
