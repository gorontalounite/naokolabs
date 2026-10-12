"use client";

import { Check, FileAudio, LoaderCircle, Trash2, Wand2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AssetPicker, type PickedAsset } from "@/components/dashboard/AssetPicker";
import { StylePreview } from "@/components/dashboard/StylePreview";
import { VoiceoverUpload } from "@/components/dashboard/VoiceoverUpload";
import type { Plan, Voiceover } from "@/lib/ai/schema";
import { planToVideo } from "@/lib/plan-to-video";
import { tones, voices, type VideoStyle } from "@/lib/video-data";
import { saveLocalVideo } from "@/lib/video-store";

const STORAGE_KEY = "naokolabs:studio-draft";
const IDEA_MAX = 1000;
const MUSIC_MAX_BYTES = 30 * 1024 * 1024;
const ideaExamples = ["3 alasan kopi lokal lebih segar", "Promo pembukaan cabang baru, diskon 20% minggu pertama", "Cara merawat sepatu kulit agar awet", "Ucapan Hari Santri dari brand kami"];

// Default tanpa suara dan tanpa musik: dashboard hanya menambahkan bila pengguna memintanya (D-22).
type VoMode = "none" | "upload" | "ai";
type MusicMode = "none" | "upload" | "library";
type Draft = { idea: string; tone: string; styleId: string; voMode: VoMode; voice: string; musicMode: MusicMode };

export type StudioReference = { id: string; title: string; file: string; style: string };
export type StudioSample = StudioReference & { thumbnail: string };

const initialDraft: Draft = { idea: "", tone: "promosi", styleId: "motion-graphic", voMode: "none", voice: voices[0].id, musicMode: "none" };

function pickDraft(raw: Partial<Draft>): Draft {
  const d = { ...initialDraft };
  if (typeof raw.idea === "string") d.idea = raw.idea.slice(0, IDEA_MAX);
  if (tones.some((t) => t.id === raw.tone)) d.tone = raw.tone!;
  if (typeof raw.styleId === "string") d.styleId = raw.styleId;
  if (raw.voMode === "ai" || raw.voMode === "upload" || raw.voMode === "none") d.voMode = raw.voMode;
  if (voices.some((v) => v.id === raw.voice)) d.voice = raw.voice!;
  if (raw.musicMode === "none" || raw.musicMode === "upload" || raw.musicMode === "library") d.musicMode = raw.musicMode;
  return d;
}

