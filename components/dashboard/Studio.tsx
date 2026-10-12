"use client";

import { Check, LoaderCircle, Music, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AssetPicker, type PickedAsset } from "@/components/dashboard/AssetPicker";
import { StylePreview } from "@/components/dashboard/StylePreview";
import type { Plan } from "@/lib/ai/schema";
import { planToVideo } from "@/lib/plan-to-video";
import { tones, voices, type VideoStyle } from "@/lib/video-data";
import { saveLocalVideo } from "@/lib/video-store";

const STORAGE_KEY = "naokolabs:studio-draft";
const IDEA_MAX = 1000;
const examples = ["3 alasan kopi lokal lebih segar", "Promo pembukaan cabang baru, diskon 20% minggu pertama", "Cara merawat sepatu kulit agar awet", "Ucapan Hari Santri dari brand kami"];

type Draft = { idea: string; tone: string; styleId: string; vo: boolean; voice: string; music: boolean };

const initialDraft: Draft = { idea: "", tone: "promosi", styleId: "motion-graphic", vo: true, voice: voices[0].id, music: true };

function pickDraft(raw: Partial<Draft>): Draft {
  const d = { ...initialDraft };
  if (typeof raw.idea === "string") d.idea = raw.idea.slice(0, IDEA_MAX);
  if (tones.some((t) => t.id === raw.tone)) d.tone = raw.tone!;
  if (typeof raw.styleId === "string") d.styleId = raw.styleId;
  if (typeof raw.vo === "boolean") d.vo = raw.vo;
  if (voices.some((v) => v.id === raw.voice)) d.voice = raw.voice!;
  if (typeof raw.music === "boolean") d.music = raw.music;
  return d;
}

function Step({ no, title, desc, children }: { no: number; title: string; desc?: string; children: React.ReactNode }) {
  const id = `langkah-${no}`;
  return (
    <section className="panel studio-step" aria-labelledby={id}>
      <div className="studio-step-head">
        <span className="studio-step-no" aria-hidden="true">{no}</span>
        <div>
          <h2 id={id}>{title}</h2>
          {desc && <p>{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Studio({ styles, presetStyle, presetIdea }: { styles: VideoStyle[]; presetStyle?: string; presetIdea?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<PickedAsset[]>([]);
  const [rights, setRights] = useState(false);
  const [assetError, setAssetError] = useState("");
  const [rightsError, setRightsError] = useState("");
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
    if (presetIdea) next = { ...next, idea: presetIdea.slice(0, IDEA_MAX) };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan draf setelah hidrasi
    setDraft(next);
    loaded.current = true;
  }, [presetStyle, presetIdea, styles]);

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

  const style = styles.find((s) => s.id === draft.styleId) ?? styles[0];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (draft.idea.trim().length < 5) {
      setError("Tulis ide video Anda, minimal satu kalimat pendek.");
      ideaRef.current?.focus();
      return;
    }
    const valid = assets.filter((a) => !a.error);
    if (draft.styleId === "ugc-edit" && !valid.some((a) => a.kind === "video")) {
      setAssetError("Gaya UGC membutuhkan minimal satu rekaman video Anda.");
      document.getElementById("aset-anda")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (valid.length > 0 && !rights) {
      setRightsError("Konfirmasi hak pemakaian aset dulu.");
      document.getElementById("aset-anda")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    let brand: { name?: string; handle?: string; tagline?: string } = {};
    try {
      brand = JSON.parse(localStorage.getItem("naokolabs:brand-kit") ?? "{}");
    } catch {
      // Brand kit opsional.
    }

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
          vo: draft.vo,
          voice: draft.voice,
          music: draft.music,
          brand: { name: brand.name ?? "", handle: brand.handle ?? "", tagline: brand.tagline ?? "" },
          assets: valid.map((a) => ({ id: a.key, name: a.name, kind: a.kind })),
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
        brand: brand.name ?? "",
        idea: draft.idea.trim(),
        assetNames: Object.fromEntries(valid.map((a) => [a.key, a.name])),
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
      <Step no={1} title="Tulis ide video Anda" desc="Satu atau dua kalimat cukup. Kami ubah menjadi brief konten dan storyboard; durasi video menyesuaikan isi ide.">
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
              {examples.map((ex) => (
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

      <Step no={2} title="Pilih gaya video" desc="Lihat contoh gerakannya, lalu pilih yang paling cocok dengan pesan Anda.">
        <div className="style-grid" role="group" aria-label="Gaya video">
          {styles.map((s) => (
            <button key={s.id} type="button" className="style-option" aria-pressed={draft.styleId === s.id} onClick={() => { set("styleId", s.id); setAssetError(""); }}>
              <span className="style-option-check" aria-hidden="true"><Check size={14} /></span>
              <StylePreview styleId={s.id} />
              <span className="style-option-name">{s.name}</span>
              <span className="style-option-text">{s.tagline}</span>
              {s.tier === "quote" && <span className="badge badge-warning">Perlu penawaran</span>}
            </button>
          ))}
        </div>
        {style && (
          <p className="notice" role="status">
            <strong>{style.name}:</strong> {style.description} <span className="hint">Cocok untuk {style.bestFor.toLowerCase()}.</span>{" "}
            <Link href="/app/gaya" className="text-link">Detail semua gaya</Link>
          </p>
        )}
      </Step>

      <Step no={3} title="Suara & musik">
        <div className="stack-s">
          <label className="switch">
            <span><strong>Voice-over</strong><br /><span className="hint">Narasi dibacakan suara AI berbahasa Indonesia</span></span>
            <input type="checkbox" checked={draft.vo} onChange={(e) => set("vo", e.target.checked)} />
            <span className="switch-track" aria-hidden="true" />
          </label>
          {draft.vo && (
            <div className="chips" role="group" aria-label="Pilih suara">
              {voices.map((v) => (
                <button key={v.id} type="button" className="chip" aria-pressed={draft.voice === v.id} onClick={() => set("voice", v.id)}>{v.label}</button>
              ))}
            </div>
          )}
          <label className="switch">
            <span><strong><Music size={16} aria-hidden="true" style={{ verticalAlign: -2 }} /> Musik latar</strong><br /><span className="hint">Musik berlisensi dari pustaka NaokoLabs</span></span>
            <input type="checkbox" checked={draft.music} onChange={(e) => set("music", e.target.checked)} />
            <span className="switch-track" aria-hidden="true" />
          </label>
        </div>
      </Step>

      <Step no={4} title={draft.styleId === "ugc-edit" ? "Unggah rekaman video Anda" : "Aset Anda (opsional)"}
        desc={draft.styleId === "ugc-edit" ? "Gaya UGC disusun dari rekaman Anda sendiri." : "Logo, foto produk atau rekaman. Tanpa aset, kami pakai visual sementara yang bisa diganti."}>
        <div id="aset-anda">
          <AssetPicker
            assets={assets}
            onChange={(next) => { setAssets(next); setAssetError(""); }}
            needsVideo={draft.styleId === "ugc-edit"}
            rights={rights}
            onRightsChange={(v) => { setRights(v); setRightsError(""); }}
            rightsError={rightsError}
          />
          {assetError && <p className="field-error" role="alert" style={{ marginTop: 8 }}>{assetError}</p>}
        </div>
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
