"use client";

import { Copy, Play, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { StylePreview } from "@/components/dashboard/StylePreview";

export type ReferenceCardData = { id: string; file: string; title: string; style: string; prompt: string; thumbnail: string; duration: number; aspect: string };

// Kartu katalog: thumbnail, nama file, tombol "Lihat prompt" (D-22).
export function ReferenceCard({ item }: { item: ReferenceCardData }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [broken, setBroken] = useState(false);
  const [copied, setCopied] = useState("");
  const [open, setOpen] = useState(false);
  const vertical = item.aspect === "9:16" || item.aspect === "4:5";
  const show = () => { setCopied(""); setOpen(true); dialog.current?.showModal(); };

  const copy = () =>
    navigator.clipboard?.writeText(item.prompt).then(() => setCopied("Prompt tersalin."), () => setCopied("Salin manual dari kotak di atas."));

  return (
    <article className="ref-card">
      <button type="button" className="ref-thumb" onClick={show} aria-label={`Putar contoh ${item.file}`}>
        {broken ? (
          <StylePreview styleId={item.style} label="Thumbnail tidak tersedia" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- thumbnail dari Google Drive, bukan aset lokal
          <img src={item.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
        )}
        <span className="ref-play" aria-hidden="true"><Play size={18} /></span>
        <span className="ref-meta">{Math.round(item.duration)} dtk · {item.aspect}</span>
      </button>
      <p className="ref-file" title={item.file}>{item.file}</p>
      <button type="button" className="btn btn-block btn-center" onClick={show}>Lihat prompt</button>

      <dialog ref={dialog} className="ref-dialog" aria-labelledby={`t-${item.id}`} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <div className="stack-s">
          <div className="card-head">
            <div>
              <p className="detail-label">{item.file}</p>
              <h2 id={`t-${item.id}`} className="section-title">{item.title}</h2>
            </div>
            <button type="button" className="icon-btn" aria-label="Tutup" onClick={() => dialog.current?.close()}><X size={18} aria-hidden="true" /></button>
          </div>
          {open && (
            <div className={vertical ? "ref-player ref-player-v" : "ref-player"}>
              {/* Pemutar Google Drive: hanya jalan bila file dibagikan "siapa saja yang punya link". */}
              <iframe src={`https://drive.google.com/file/d/${encodeURIComponent(item.id)}/preview`} title={`Contoh video ${item.file}`} allow="autoplay; fullscreen" loading="lazy" />
            </div>
          )}
          <p className="ref-prompt">{item.prompt}</p>
          <div className="btn-pair">
            <button type="button" className="btn btn-center" onClick={copy}><Copy size={16} aria-hidden="true" /> Salin prompt</button>
            <Link href={`/app?contoh=${encodeURIComponent(item.id)}`} className="btn btn-primary btn-center">Pakai sebagai acuan</Link>
          </div>
          {copied && <p className="hint" role="status">{copied}</p>}
        </div>
      </dialog>
    </article>
  );
}
