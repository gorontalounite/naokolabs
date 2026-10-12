import { AbsoluteFill, Audio, Img, Sequence, Video, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneIcon } from "./icons";
import { FPS, HEIGHT, WIDTH, type SpecScene, type VideoSpec } from "./spec";

// Komposisi Remotion untuk dua gaya (D-23, D-25). Murni fungsi dari frame: sama di pratinjau dan render.
// Arah visual: motion graphic bergaya Apple: latar putih, huruf SF Pro (Inter di server render), ikon,
// kartu abu sangat muda bersudut besar, ruang kosong lega. Bukan krem, bukan gradien, bukan neon.
// Gerak: satu aksi utama per adegan, spring halus tanpa memantul berlebihan, tanpa potongan keras.

// SF Pro dipakai di perangkat Apple lewat font sistem; server render Linux memakai Inter (dimuat di video/index.tsx).
const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Helvetica Neue", Arial, sans-serif';
const EXIT = 8; // frame memudar di akhir adegan

type Palette = { bg: string; fg: string; muted: string; accent: string; tint: string; card: string; line: string };

function palette(spec: VideoSpec): Palette {
  const { accent, ink } = spec.brand;
  return { bg: "#FFFFFF", fg: ink, muted: "#86868B", accent, tint: `${accent}1A`, card: "#F5F5F7", line: "#D2D2D7" };
}

