// Spesifikasi video: satu-satunya masukan komposisi Remotion (pratinjau di browser dan render di worker).
// Dibuat dari storyboard yang disetujui; tidak memuat kunci atau data akun.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type SpecScene = {
  id: string;
  frames: number;
  /** Baris teks di layar (maksimal 2). */
  lines: string[];
  narration: string;
  /** Footage pelanggan untuk adegan ini (URL), bila ada. */
  media?: { url: string; kind: "gambar" | "video" };
};

export type VideoSpec = {
  style: "motion-graphic" | "explainer";
  title: string;
  brand: { name: string; handle: string; tagline: string; accent: string; ink: string };
  scenes: SpecScene[];
};

export const specFrames = (spec: VideoSpec) => spec.scenes.reduce((n, s) => n + s.frames, 0);

type StoryboardScene = { id: string; seconds: number; screenText: string; narration: string };
type BrandKit = { name?: string; handle?: string; tagline?: string; primary?: string; secondary?: string };

const hex = /^#[0-9a-fA-F]{6}$/;

export function buildSpec(input: { style: string; title: string; scenes: StoryboardScene[]; brand?: BrandKit }): VideoSpec {
  const b = input.brand ?? {};
  return {
    style: input.style === "explainer" ? "explainer" : "motion-graphic",
    title: input.title,
    brand: {
      name: (b.name ?? "").trim(),
      handle: (b.handle ?? "").trim(),
      tagline: (b.tagline ?? "").trim(),
      accent: b.primary && hex.test(b.primary) ? b.primary : "#C43A24",
      ink: b.secondary && hex.test(b.secondary) ? b.secondary : "#171513",
    },
    scenes: input.scenes.map((s) => ({
      id: s.id,
      frames: Math.max(Math.round(s.seconds * FPS), FPS),
      lines: s.screenText.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2),
      narration: s.narration,
    })),
  };
}
