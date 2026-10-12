"use client";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "naokolabs:brand-kit";
type Kit = { name: string; handle: string; tagline: string; primary: string; secondary: string; outro: boolean };
const initial: Kit = { name: "", handle: "", tagline: "", primary: "#c43a24", secondary: "#1d1d1b", outro: true };

export function BrandKitForm() {
  const [kit, setKit] = useState<Kit>(initial);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState("");
  const [saved, setSaved] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan brand kit setelah hidrasi
      if (raw) setKit({ ...initial, ...JSON.parse(raw) });
    } catch {
      // Abaikan: brand kit kembali ke nilai awal.
    }
    loaded.current = true;
  }, []);

  useEffect(() => () => { if (logo) URL.revokeObjectURL(logo); }, [logo]);

  const set = <K extends keyof Kit>(key: K, value: Kit[K]) => { setKit((k) => ({ ...k, [key]: value })); setSaved(""); };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
      setSaved("Tersimpan di perangkat ini. Penyimpanan ke akun aktif pada tahap berikutnya.");
    } catch {
      setSaved("Gagal menyimpan di perangkat ini.");
    }
  };

  return (
    <div className="settings-grid">
      <form className="panel stack" onSubmit={save} noValidate>
        <div className="field">
          <label className="label" htmlFor="bk-name">Nama brand</label>
          <input id="bk-name" className="input" placeholder="Contoh: Ruang Sela" value={kit.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="field">
          <label className="label" htmlFor="bk-handle">Handle medsos</label>
          <input id="bk-handle" className="input" placeholder="@namabrand" value={kit.handle} onChange={(e) => set("handle", e.target.value)} />
          <p className="hint">Tampil di penutup setiap video.</p>
        </div>
        <div className="field">
          <label className="label" htmlFor="bk-tagline">Ajakan penutup (CTA)</label>
          <input id="bk-tagline" className="input" placeholder="Contoh: Pesan sekarang lewat link di bio" value={kit.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div className="field">
          <span className="label">Logo (PNG transparan)</span>
          <div className="logo-drop">
            <span className="logo-box">{/* eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal */}
              {logo ? <img src={logo} alt="Pratinjau logo" /> : <Upload size={22} aria-hidden="true" />}</span>
            <label className="btn" htmlFor="bk-logo"><Upload size={18} aria-hidden="true" /> Unggah logo</label>
            <input id="bk-logo" type="file" accept="image/png,image/svg+xml,image/jpeg" className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) return setLogoError("Ukuran logo maksimal 5 MB.");
              setLogoError("");
              setLogo(URL.createObjectURL(file));
            }} />
          </div>
          {logoError && <p className="field-error" role="alert">{logoError}</p>}
        </div>
        <div className="grid-2">
          <div className="field">
            <label className="label" htmlFor="bk-primary">Warna utama</label>
            <div className="color-row"><input id="bk-primary" type="color" value={kit.primary} onChange={(e) => set("primary", e.target.value)} /><span className="hint">{kit.primary}</span></div>
          </div>
          <div className="field">
            <label className="label" htmlFor="bk-secondary">Warna kedua</label>
            <div className="color-row"><input id="bk-secondary" type="color" value={kit.secondary} onChange={(e) => set("secondary", e.target.value)} /><span className="hint">{kit.secondary}</span></div>
          </div>
        </div>
        <label className="switch">
          <span><strong>Sertakan adegan penutup</strong><br /><span className="hint">Logo, handle dan ajakan di akhir video</span></span>
          <input type="checkbox" checked={kit.outro} onChange={(e) => set("outro", e.target.checked)} />
          <span className="switch-track" aria-hidden="true" />
        </label>
        <button type="submit" className="btn btn-primary btn-block btn-center">Simpan brand kit</button>
        {saved && <p className="hint" role="status">{saved}</p>}
      </form>

      <div className="panel stack">
        <p className="eyebrow">Pratinjau penutup video</p>
        {kit.outro ? (
          <div className="endcard" style={{ background: kit.secondary }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal */}
            {logo ? <img src={logo} alt="" style={{ width: 72, height: 72, objectFit: "contain" }} /> : <span className="side-logo" style={{ background: kit.primary, width: 56, height: 56 }}>{(kit.name || "B").slice(0, 1).toUpperCase()}</span>}
            <b>{kit.tagline || "Ajakan penutup Anda"}</b>
            <span style={{ background: kit.primary, padding: "4px 10px", borderRadius: 999 }}>{kit.handle || "@namabrand"}</span>
          </div>
        ) : (
          <p className="notice">Adegan penutup tidak ditambahkan. Video berakhir di adegan terakhir rencana.</p>
        )}
        <p className="hint">Pratinjau sederhana. Tampilan akhir mengikuti gaya video yang dipilih.</p>
      </div>
    </div>
  );
}
