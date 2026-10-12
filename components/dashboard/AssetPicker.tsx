"use client";

import { FileAudio, FileText, Film, ImageIcon, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useRef } from "react";

export type AssetKind = "gambar" | "video" | "audio" | "dokumen";

export type PickedAsset = {
  key: string;
  file: File;
  name: string;
  size: number;
  kind: AssetKind;
  preview?: string;
  seconds?: number;
  error?: string;
};

// Batas sementara di sisi browser; batas final ditetapkan bersama penyimpanan (docs/DECISIONS.md).
const LIMITS: Record<AssetKind, { bytes: number; label: string }> = {
  gambar: { bytes: 10 * 1024 * 1024, label: "10 MB" },
  video: { bytes: 300 * 1024 * 1024, label: "300 MB" },
  audio: { bytes: 30 * 1024 * 1024, label: "30 MB" },
  dokumen: { bytes: 20 * 1024 * 1024, label: "20 MB" },
};
const MAX_FILES = 15;
const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,video/mp4,video/quicktime,video/webm,audio/mpeg,audio/mp4,audio/wav,audio/x-m4a,application/pdf,text/csv";

function kindOf(file: File): AssetKind | null {
  if (file.type.startsWith("image/")) return "gambar";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf" || file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) return "dokumen";
  return null;
}

const icons = { gambar: ImageIcon, video: Film, audio: FileAudio, dokumen: FileText } as const;

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSeconds(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

export function AssetPicker({
  assets,
  onChange,
  needsVideo,
  rights,
  onRightsChange,
  rightsError,
}: {
  assets: PickedAsset[];
  onChange: (next: PickedAsset[] | ((prev: PickedAsset[]) => PickedAsset[])) => void;
  needsVideo: boolean;
  rights: boolean;
  onRightsChange: (v: boolean) => void;
  rightsError?: string;
}) {
  const inputId = useId();
  const urls = useRef(new Set<string>());

  useEffect(() => {
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).map<PickedAsset>((file) => {
      const kind = kindOf(file);
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!kind) return { key, file, name: file.name, size: file.size, kind: "dokumen", error: "Jenis berkas tidak didukung." };
      if (file.size > LIMITS[kind].bytes) return { key, file, name: file.name, size: file.size, kind, error: `Melebihi batas ${LIMITS[kind].label} untuk ${kind}.` };
      let preview: string | undefined;
      if (kind === "gambar" || kind === "video") {
        preview = URL.createObjectURL(file);
        urls.current.add(preview);
      }
      return { key, file, name: file.name, size: file.size, kind, preview };
    });

    onChange((prev) => {
      const fresh = incoming.filter((a) => !prev.some((p) => p.key === a.key));
      return [...prev, ...fresh].slice(0, MAX_FILES);
    });

    // Baca durasi video dari metadata, tanpa mengunggah.
    incoming.filter((a) => a.kind === "video" && a.preview && !a.error).forEach((a) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => onChange((prev) => prev.map((p) => (p.key === a.key ? { ...p, seconds: el.duration } : p)));
      el.src = a.preview!;
    });
  };

  const remove = (key: string) => {
    const target = assets.find((a) => a.key === key);
    if (target?.preview) { URL.revokeObjectURL(target.preview); urls.current.delete(target.preview); }
    onChange((prev) => prev.filter((a) => a.key !== key));
  };

  const valid = assets.filter((a) => !a.error);
  const hasVideo = valid.some((a) => a.kind === "video");

  return (
    <div className="stack-s">
      <div className="label-row">
        <span className="eyebrow">Aset Anda {needsVideo ? "(wajib rekaman video)" : "(opsional)"}</span>
        <span className="hint">{valid.length}/{MAX_FILES} berkas</span>
      </div>
      <div className="upload-drop">
        <span className="empty-icon" aria-hidden="true"><Upload size={22} /></span>
        <div>
          <p className="card-title">Logo, foto produk, rekaman video, atau audio</p>
          <p className="hint">Gambar hingga 10 MB, video hingga 300 MB, audio 30 MB, PDF/CSV 20 MB.</p>
        </div>
        <label htmlFor={inputId} className="btn">Pilih file / galeri</label>
        <input id={inputId} type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </div>

      {needsVideo && !hasVideo && (
        <p className="notice notice-warning">Gaya &ldquo;UGC dari Video Anda&rdquo; membutuhkan minimal satu rekaman video.</p>
      )}

      {assets.length > 0 && (
        <ul className="asset-list">
          {assets.map((a) => {
            const Icon = icons[a.kind];
            return (
              <li key={a.key} className="asset" data-error={a.error ? "true" : undefined}>
                <span className="asset-thumb" aria-hidden="true">
                  {a.kind === "gambar" && a.preview && !a.error ? (
                    // eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal
                    <img src={a.preview} alt="" />
                  ) : <Icon size={20} />}
                </span>
                <span className="asset-info">
                  <span className="asset-name">{a.name}</span>
                  {a.error ? (
                    <span className="field-error">{a.error}</span>
                  ) : (
                    <span className="hint">{a.kind} · {formatSize(a.size)}{a.seconds ? ` · ${formatSeconds(a.seconds)}` : ""}</span>
                  )}
                </span>
                <button type="button" className="icon-btn icon-btn-danger" onClick={() => remove(a.key)} aria-label={`Hapus ${a.name}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {valid.length > 0 && (
        <>
          <label className="check">
            <input type="checkbox" checked={rights} onChange={(e) => onRightsChange(e.target.checked)} aria-invalid={!!rightsError} />
            Saya memiliki hak memakai aset ini untuk konten brand saya.
          </label>
          {rightsError && <p className="field-error" role="alert">{rightsError}</p>}
          <p className="hint">Berkas masih di perangkat Anda. Unggah ke server aktif saat penyimpanan akun tersambung.</p>
        </>
      )}
    </div>
  );
}
