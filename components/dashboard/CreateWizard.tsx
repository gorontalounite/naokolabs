"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sampleBrand, type ContentKind } from "@/lib/fixtures";

// Pilihan mengikuti docs/PRD.md FR-02 dan docs/PAYG-PRICING.md bagian 2–4.
const videoStyles = ["Motion Graphic", "Explainer", "UGC", "Whiteboard", "Illustration", "Cinematic", "Animation"];
const references = ["Belum memilih referensi", "Motion typography ringkas", "Explainer diagram langkah demi langkah", "Whiteboard reveal"];
const visualSources = [
  { id: "client", label: "Aset milik klien" },
  { id: "none", label: "Tanpa foto/video · teks dan grafik" },
  { id: "stock", label: "Visual stock/library dari layanan" },
  { id: "ai", label: "AI-generated · perlu quote" },
  { id: "custom", label: "Custom/shooting · perlu quote" },
];
const scriptSources = [
  { id: "new", label: "Naskah baru dari layanan" },
  { id: "client", label: "Naskah dari klien (siap pakai)" },
];

const ACCEPTED = ["image/", "video/", "audio/", "application/pdf", "text/csv"];
const MAX_BYTES = 200 * 1024 * 1024; // Batas sementara; batas final TBD (docs/DECISIONS.md).
const STORAGE_KEY = "naokolabs:draft-buat-konten";

type Draft = {
  kind: ContentKind;
  count: 1 | 5 | 10;
  duration: "30" | "60";
  slides: number;
  style: string;
  reference: string;
  visual: string;
  script: string;
  vo: boolean;
  music: boolean;
  presenter: boolean;
  brand: string;
  goal: string;
  audience: string;
  message: string;
  cta: string;
  rights: boolean;
};

const initialDraft: Draft = {
  kind: "video",
  count: 1,
  duration: "60",
  slides: 8,
  style: "Motion Graphic",
  reference: references[0],
  visual: "client",
  script: "new",
  vo: true,
  music: false,
  presenter: true,
  brand: "",
  goal: "",
  audience: "",
  message: "",
  cta: "",
  rights: false,
};

type PickedFile = { key: string; name: string; size: number; error: string | null };

const steps = ["Jenis dan jumlah", "Pilihan yang berdiri sendiri", "Kebutuhan konten", "Unggah dan tinjau", "Periksa sebelum pembayaran"];
const titles = ["Buat Konten", "Konfigurasi", "Brief konten", "Aset konten", "Ringkasan biaya"];

type SaveState = "idle" | "saving" | "saved" | "failed";

