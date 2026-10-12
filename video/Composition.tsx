import { AbsoluteFill, Audio, Img, Sequence, Video, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS, HEIGHT, WIDTH, type SpecScene, type VideoSpec } from "./spec";

// Komposisi Remotion untuk dua gaya (D-23). Murni fungsi dari frame: sama di pratinjau dan render.
// Pola gerak diambil dari ukuran video referensi: ≤ 4 kata per layar, satu aksi utama per adegan,
// gerak menyambung (tanpa potongan keras), teks lengkap ditahan ≥ 1 detik.

// var(--font-manrope, Manrope): di dashboard memakai font Next, di render memakai Manrope dari video/public.
const FONT = 'var(--font-manrope, Manrope), Manrope, "Helvetica Neue", Arial, sans-serif';
const EXIT = 8; // frame memudar di akhir adegan

type Palette = { bg: string; fg: string; muted: string; accent: string; card: string };

function palette(spec: VideoSpec): Palette {
  const { accent, ink } = spec.brand;
  return spec.style === "motion-graphic"
    ? { bg: "#0F1011", fg: "#F5F2EA", muted: "#8E8B84", accent, card: "#1A1B1D" }
    : { bg: "#F7F5F0", fg: ink, muted: "#A6A29A", accent, card: "#FFFFFF" };
}

function useFade(frames: number) {
  const f = useCurrentFrame();
  return interpolate(f, [frames - EXIT, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function Words({ text, size, color, weight = 800, delay = 0, align = "left" }: { text: string; size: number; color: string; weight?: number; delay?: number; align?: "left" | "center" }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: size * 0.28, justifyContent: align === "center" ? "center" : "flex-start", fontSize: size, fontWeight: weight, lineHeight: 1.05, letterSpacing: "-0.02em", color }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: f - delay - i * 4, fps, config: { damping: 18, stiffness: 140 } });
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
      })}
    </div>
  );
}

function fit(lines: string[], max: number, min: number) {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return Math.max(min, Math.min(max, Math.floor(880 / (longest * 0.56))));
}

function Media({ media, pal }: { media: NonNullable<SpecScene["media"]>; pal: Palette }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const style = { width: "100%", height: "100%", objectFit: "cover" as const };
  return (
    <div style={{ width: 880, height: 640, borderRadius: 40, overflow: "hidden", background: pal.card, opacity: p, transform: `scale(${0.94 + p * 0.06})` }}>
      {media.kind === "video" ? <Video src={media.url} muted style={style} /> : <Img src={media.url} style={style} />}
    </div>
  );
}

// ---------- Motion Graphic ----------
function MgScene({ scene, index, total, spec, pal }: { scene: SpecScene; index: number; total: number; spec: VideoSpec; pal: Palette }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(scene.frames);
  const first = index === 0;
  const last = index === total - 1;
  const lines = scene.lines.length ? scene.lines : [spec.title];
  const size = fit(lines, first ? 200 : 150, 80);
  const bar = spring({ frame: f - 6, fps, config: { damping: 20 } });

  if (last) {
    const ring = spring({ frame: f, fps, config: { damping: 22, stiffness: 90 } });
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: fade, gap: 56 }}>
        <div style={{ position: "absolute", width: 1500 * ring, height: 1500 * ring, borderRadius: "50%", background: pal.accent, opacity: 0.14 }} />
        {lines.map((l, i) => <Words key={i} text={l} size={size} color={pal.fg} align="center" delay={i * 6} />)}
        <div style={{ height: 8, width: 240 * bar, background: pal.accent, borderRadius: 4 }} />
        <div style={{ textAlign: "center", color: pal.muted, fontSize: 44, fontWeight: 600, lineHeight: 1.4 }}>
          {spec.brand.name && <div style={{ color: pal.fg, fontSize: 56, fontWeight: 800 }}>{spec.brand.name}</div>}
          {spec.brand.handle && <div>{spec.brand.handle}</div>}
          {spec.brand.tagline && <div style={{ marginTop: 12 }}>{spec.brand.tagline}</div>}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ padding: "230px 100px 380px", justifyContent: "center", opacity: fade, gap: 48 }}>
      {scene.media && <div style={{ display: "flex", justifyContent: "center" }}><Media media={scene.media} pal={pal} /></div>}
      {!first && (
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "grid", placeItems: "center", width: 96, height: 96, borderRadius: 28, background: pal.accent, color: "#fff", fontSize: 52, fontWeight: 800, transform: `scale(${bar})` }}>{index}</div>
          <div style={{ height: 6, width: 260 * bar, background: pal.accent, borderRadius: 3 }} />
        </div>
      )}
      {first && <div style={{ width: 160 * bar, height: 12, borderRadius: 6, background: pal.accent }} />}
      {lines.map((l, i) => <Words key={i} text={l} size={size} color={i === 0 ? pal.fg : pal.muted} delay={i * 8} />)}
    </AbsoluteFill>
  );
}

