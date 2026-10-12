"use client";

import Link from "next/link";
import { useState } from "react";
import { caption, slides, type ContentItem } from "@/lib/fixtures";

export function ResultView({ item }: { item: ContentItem }) {
  const [slide, setSlide] = useState(0);
  const [note, setNote] = useState("");
  const isVideo = item.kind === "video";

  return (
    <div className="narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isVideo ? "Hasil konten" : "Hasil carousel"}</h1>
          <p className="page-subtitle">{item.title} · Output versi {item.outputVersion}</p>
        </div>
      </div>

      <div className="stack">
        {isVideo ? (
          <>
            <div className="video-frame">
              <button type="button" className="play" aria-label="Putar preview video" onClick={() => setNote("Belum ada file video. Preview tersedia setelah produksi dan QC.")}>▶</button>
              <small>Preview video 9:16</small>
            </div>
            <div className="player-bar">▶ 00:00 / 00:20 · Audio</div>
          </>
        ) : (
          <>
            <div className="slide-frame" aria-live="polite">
              <div>
                <span className="preview-label">PLACEHOLDER</span>
                <h2>{slides[slide].heading}</h2>
                <p>{slides[slide].body}</p>
              </div>
            </div>
            <div className="slide-nav">
              <button type="button" className="btn" aria-label="Slide sebelumnya" disabled={slide === 0} onClick={() => setSlide(slide - 1)}>←</button>
              <span>Slide {slide + 1} / {slides.length}</span>
              <button type="button" className="btn" aria-label="Slide berikutnya" disabled={slide === slides.length - 1} onClick={() => setSlide(slide + 1)}>→</button>
            </div>
          </>
        )}

        <section className="stack" style={{ gap: 12 }} aria-labelledby="caption-title">
          <h2 id="caption-title" className="section-title" style={{ margin: 0 }}>Caption</h2>
          <details className="caption-box">
            <summary>Buka caption lengkap</summary>
            <p>{caption}</p>
          </details>
        </section>

        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setNote("Unduhan tersedia setelah file final lolos QC.")}>{isVideo ? "Unduh hasil" : "Unduh slide"}</button>
          <button type="button" className="btn" onClick={() => setNote("Revisi mencakup penempatan media, typo dan pengucapan VO. Formulirnya dibuat pada tahap berikutnya.")}>Ajukan revisi</button>
        </div>
        <Link href={`/app/posting/${item.id}`} className="btn btn-primary">Setujui hasil</Link>
        <p className="save-status" role="status" aria-live="polite">{note}</p>
      </div>
    </div>
  );
}
