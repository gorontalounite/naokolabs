"use client";

import { FileText, Link2, Lightbulb, Mic, Music, Palette, Sparkles, Subtitles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { durations, findStyle, inputModes, tones, videoStyles, voices, type InputMode } from "@/lib/video-data";

const modeIcons = { link: Link2, naskah: FileText, ide: Lightbulb } as const;
const STORAGE_KEY = "naokolabs:studio-draft";

type Draft = {
  mode: InputMode;
  link: string;
  script: string;
  idea: string;
  duration: number;
  tone: string;
  styleId: string;
  vo: boolean;
  voice: string;
  music: boolean;
  subtitles: boolean;
};

const initialDraft: Draft = {
  mode: "link",
  link: "",
  script: "",
  idea: "",
  duration: 30,
  tone: "promosi",
  styleId: "motion-graphic",
  vo: true,
  voice: voices[0].id,
  music: true,
  subtitles: true,
};

export function Studio({ presetStyle, presetIdea }: { presetStyle?: string; presetIdea?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    let next = initialDraft;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) next = { ...initialDraft, ...JSON.parse(raw) };
    } catch {
      // Storage diblokir atau draf rusak: mulai dari awal.
    }
    if (presetStyle && findStyle(presetStyle)) next = { ...next, styleId: presetStyle };
    if (presetIdea) next = { ...next, mode: "ide", idea: presetIdea };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan draf setelah hidrasi
    setDraft(next);
    loaded.current = true;
  }, [presetStyle, presetIdea]);

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

  const style = findStyle(draft.styleId) ?? videoStyles[0];
  const quickStyles = videoStyles.filter((s) => s.tier === "standar").slice(0, 5);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (draft.mode === "link" && !/^https?:\/\/\S+\.\S+/.test(draft.link.trim())) return setError("Tempel link lengkap, diawali https://");
    if (draft.mode === "naskah" && draft.script.trim().length < 20) return setError("Tulis naskah atau poin minimal 20 karakter.");
    if (draft.mode === "ide" && draft.idea.trim().length < 5) return setError("Tulis ide atau topik video Anda.");
    router.push("/app/video/promo-ruang-sela?dari=studio");
  };

  return (
    <form onSubmit={submit} noValidate className="stack">
      <div className="segment" role="tablist" aria-label="Cara memasukkan bahan">
        {inputModes.map((m) => {
          const Icon = modeIcons[m.id];
          return (
            <button key={m.id} type="button" role="tab" aria-selected={draft.mode === m.id} onClick={() => set("mode", m.id)}>
              <Icon size={18} aria-hidden="true" /> {m.label}
            </button>
          );
        })}
      </div>

      <section className="panel" aria-label="Bahan dan pengaturan video">
        <div className="field">
          {draft.mode === "link" && (
            <>
              <label className="label" htmlFor="link">Tempel link produk, artikel, atau postingan</label>
              <div className="input-icon">
                <Link2 size={18} aria-hidden="true" />
                <input id="link" className="input" type="url" inputMode="url" placeholder="https://tokopedia.com/…, https://instagram.com/…, link berita"
                  value={draft.link} onChange={(e) => set("link", e.target.value)} aria-invalid={!!error} aria-describedby="input-help" />
              </div>
              <p id="input-help" className="hint">AI membaca isi halaman lalu menyusun naskah. Mendukung marketplace, Instagram, TikTok, YouTube dan portal berita.</p>
            </>
          )}
          {draft.mode === "naskah" && (
            <>
              <label className="label" htmlFor="script">Tulis naskah atau poin penting</label>
              <textarea id="script" className="textarea" placeholder="Contoh: Kedai kopi Ruang Sela buka 15 Oktober. Diskon 20% minggu pertama. Alamat Jl. Contoh No. 12…"
                value={draft.script} onChange={(e) => set("script", e.target.value)} aria-invalid={!!error} aria-describedby="input-help" />
              <p id="input-help" className="hint">Naskah Anda dipakai apa adanya; AI hanya menyusun adegan dan caption.</p>
            </>
          )}
          {draft.mode === "ide" && (
            <>
              <label className="label" htmlFor="idea">Ide atau topik video</label>
              <input id="idea" className="input" placeholder="Contoh: 3 alasan kopi lokal lebih segar"
                value={draft.idea} onChange={(e) => set("idea", e.target.value)} aria-invalid={!!error} aria-describedby="input-help" />
              <p id="input-help" className="hint">Belum punya ide? <Link href="/app/ide" className="text-link">Lihat Ide Konten</Link></p>
            </>
          )}
          {error && <p className="field-error" role="alert">{error}</p>}
        </div>

        <div className="panel-divider" />

        <fieldset className="fieldset field">
          <legend className="label-row" style={{ width: "100%" }}>
            <span className="eyebrow">Durasi video</span>
            <span className="badge">9:16 · Reels / Story / TikTok</span>
          </legend>
          <div className="options options-3">
            {durations.map((d) => (
              <button key={d.id} type="button" className="option" aria-pressed={draft.duration === d.id} onClick={() => set("duration", d.id)}>
                <span className="option-title">{d.label} <span className="badge">{d.words}</span></span>
                <span className="option-text">{d.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="panel-divider" />

        <fieldset className="fieldset field">
          <legend className="eyebrow" style={{ marginBottom: 8 }}>Gaya bahasa</legend>
          <div className="options options-tone">
            {tones.map((t) => (
              <button key={t.id} type="button" className="option" aria-pressed={draft.tone === t.id} onClick={() => set("tone", t.id)}>
                <span className="option-title" style={{ fontSize: 15 }}>{t.label}</span>
                <span className="option-text">{t.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="panel" aria-labelledby="gaya-title">
        <div className="section-head">
          <h2 id="gaya-title" className="section-title"><Palette size={20} aria-hidden="true" /> Gaya video</h2>
          <Link href="/app/gaya" className="text-link">Lihat semua {videoStyles.length} gaya →</Link>
        </div>
        <div className="style-picked">
          <span className="style-thumb" aria-hidden="true"><Sparkles size={22} /></span>
          <div>
            <p className="row"><strong>{style.name}</strong>{style.tier === "quote" ? <span className="badge badge-warning">Perlu penawaran</span> : <span className="badge badge-success">Standar</span>}</p>
            <p className="hint">{style.description}</p>
          </div>
          <Link href="/app/gaya" className="btn">Ganti gaya</Link>
        </div>
        <p className="eyebrow" style={{ margin: "18px 0 8px" }}>Pilihan cepat</p>
        <div className="chips">
          {quickStyles.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={draft.styleId === s.id} onClick={() => set("styleId", s.id)}>{s.name}</button>
          ))}
        </div>

        <div className="panel-divider" />

        <h2 className="section-title" style={{ marginBottom: 14 }}><Mic size={20} aria-hidden="true" /> Suara & musik</h2>
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
          <label className="switch">
            <span><strong><Subtitles size={16} aria-hidden="true" style={{ verticalAlign: -2 }} /> Subtitle</strong><br /><span className="hint">Teks narasi tampil di layar</span></span>
            <input type="checkbox" checked={draft.subtitles} onChange={(e) => set("subtitles", e.target.checked)} />
            <span className="switch-track" aria-hidden="true" />
          </label>
        </div>
      </section>

      <button type="submit" className="btn btn-primary btn-xl">
        <Wand2 size={20} aria-hidden="true" /> Buat Rencana Video
      </button>
      <p className="hint" style={{ textAlign: "center" }}>
        Rencana (naskah, storyboard, caption) gratis dan bisa diedit. Kuota baru terpakai saat Anda klik &ldquo;Produksi Video&rdquo;.
      </p>
    </form>
  );
}
