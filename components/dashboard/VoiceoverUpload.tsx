"use client";

import { FileAudio, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useId, useState } from "react";
import type { Voiceover } from "@/lib/ai/schema";

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_SECONDS = 60;
const MIN_SECONDS = 3;

function audioSeconds(file: File) {
  return new Promise<number | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement("audio");
    el.preload = "metadata";
    el.onloadedmetadata = () => { resolve(Number.isFinite(el.duration) ? el.duration : null); URL.revokeObjectURL(url); };
    el.onerror = () => { resolve(null); URL.revokeObjectURL(url); };
    el.src = url;
  });
}

// Voice-over jadi milik pelanggan: ditranskrip di server, lalu storyboard mengikuti waktu suaranya (D-21).
export function VoiceoverUpload({
  value,
  onChange,
  rights,
  onRightsChange,
  rightsError,
}: {
  value: Voiceover | null;
  onChange: (v: Voiceover | null) => void;
  rights: boolean;
  onRightsChange: (v: boolean) => void;
  rightsError?: string;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("audio/") && !/\.(mp3|m4a|wav|aac|ogg)$/i.test(file.name)) return setError("Gunakan file audio MP3, M4A atau WAV.");
    if (file.size > MAX_BYTES) return setError("File maksimal 4 MB. Simpan ulang sebagai MP3 (± 4 menit muat dalam 4 MB).");
    const seconds = await audioSeconds(file);
    if (seconds !== null && seconds > MAX_SECONDS + 0.5) return setError(`Voice-over ${Math.round(seconds)} detik; maksimal ${MAX_SECONDS} detik per video.`);
    if (seconds !== null && seconds < MIN_SECONDS) return setError(`Voice-over terlalu pendek; minimal ${MIN_SECONDS} detik.`);

    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/transkrip", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error ?? "Transkripsi gagal. Coba lagi.");
      onChange(data.voiceover as Voiceover);
    } catch {
      setError("Koneksi terputus. Periksa internet lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  if (value) {
    return (
      <div className="stack-s">
        <div className="asset">
          <span className="asset-thumb" aria-hidden="true"><FileAudio size={20} /></span>
          <span className="asset-info">
            <span className="asset-name">{value.fileName}</span>
            <span className="hint">{Math.round(value.seconds)} detik · {value.segments.length} kalimat · durasi video mengikuti rekaman ini</span>
          </span>
          <button type="button" className="icon-btn icon-btn-danger" aria-label="Hapus voice-over" onClick={() => onChange(null)}><Trash2 size={16} aria-hidden="true" /></button>
        </div>
        <details className="notice">
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Transkrip (dipakai persis sebagai narasi)</summary>
          <p style={{ marginTop: 8 }}>{value.transcript}</p>
        </details>
        <label className="check">
          <input type="checkbox" checked={rights} onChange={(e) => onRightsChange(e.target.checked)} aria-invalid={!!rightsError} />
          Suara dan isi rekaman ini milik saya atau saya punya izin memakainya.
        </label>
        {rightsError && <p className="field-error" role="alert">{rightsError}</p>}
      </div>
    );
  }

  return (
    <div className="stack-s">
      <div className="upload-drop">
        <span className="empty-icon" aria-hidden="true">{busy ? <LoaderCircle size={22} className="spin" /> : <Upload size={22} />}</span>
        <div>
          <p className="card-title">{busy ? "Mentranskrip voice-over…" : "Unggah voice-over yang sudah jadi"}</p>
          <p className="hint">MP3, M4A atau WAV, maksimal 60 detik dan 4 MB. Kata-katanya kami tulis ulang otomatis lalu storyboard mengikuti waktu bicara Anda.</p>
        </div>
        <label htmlFor={inputId} className="btn" aria-disabled={busy}>Pilih file audio</label>
        <input id={inputId} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/aac,audio/ogg,.mp3,.m4a,.wav" className="sr-only" disabled={busy}
          onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