export function CreateWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [save, setSave] = useState<SaveState>("idle");
  const loaded = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileInputId = useId();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan draf tersimpan setelah hidrasi
      if (raw) setDraft({ ...initialDraft, ...JSON.parse(raw) });
    } catch {
      // Draf rusak atau storage diblokir: mulai dari awal.
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    setSave("saving");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSave("saved");
      } catch {
        setSave("failed");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [draft]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const isVideo = draft.kind === "video";

  const validate = () => {
    const next: Partial<Record<keyof Draft, string>> = {};
    if (step === 2) {
      if (!draft.brand.trim()) next.brand = "Isi nama brand.";
      if (!draft.goal.trim()) next.goal = "Jelaskan tujuan konten.";
      if (!draft.audience.trim()) next.audience = "Jelaskan audiens.";
      if (!draft.message.trim()) next.message = "Tulis pesan utama.";
    }
    if (step === 3 && !draft.rights) next.rights = "Konfirmasi izin pemakaian aset.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      error: !ACCEPTED.some((type) => file.type.startsWith(type))
        ? "Jenis berkas tidak didukung. Gunakan gambar, video, audio, PDF atau CSV."
        : file.size > MAX_BYTES
          ? "Ukuran berkas melebihi 200 MB."
          : null,
    }));
    setFiles((current) => [...current, ...picked.filter((file) => !current.some((c) => c.key === file.key))]);
  };

  const components = [
    { label: isVideo ? "Produksi dasar · video / render" : "Desain · layout / produksi", on: true },
    { label: "Naskah baru", on: draft.script === "new" },
    { label: "Penyediaan visual standar", on: draft.visual === "stock" },
    { label: "Footage AI · quote terpisah", on: draft.visual === "ai" },
    { label: "Produksi custom · quote terpisah", on: draft.visual === "custom" },
    { label: "Voice-over", on: isVideo && draft.vo },
    { label: "Musik library", on: isVideo && draft.music },
    { label: "Presenter 15–20 detik", on: isVideo && draft.presenter && draft.duration === "60" },
  ].filter((component) => component.on);

  const saveText = { idle: "", saving: "Menyimpan draf…", saved: "Draf tersimpan", failed: "Draf gagal disimpan di perangkat ini" }[save];

  return (
    <div className="narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title" ref={headingRef} tabIndex={-1}>{titles[step]}</h1>
          <p className="step-label">{step + 1} / {steps.length} · {steps[step]}</p>
        </div>
      </div>

      <form
        className="wizard"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          goNext();
        }}
      >
        {step === 0 && (
          <>
            <fieldset className="field fieldset">
              <legend className="section-title">Jenis konten</legend>
              <div className="choice-grid">
                {([["video", "Video", "Reels / Story"], ["carousel", "Carousel", "Slide berurutan"]] as const).map(([value, title, text]) => (
                  <button key={value} type="button" className="choice" aria-pressed={draft.kind === value} onClick={() => set("kind", value)}>
                    <span className="choice-title">{title}</span>
                    <span className="choice-text">{text}</span>
                    {draft.kind === value && <span className="choice-badge">● Dipilih</span>}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="field fieldset">
              <legend className="section-title">Jumlah konten</legend>
              <div className="count-grid">
                {([1, 5, 10] as const).map((value) => (
                  <button key={value} type="button" className="count" aria-pressed={draft.count === value} onClick={() => set("count", value)}>
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            {isVideo ? (
              <div className="field">
                <label className="label" htmlFor="duration">Durasi video</label>
                <select id="duration" className="select" value={draft.duration} onChange={(event) => set("duration", event.target.value as Draft["duration"])}>
                  <option value="30">30 detik</option>
                  <option value="60">60 detik</option>
                </select>
              </div>
            ) : (
              <div className="field">
                <label className="label" htmlFor="slides">Jumlah slide</label>
                <select id="slides" className="select" value={draft.slides} onChange={(event) => set("slides", Number(event.target.value))}>
                  {[4, 5, 6, 7, 8].map((value) => <option key={value} value={value}>{value} slide</option>)}
                </select>
              </div>
            )}
            <p className="hint">Spesifikasi dan harga diperiksa sebelum pembayaran.</p>
          </>
        )}

        {step === 1 && (
          <>
            {isVideo && (
              <div className="field">
                <label className="label" htmlFor="style">Gaya video</label>
                <select id="style" className="select" value={draft.style} onChange={(event) => set("style", event.target.value)}>
                  {videoStyles.map((style) => <option key={style}>{style}</option>)}
                </select>
              </div>
            )}
            <div className="field">
              <label className="label" htmlFor="reference">Referensi</label>
              <select id="reference" className="select" value={draft.reference} onChange={(event) => set("reference", event.target.value)}>
                {references.map((reference) => <option key={reference}>{reference}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="visual">Sumber visual</label>
              <select id="visual" className="select" value={draft.visual} onChange={(event) => set("visual", event.target.value)}>
                {visualSources.map((source) => <option key={source.id} value={source.id}>{source.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="script">{isVideo ? "Sumber naskah" : "Sumber copy"}</label>
              <select id="script" className="select" value={draft.script} onChange={(event) => set("script", event.target.value)}>
                {scriptSources.map((source) => <option key={source.id} value={source.id}>{source.label}</option>)}
              </select>
            </div>

            {isVideo ? (
              <fieldset className="field fieldset" style={{ marginTop: 8 }}>
                <legend className="section-title">Audio dan presenter</legend>
                <div className="checks">
                  <label className="check"><input type="checkbox" checked={draft.vo} onChange={(event) => set("vo", event.target.checked)} /> Voice-over</label>
                  <label className="check"><input type="checkbox" checked={draft.music} onChange={(event) => set("music", event.target.checked)} /> Musik</label>
                  <label className="check">
                    <input type="checkbox" checked={draft.presenter} disabled={draft.duration !== "60"} onChange={(event) => set("presenter", event.target.checked)} /> Presenter
                  </label>
                </div>
                <p className="hint">
                  {draft.duration === "60" ? "Presenter 15–20 detik dalam video 60s." : "Presenter hanya tersedia pada video 60 detik."}
                </p>
              </fieldset>
            ) : (
              <p className="hint">Carousel statis tidak memakai voice-over atau musik.</p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label className="label" htmlFor="brand">Brand</label>
              <input id="brand" className="input" list="brand-list" placeholder="Pilih atau tambahkan brand" value={draft.brand}
                aria-invalid={!!errors.brand} aria-describedby={errors.brand ? "brand-error" : undefined}
                onChange={(event) => set("brand", event.target.value)} />
              <datalist id="brand-list"><option value={sampleBrand} /></datalist>
              {errors.brand && <p id="brand-error" className="field-error">{errors.brand}</p>}
            </div>
            {([
              ["goal", "Tujuan", "Apa yang ingin dicapai?"],
              ["audience", "Audiens", "Siapa yang dituju?"],
            ] as const).map(([key, label, placeholder]) => (
              <div className="field" key={key}>
                <label className="label" htmlFor={key}>{label}</label>
                <input id={key} className="input" placeholder={placeholder} value={draft[key]}
                  aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined}
                  onChange={(event) => set(key, event.target.value)} />
                {errors[key] && <p id={`${key}-error`} className="field-error">{errors[key]}</p>}
              </div>
            ))}
            <div className="field">
              <label className="label" htmlFor="message">Pesan utama</label>
              <textarea id="message" className="textarea" placeholder="Tulis pesan yang harus tersampaikan" value={draft.message}
                aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}
                onChange={(event) => set("message", event.target.value)} />
              {errors.message && <p id="message-error" className="field-error">{errors.message}</p>}
            </div>
            <div className="field">
              <label className="label" htmlFor="cta">CTA <span className="hint">(opsional)</span></label>
              <input id="cta" className="input" placeholder="Tindakan yang diharapkan" value={draft.cta} onChange={(event) => set("cta", event.target.value)} />
            </div>
            <p className="hint">Pertanyaan menyesuaikan jenis konten.</p>
          </>
        )}

        {step === 3 && (
          <>
            <div className="upload-drop">
              <h2 className="card-title">Tambahkan aset milik Anda</h2>
              <p className="card-text">Logo, visual, naskah atau audio. Gambar, video, audio, PDF atau CSV hingga 200 MB.</p>
              <label htmlFor={fileInputId} className="btn">Pilih file / galeri</label>
              <input id={fileInputId} type="file" multiple className="sr-only"
                accept="image/*,video/*,audio/*,application/pdf,text/csv"
                onChange={(event) => { onFiles(event.target.files); event.target.value = ""; }} />
            </div>

            <section aria-labelledby="berkas-dipilih">
              <h2 id="berkas-dipilih" className="section-title">Berkas dipilih</h2>
              {files.length === 0 ? (
                <p className="empty">Belum ada berkas. Aset dapat ditambahkan nanti sebelum rencana disetujui.</p>
              ) : (
                <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {files.map((file) => (
                    <li key={file.key} className="card file-card">
                      <p className="card-title" style={{ fontSize: 15, wordBreak: "break-all" }}>{file.name}</p>
                      {file.error ? (
                        <p className="field-error" role="alert">{file.error}</p>
                      ) : (
                        <p className="card-text">{formatSize(file.size)} · disimpan di perangkat, unggah ke server belum aktif</p>
                      )}
                      <button type="button" className="btn" onClick={() => setFiles((current) => current.filter((c) => c.key !== file.key))}>
                        Hapus berkas
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="field">
              <label className="check">
                <input type="checkbox" checked={draft.rights} aria-invalid={!!errors.rights}
                  aria-describedby={errors.rights ? "rights-error" : undefined}
                  onChange={(event) => set("rights", event.target.checked)} />
                Saya memiliki izin memakai aset ini.
              </label>
              {errors.rights && <p id="rights-error" className="field-error">{errors.rights}</p>}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="card card-muted summary-card">
              <h2 className="card-title">
                {isVideo ? "Video" : "Carousel"} · {draft.count} konten · {isVideo ? `${draft.duration} detik` : `${draft.slides} slide`}
              </h2>
              <p className="card-text">
                {[isVideo ? draft.style : null, visualSources.find((s) => s.id === draft.visual)?.label].filter(Boolean).join(" · ")}
              </p>
              <p className="card-text">{draft.brand || "Brand belum diisi"}</p>
            </div>

            <section aria-labelledby="komponen">
              <h2 id="komponen" className="section-title">Komponen yang dipilih</h2>
              <ul className="cost-list">
                {components.map((component) => (
                  <li className="cost-row" key={component.label}>
                    <span>{component.label}</span>
                    <span>Belum ditetapkan</span>
                  </li>
                ))}
              </ul>
              <p className="cost-total"><span>Total</span><span>Belum final</span></p>
            </section>

            <p className="hint">Harga komponen belum ditetapkan.<br />Harga akan dihitung dan diverifikasi server saat checkout.</p>
          </>
        )}

        <div className="wizard-footer">
          {step < steps.length - 1 ? (
            <button type="submit" className="btn btn-primary">
              {["Lanjut ke konfigurasi", "Lanjut ke brief", "Lanjut ke aset", "Tinjau biaya"][step]}
            </button>
          ) : (
            <button type="button" className="btn" disabled>Pembayaran belum tersedia</button>
          )}
          {step > 0 && <button type="button" className="back-link" onClick={() => setStep(step - 1)}>Kembali</button>}
          <p className="save-status" role="status" aria-live="polite">{saveText}</p>
        </div>
      </form>
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