// ---------- Explainer ----------
function ExScene({ scene, index, total, spec, pal }: { scene: SpecScene; index: number; total: number; spec: VideoSpec; pal: Palette }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(scene.frames);
  const first = index === 0;
  const last = index === total - 1;
  const steps = spec.scenes.slice(1, total - 1);
  const lines = scene.lines.length ? scene.lines : [spec.title];

  if (first || last) {
    const size = fit(lines, 170, 80);
    const p = spring({ frame: f, fps, config: { damping: 20 } });
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90, opacity: fade, gap: 48 }}>
        {lines.map((l, i) => <Words key={i} text={l} size={size} color={pal.fg} align="center" delay={i * 6} />)}
        <div style={{ height: 8, width: 220 * p, background: pal.accent, borderRadius: 4 }} />
        {last && (
          <div style={{ textAlign: "center", color: pal.muted, fontSize: 44, fontWeight: 600, lineHeight: 1.4 }}>
            {spec.brand.name && <div style={{ color: pal.fg, fontSize: 56, fontWeight: 800 }}>{spec.brand.name}</div>}
            {spec.brand.handle && <div>{spec.brand.handle}</div>}
            {spec.brand.tagline && <div style={{ marginTop: 12 }}>{spec.brand.tagline}</div>}
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // Satu kanvas bertahap: langkah sebelumnya tetap terlihat (diredupkan), langkah baru tumbuh.
  const gap = Math.min(250, Math.floor(1100 / Math.max(steps.length, 1)));
  const top = Math.max(330, Math.round((HEIGHT - ((steps.length - 1) * gap + 104)) / 2));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", top: 190, left: 100, right: 100, color: pal.muted, fontSize: 40, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{spec.title}</div>
      {steps.map((s, i) => {
        const current = i === index - 1;
        const done = i < index - 1;
        if (i > index - 1) return null;
        const grow = current ? spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } }) : 1;
        const y = top + i * gap;
        const text = (s.lines.length ? s.lines : [spec.title]).join(" ");
        return (
          <div key={s.id}>
            {i > 0 && <div style={{ position: "absolute", left: 148, top: y - gap + 96, width: 6, height: (gap - 96) * (current ? grow : 1), background: done || current ? pal.accent : pal.muted, opacity: done ? 0.35 : 1, borderRadius: 3 }} />}
            <div style={{ position: "absolute", left: 100, top: y, right: 100, height: 96, display: "flex", alignItems: "center", gap: 36, opacity: done ? 0.4 : 1 }}>
              <div style={{ flex: "none", display: "grid", placeItems: "center", width: 104, height: 104, borderRadius: "50%", background: current ? pal.accent : pal.fg, color: current ? "#fff" : pal.bg, fontSize: 52, fontWeight: 800, transform: `scale(${grow})` }}>{i + 1}</div>
              <div style={{ fontSize: fit([text], 74, 46), fontWeight: 800, color: pal.fg, lineHeight: 1.1, opacity: grow, transform: `translateX(${(1 - grow) * 40}px)` }}>{text}</div>
            </div>
            {current && s.media && <div style={{ position: "absolute", left: 100, top: y + 130 }}><Media media={s.media} pal={pal} /></div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// Alamat berkas suara: URL penuh dipakai apa adanya (pratinjau), berkas lokal lewat staticFile (render).
const src = (s: string) => (/^(https?:|blob:|data:)/.test(s) ? s : staticFile(s));

// Backsound: masuk perlahan, mengecil saat ada narasi, keluar perlahan di akhir.
function Music({ file, spec, starts }: { file: string; spec: VideoSpec; starts: number[] }) {
  const total = spec.scenes.reduce((n, s) => n + s.frames, 0);
  const hasVoice = (i: number) => !!spec.scenes[i].voiceSrc || spec.audio?.voice?.mode === "track";
  return (
    <Audio
      src={src(file)}
      loop
      volume={(f) => {
        const idx = starts.findIndex((st, i) => f >= st && f < st + spec.scenes[i].frames);
        const base = idx >= 0 && hasVoice(idx) ? 0.18 : 0.55;
        const fadeIn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
        const fadeOut = interpolate(f, [total - 30, total], [1, 0], { extrapolateLeft: "clamp" });
        return base * fadeIn * fadeOut;
      }}
    />
  );
}

export function NaokoVideo({ spec }: { spec: VideoSpec }) {
  const pal = palette(spec);
  const starts = spec.scenes.map((_, i) => spec.scenes.slice(0, i).reduce((n, x) => n + x.frames, 0));
  const Scene = spec.style === "explainer" ? ExScene : MgScene;
  return (
    <AbsoluteFill style={{ background: pal.bg, fontFamily: FONT }}>
      {spec.scenes.map((scene, i) => (
        <Sequence key={scene.id} from={starts[i]} durationInFrames={scene.frames}>
          <Scene scene={scene} index={i} total={spec.scenes.length} spec={spec} pal={pal} />
          {scene.voiceSrc && <Audio src={src(scene.voiceSrc)} />}
        </Sequence>
      ))}
      {spec.audio?.voice?.mode === "track" && <Audio src={src(spec.audio.voice.src)} />}
      {spec.audio?.music && <Music file={spec.audio.music.src} spec={spec} starts={starts} />}
    </AbsoluteFill>
  );
}

export const composition = { id: "NaokoVideo", fps: FPS, width: WIDTH, height: HEIGHT };