function Step({ no, title, desc, children, id }: { no: number; title: string; desc?: string; children: React.ReactNode; id?: string }) {
  const headingId = `langkah-${no}`;
  return (
    <section className="panel studio-step" aria-labelledby={headingId} id={id}>
      <div className="studio-step-head">
        <span className="studio-step-no" aria-hidden="true">{no}</span>
        <div>
          <h2 id={headingId}>{title}</h2>
          {desc && <p>{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function SampleThumb({ sample, pressed, onClick }: { sample: StudioSample; pressed: boolean; onClick: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button type="button" className="sample" aria-pressed={pressed} onClick={onClick} title={sample.file}>
      {broken ? <StylePreview styleId={sample.style} /> : (
        // eslint-disable-next-line @next/next/no-img-element -- thumbnail dari Google Drive
        <img src={sample.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
      )}
      <span className="sample-name">{sample.title}</span>
      {pressed && <span className="style-option-check" style={{ display: "grid" }} aria-hidden="true"><Check size={14} /></span>}
    </button>
  );
}

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; title: string; text: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="fieldset stack-s">
      <legend className="eyebrow" style={{ marginBottom: 8 }}>{label}</legend>
      <div className="options options-3">
        {options.map((o) => (
          <button key={o.id} type="button" className="option" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            <span className="option-title" style={{ fontSize: 15 }}>{o.title}</span>
            <span className="option-text">{o.text}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Studio({ styles, presetStyle, presetIdea, reference, samples = {}, sampleTotals = {} }: {
  styles: VideoStyle[]; presetStyle?: string; presetIdea?: string; reference?: StudioReference | null;
  samples?: Record<string, StudioSample[]>; sampleTotals?: Record<string, number>;
}) {
  const router = useRouter();
  const musicInputId = useId();
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [ref, setRef] = useState<StudioReference | null>(reference ?? null);
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<PickedAsset[]>([]);
  const [rights, setRights] = useState(false);
  const [rightsError, setRightsError] = useState("");
  const [voiceover, setVoiceover] = useState<Voiceover | null>(null);
  const [voRights, setVoRights] = useState(false);
  const [voError, setVoError] = useState("");
  const [music, setMusic] = useState<{ name: string; size: number } | null>(null);
  const [musicError, setMusicError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const loaded = useRef(false);
  const ideaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let next = initialDraft;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) next = pickDraft(JSON.parse(raw));
    } catch {
      // Storage diblokir atau draf rusak: mulai dari awal.
    }
    if (!styles.some((s) => s.id === next.styleId)) next = { ...next, styleId: styles[0]?.id ?? initialDraft.styleId };
    if (presetStyle && styles.some((s) => s.id === presetStyle)) next = { ...next, styleId: presetStyle };
    if (reference && styles.some((s) => s.id === reference.style)) next = { ...next, styleId: reference.style };
    if (presetIdea) next = { ...next, idea: presetIdea.slice(0, IDEA_MAX) };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan draf setelah hidrasi
    setDraft(next);
    loaded.current = true;
  }, [presetStyle, presetIdea, reference, styles]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Draf hanya kenyamanan; abaikan bila tidak bisa disimpan.
    }
  }, [draft]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const pickMusic = (file: File | undefined) => {
    setMusicError("");
    if (!file) return;
    if (!file.type.startsWith("audio/") && !/\.(mp3|m4a|wav|aac|ogg)$/i.test(file.name)) return setMusicError("Gunakan file audio MP3, M4A atau WAV.");
    if (file.size > MUSIC_MAX_BYTES) return setMusicError("File musik maksimal 30 MB.");
    setMusic({ name: file.name, size: file.size });
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const useUpload = draft.voMode === "upload";
    if (!useUpload && draft.idea.trim().length < 5) {
      setError("Tulis ide video Anda, minimal satu kalimat pendek.");
      ideaRef.current?.focus();
      return;
    }
    const valid = assets.filter((a) => !a.error);
    if (valid.length > 0 && !rights) { setRightsError("Konfirmasi hak pemakaian footage dulu."); return scrollTo("footage"); }
    if (useUpload && !voiceover) { setVoError("Unggah file voice-over dulu, atau pilih Tanpa suara."); return scrollTo("suara"); }
    if (useUpload && !voRights) { setVoError("Konfirmasi hak pemakaian rekaman suara dulu."); return scrollTo("suara"); }
    if (draft.musicMode === "upload" && !music) { setMusicError("Pilih file backsound dulu, atau pilih Tanpa backsound."); return scrollTo("suara"); }

    let brand: { name?: string; handle?: string; tagline?: string } = {};
    try {
      brand = JSON.parse(localStorage.getItem("naokolabs:brand-kit") ?? "{}");
    } catch {
      // Brand kit opsional.
    }

    const assetList = valid.map((a) => ({ id: a.key, name: a.name, kind: a.kind }));
    if (draft.musicMode === "upload" && music) assetList.push({ id: `musik:${music.name}`, name: music.name, kind: "audio" });

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/rencana", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idea: draft.idea.trim(),
          tone: draft.tone,
          styleId: draft.styleId,
          exampleId: ref && ref.style === draft.styleId ? ref.id : undefined,
          vo: draft.voMode !== "none",
          voice: draft.voice,
          voiceover: useUpload ? voiceover : undefined,
          music: draft.musicMode !== "none",
          musicSource: draft.musicMode,
          brand: { name: brand.name ?? "", handle: brand.handle ?? "", tagline: brand.tagline ?? "" },
          assets: assetList,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Brief gagal disusun. Coba lagi.");
        return;
      }
      const video = planToVideo(data.plan as Plan, {
        tone: draft.tone,
        styleId: draft.styleId,
        exampleTitle: ref && ref.style === draft.styleId ? ref.title : undefined,
        brand: brand.name ?? "",
        idea: draft.idea.trim(),
        voiceover: useUpload && voiceover ? { fileName: voiceover.fileName, seconds: voiceover.seconds } : undefined,
        assetNames: Object.fromEntries(assetList.map((a) => [a.id, a.name])),
        plannerMode: data.mode,
        warnings: (data.issues ?? []).map((i: { scene?: number; message: string }) => (i.scene ? `Adegan ${i.scene}: ${i.message}` : i.message)),
      });
      saveLocalVideo(video);
      router.push(`/app/video/${video.id}`);
    } catch {
      setError("Koneksi terputus. Periksa internet lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="stack">
      <Step no={1} title={draft.voMode === "upload" ? "Tulis ide video (opsional)" : "Tulis ide video Anda"}
        desc={draft.voMode === "upload"
          ? "Anda memakai voice-over sendiri: brief dan durasi mengikuti rekaman. Ide di sini hanya konteks tambahan."
          : "Satu atau dua kalimat cukup. Kami ubah menjadi brief konten dan storyboard; durasi menyesuaikan isi ide."}>
        <div className="field">
          <label className="sr-only" htmlFor="idea">Ide video</label>
          <textarea id="idea" ref={ideaRef} className="textarea idea-input" maxLength={IDEA_MAX}
            placeholder="Contoh: 3 alasan kopi lokal lebih segar"
            value={draft.idea} onChange={(e) => set("idea", e.target.value)} aria-invalid={!!error} aria-describedby="idea-meta" />
          <div id="idea-meta" className="idea-meta">
            <span>Sebut jumlah poin bila ada, misalnya “3 alasan” atau “5 langkah”.</span>
            <span>{draft.idea.length}/{IDEA_MAX}</span>
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
        </div>
        {!draft.idea.trim() && (
          <div className="stack-s">
            <span className="eyebrow">Contoh ide</span>
            <div className="idea-examples">
              {ideaExamples.map((ex) => (
                <button key={ex} type="button" className="chip" onClick={() => { set("idea", ex); ideaRef.current?.focus(); }}>{ex}</button>
              ))}
            </div>
          </div>
        )}
        <fieldset className="fieldset stack-s">
          <legend className="eyebrow" style={{ marginBottom: 8 }}>Nada bicara</legend>
          <div className="chips">
            {tones.map((t) => (
              <button key={t.id} type="button" className="chip" aria-pressed={draft.tone === t.id} title={t.desc} onClick={() => set("tone", t.id)}>{t.label}</button>
            ))}
          </div>
        </fieldset>
      </Step>

      <Step no={2} title="Pilih gaya video">
        <div className="style-grid style-grid-2" role="group" aria-label="Gaya video">
          {styles.map((s) => (
            <button key={s.id} type="button" className="style-option" aria-pressed={draft.styleId === s.id} onClick={() => set("styleId", s.id)}>
              <span className="style-option-check" aria-hidden="true"><Check size={14} /></span>
              <StylePreview styleId={s.id} />
              <span className="style-option-name">{s.name}</span>
            </button>
          ))}
        </div>
        {(samples[draft.styleId]?.length ?? 0) > 0 && (
          <div className="stack-s">
            <span className="eyebrow">Pilih contoh sebagai acuan (opsional)</span>
            <div className="sample-strip" role="group" aria-label="Contoh video">
              {samples[draft.styleId].map((smp) => (
                <SampleThumb key={smp.id} sample={smp} pressed={ref?.id === smp.id} onClick={() => setRef(ref?.id === smp.id ? null : smp)} />
              ))}
              <Link href={`/app/gaya?gaya=${draft.styleId}`} className="sample-more">
                <span>Lihat semua</span>
                <small>{sampleTotals[draft.styleId] ?? 0} contoh</small>
              </Link>
            </div>
          </div>
        )}
        {ref && (
          <div className="ref-chip" role="status">
            <span>Acuan: <strong>{ref.title}</strong> <span className="hint">({ref.file})</span>{ref.style !== draft.styleId && <span className="hint"> · tidak dipakai karena gayanya berbeda</span>}</span>
            <button type="button" className="icon-btn" aria-label="Hapus acuan" onClick={() => setRef(null)}><X size={16} aria-hidden="true" /></button>
          </div>
        )}
      </Step>

      <Step no={3} id="footage" title="Footage (opsional)" desc="Foto atau video Anda. Tanpa footage, video dibuat dari tipografi, bentuk dan ikon.">
        <AssetPicker
          assets={assets}
          onChange={(next) => setAssets(next)}
          rights={rights}
          onRightsChange={(v) => { setRights(v); setRightsError(""); }}
          rightsError={rightsError}
        />
      </Step>

      <Step no={4} id="suara" title="Voice-over & backsound (opsional)" desc="Tanpa pilihan di sini, video dibuat tanpa suara narasi dan tanpa musik.">
        <Choice label="Voice-over" value={draft.voMode} onChange={(v) => { set("voMode", v); setVoError(""); }} options={[
          { id: "none", title: "Tanpa suara", text: "Pesan dibawa teks di layar" },
          { id: "upload", title: "Unggah voice-over", text: "Rekaman narasi yang sudah jadi" },
          { id: "ai", title: "Tambahkan suara AI", text: "Naskah dibacakan suara AI" },
        ]} />
        {draft.voMode === "ai" && (
          <div className="chips" role="group" aria-label="Pilih suara">
            {voices.map((v) => (
              <button key={v.id} type="button" className="chip" aria-pressed={draft.voice === v.id} onClick={() => set("voice", v.id)}>{v.label}</button>
            ))}
          </div>
        )}
        {draft.voMode === "upload" && (
          <VoiceoverUpload value={voiceover} onChange={(v) => { setVoiceover(v); setVoError(""); if (!v) setVoRights(false); }}
            rights={voRights} onRightsChange={(v) => { setVoRights(v); setVoError(""); }} rightsError={voiceover ? voError || undefined : undefined} />
        )}
        {draft.voMode === "upload" && !voiceover && voError && <p className="field-error" role="alert">{voError}</p>}

        <div className="panel-divider" />

        <Choice label="Backsound" value={draft.musicMode} onChange={(v) => { set("musicMode", v); setMusicError(""); }} options={[
          { id: "none", title: "Tanpa backsound", text: "Tidak ada musik latar" },
          { id: "upload", title: "Unggah backsound", text: "Musik milik Anda atau berlisensi" },
          { id: "library", title: "Tambahkan musik", text: "Dari pustaka musik berlisensi NaokoLabs" },
        ]} />
        {draft.musicMode === "upload" && (
          music ? (
            <div className="asset">
              <span className="asset-thumb" aria-hidden="true"><FileAudio size={20} /></span>
              <span className="asset-info"><span className="asset-name">{music.name}</span><span className="hint">{(music.size / (1024 * 1024)).toFixed(1)} MB · musik mengecil otomatis saat ada narasi</span></span>
              <button type="button" className="icon-btn icon-btn-danger" aria-label="Hapus backsound" onClick={() => setMusic(null)}><Trash2 size={16} aria-hidden="true" /></button>
            </div>
          ) : (
            <div className="row">
              <label htmlFor={musicInputId} className="btn">Pilih file musik</label>
              <span className="hint">MP3, M4A atau WAV, maksimal 30 MB.</span>
              <input id={musicInputId} type="file" className="sr-only" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/aac,audio/ogg,.mp3,.m4a,.wav"
                onChange={(e) => { pickMusic(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
          )
        )}
        {musicError && <p className="field-error" role="alert">{musicError}</p>}
      </Step>

      <button type="submit" className="btn btn-primary btn-xl" disabled={submitting} aria-busy={submitting}>
        {submitting ? <><LoaderCircle size={20} aria-hidden="true" className="spin" /> Menyusun brief & storyboard…</> : <><Wand2 size={20} aria-hidden="true" /> Buat Brief & Storyboard</>}
      </button>
      <p className="hint" style={{ textAlign: "center" }}>
        Gratis dan bisa diedit. Kuota baru terpakai saat Anda menyetujui dan klik &ldquo;Produksi&rdquo;.
      </p>
    </form>
  );
}