function useFade(frames: number) {
  const f = useCurrentFrame();
  return interpolate(f, [frames - EXIT, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const useSpring = (delay = 0, damping = 22, stiffness = 130) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};

function IconTile({ name, size, pal, solid = false, delay = 0 }: { name?: string; size: number; pal: Palette; solid?: boolean; delay?: number }) {
  const p = useSpring(delay, 16, 140);
  return (
    <div style={{ display: "grid", placeItems: "center", width: size, height: size, borderRadius: size * 0.28, background: solid ? pal.accent : pal.tint, color: solid ? "#fff" : pal.accent, transform: `scale(${0.6 + p * 0.4})`, opacity: p, flex: "none" }}>
      <SceneIcon name={name} size={size * 0.5} strokeWidth={1.75} />
    </div>
  );
}

function Words({ text, size, color, weight = 700, delay = 0, align = "left" }: { text: string; size: number; color: string; weight?: number; delay?: number; align?: "left" | "center" }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: align === "center" ? "center" : "flex-start", fontSize: size, fontWeight: weight, lineHeight: 1.08, letterSpacing: "-0.03em", color, textAlign: align }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: f - delay - i * 3, fps, config: { damping: 20, stiffness: 150 } });
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 28}px)` }}>{w}</span>;
      })}
    </div>
  );
}

function fit(lines: string[], max: number, min: number) {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return Math.max(min, Math.min(max, Math.floor(860 / (longest * 0.56))));
}

function Media({ media, pal }: { media: NonNullable<SpecScene["media"]>; pal: Palette }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const style = { width: "100%", height: "100%", objectFit: "cover" as const };
  return (
    <div style={{ width: 880, height: 560, borderRadius: 56, overflow: "hidden", background: pal.card, opacity: p, transform: `scale(${0.95 + p * 0.05})` }}>
      {media.kind === "video" ? <Video src={media.url} muted style={style} /> : <Img src={media.url} style={style} />}
    </div>
  );
}

function Brand({ spec, pal }: { spec: VideoSpec; pal: Palette }) {
  const p = useSpring(14);
  const { name, handle, tagline } = spec.brand;
  if (!name && !handle && !tagline) return null;
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      {name && <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.02em", color: pal.fg }}>{name}</div>}
      {handle && <div style={{ fontSize: 42, fontWeight: 500, color: pal.muted }}>{handle}</div>}
      {tagline && <div style={{ marginTop: 14, padding: "26px 52px", borderRadius: 999, background: pal.accent, color: "#fff", fontSize: 42, fontWeight: 600 }}>{tagline}</div>}
    </div>
  );
}

// Pembuka dan penutup dipakai bersama oleh kedua gaya.
function Bookend({ scene, last, spec, pal }: { scene: SpecScene; last: boolean; spec: VideoSpec; pal: Palette }) {
  const fade = useFade(scene.frames);
  const lines = scene.lines.length ? scene.lines : [spec.title];
  const size = fit(lines, last ? 120 : 150, 76);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", opacity: fade, gap: 64 }}>
      <IconTile name={scene.icon} size={last ? 190 : 260} pal={pal} solid={last} />
      <div style={{ display: "grid", gap: 8 }}>{lines.map((l, i) => <Words key={i} text={l} size={size} color={i === 0 ? pal.fg : pal.muted} align="center" delay={6 + i * 6} />)}</div>
      {last && <Brand spec={spec} pal={pal} />}
    </AbsoluteFill>
  );
}

// ---------- Motion Graphic ----------
function MgScene({ scene, index, total, spec, pal }: { scene: SpecScene; index: number; total: number; spec: VideoSpec; pal: Palette }) {
  const fade = useFade(scene.frames);
  const rise = useSpring(0, 24, 120);
  if (index === 0 || index === total - 1) return <Bookend scene={scene} last={index !== 0} spec={spec} pal={pal} />;
  const lines = scene.lines.length ? scene.lines : [spec.title];
  const size = fit(lines, 128, 74);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 70px", opacity: fade, gap: 56 }}>
      {scene.media && <Media media={scene.media} pal={pal} />}
      <div style={{ width: "100%", padding: "84px 72px", borderRadius: 72, background: pal.card, display: "grid", gap: 56, transform: `translateY(${(1 - rise) * 80}px)`, opacity: rise }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <IconTile name={scene.icon} size={170} pal={pal} delay={4} />
          <div style={{ padding: "14px 30px", borderRadius: 999, background: "#fff", color: pal.muted, fontSize: 38, fontWeight: 600 }}>{index} / {total - 2}</div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>{lines.map((l, i) => <Words key={i} text={l} size={size} color={i === 0 ? pal.fg : pal.muted} delay={8 + i * 6} />)}</div>
      </div>
    </AbsoluteFill>
  );
}

// ---------- Explainer ----------
function ExScene({ scene, index, total, spec, pal }: { scene: SpecScene; index: number; total: number; spec: VideoSpec; pal: Palette }) {
  const exitFade = useFade(scene.frames);
  // Kanvas bertahap: kartu tetap di layar antar-langkah; hanya langkah terakhir memudar ke penutup.
  const fade = index === total - 2 ? exitFade : 1;
  const grow = useSpring(0, 20, 120);
  if (index === 0 || index === total - 1) return <Bookend scene={scene} last={index !== 0} spec={spec} pal={pal} />;

  // Satu kanvas bertahap: kartu sebelumnya tetap terlihat (diredupkan), kartu baru tumbuh.
  const steps = spec.scenes.slice(1, total - 1);
  const cardH = Math.min(220, Math.floor(1240 / Math.max(steps.length, 1)) - 28);
  const gap = 28;
  const blockH = steps.length * cardH + (steps.length - 1) * gap;
  const top = Math.max(300, Math.round((HEIGHT - blockH) / 2));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", top: 170, left: 80, right: 80, textAlign: "center", color: pal.muted, fontSize: 40, fontWeight: 600 }}>{spec.title}</div>
      {steps.map((s, i) => {
        if (i > index - 1) return null;
        const current = i === index - 1;
        const text = (s.lines.length ? s.lines : [spec.title]).join(" ");
        const p = current ? grow : 1;
        return (
          <div key={s.id} style={{ position: "absolute", left: 70, right: 70, top: top + i * (cardH + gap), height: cardH, display: "flex", alignItems: "center", gap: 40, padding: "0 48px", borderRadius: 56, background: current ? "#fff" : pal.card, boxShadow: current ? "0 18px 60px rgba(0,0,0,0.12)" : "none", outline: current ? `4px solid ${pal.accent}` : "none", opacity: current ? p : 0.55, transform: current ? `translateY(${(1 - p) * 60}px)` : "none" }}>
            <IconTile name={s.icon} size={cardH * 0.58} pal={pal} solid={current} delay={current ? 3 : 0} />
            <div style={{ fontSize: fit([text], 64, 40), fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: pal.fg }}>{text}</div>
            {current && s.media && <div style={{ position: "absolute", left: 0, top: cardH + 40 }}><Media media={s.media} pal={pal} /></div>}
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
