"use client";

import { CheckCircle2, Circle, Clapperboard, Download, LoaderCircle, Pencil, Play, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { findStyle, statusInfo, tones, videoSteps, type SampleVideo, type VideoStatus } from "@/lib/video-data";

type Tab = "naskah" | "storyboard" | "caption";

export function VideoDetail({ video, fromStudio }: { video: SampleVideo; fromStudio: boolean }) {
  const [status, setStatus] = useState<VideoStatus>(video.status);
  const [tab, setTab] = useState<Tab>("storyboard");
  const [note, setNote] = useState("");
  const info = statusInfo[status];
  const style = findStyle(video.styleId);
  const tone = tones.find((t) => t.id === video.tone);
  const total = video.scenes.reduce((sum, s) => sum + s.seconds, 0);

  const stepState = (index: number) => {
    const current = info.step - 1;
    if (status === "terbit" || status === "terjadwal") return index <= current ? "done" : "todo";
    return index < current ? "done" : index === current ? "current" : "todo";
  };

  return (
    <div className="stack">
      {fromStudio && (
        <p className="notice notice-warning" role="status">
          Penyusunan rencana otomatis dari bahan Anda belum tersambung ke AI. Yang tampil di bawah adalah <strong>contoh rencana</strong> supaya alurnya bisa dicoba.
        </p>
      )}

      <div className="page-header">
        <div>
          <p className="eyebrow">{style?.name} · {video.duration} detik · {tone?.label}</p>
          <h1 className="page-title" style={{ marginTop: 6 }}>{video.title}</h1>
          <p className="page-subtitle">{info.label}</p>
        </div>
      </div>

      <ol className="stepper" aria-label="Tahapan video">
        {videoSteps.map((label, i) => (
          <li key={label} data-state={stepState(i)} aria-current={stepState(i) === "current" ? "step" : undefined}>{label}</li>
        ))}
      </ol>

      <div className="detail-layout">
        <div className="stack">
          {(status === "rencana" || status === "produksi") && (
            <section className="panel" aria-labelledby="rencana-title">
              <div className="section-head">
                <h2 id="rencana-title" className="section-title">Rencana versi {video.planVersion}</h2>
                <span className="badge">Total ± {total} detik · perkiraan</span>
              </div>
              <div className="segment" role="tablist" aria-label="Bagian rencana" style={{ marginBottom: 16 }}>
                {(["storyboard", "naskah", "caption"] as const).map((t) => (
                  <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                    {t === "storyboard" ? "Storyboard" : t === "naskah" ? "Naskah" : "Caption"}
                  </button>
                ))}
              </div>

              {tab === "storyboard" && (
                <ol className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {video.scenes.map((scene, i) => (
                    <li key={scene.id} className="scene">
                      <div className="scene-head">
                        <h3>Adegan {i + 1}</h3>
                        <span className="badge">± {scene.seconds} detik</span>
                      </div>
                      <div className="scene-body">
                        <div className="keyframe">{scene.asset.placeholder ? "PLACEHOLDER" : "RENCANA"}<br />{scene.asset.label}</div>
                        <div className="stack-s">
                          <div><p className="detail-label">Teks di layar</p><p className="detail-text">{scene.screenText}</p></div>
                          <div><p className="detail-label">Narasi</p><p className="detail-text">{scene.narration}</p></div>
                          <div><p className="detail-label">Visual</p><p className="detail-text">{scene.visual}</p></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {tab === "naskah" && (
                <ol className="stack" style={{ margin: 0, paddingLeft: 20 }}>
                  {video.scenes.map((scene) => <li key={scene.id} className="detail-text">{scene.narration}</li>)}
                </ol>
              )}

              {tab === "caption" && <p className="detail-text">{video.caption}</p>}
            </section>
          )}

          {(status === "hasil" || status === "siap" || status === "terjadwal" || status === "terbit") && (
            <section className="panel stack" aria-labelledby="hasil-title">
              <h2 id="hasil-title" className="section-title">Hasil video</h2>
              <div className="video-frame">
                <button type="button" aria-label="Putar video" onClick={() => setNote("File video contoh belum tersedia. Pemutar aktif setelah produksi sungguhan tersambung.")}>
                  <Play size={24} aria-hidden="true" />
                </button>
                <small>{video.duration} detik · 1080×1920</small>
              </div>
              <details className="notice">
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Caption</summary>
                <p style={{ marginTop: 8 }}>{video.caption}</p>
              </details>
            </section>
          )}
        </div>

        <aside className="detail-aside stack">
          {status === "rencana" && (
            <div className="action-box">
              <h2>Yang perlu Anda lakukan</h2>
              <p className="hint">Periksa naskah, storyboard dan caption. Setelah disetujui, video diproduksi dan memakai 1 kuota.</p>
              <button type="button" className="btn btn-primary btn-block btn-center" onClick={() => { setStatus("produksi"); setNote(""); }}>
                <Clapperboard size={18} aria-hidden="true" /> Setujui & Produksi Video
              </button>
              <button type="button" className="btn btn-block btn-center" onClick={() => setNote("Pratinjau: edit per adegan dan buat ulang rencana dibuat pada tahap berikutnya.")}>
                <Pencil size={18} aria-hidden="true" /> Minta perubahan rencana
              </button>
            </div>
          )}

          {status === "produksi" && (
            <div className="action-box" style={{ borderColor: "var(--line)" }}>
              <h2>Video sedang diproduksi</h2>
              <p className="hint">Anda boleh menutup halaman ini. Kami kabari lewat email saat video siap ditinjau.</p>
              <ul className="progress-list">
                <li><CheckCircle2 size={18} color="var(--success)" aria-hidden="true" /> Rencana disetujui</li>
                <li><LoaderCircle size={18} color="var(--accent-strong)" aria-hidden="true" /> Membuat suara narasi</li>
                <li><Circle size={18} color="var(--line-strong)" aria-hidden="true" /> Menyusun adegan & render</li>
                <li><Circle size={18} color="var(--line-strong)" aria-hidden="true" /> Pemeriksaan kualitas</li>
              </ul>
              <button type="button" className="btn btn-block btn-center" onClick={() => setStatus("hasil")}>Lihat contoh hasil (pratinjau)</button>
            </div>
          )}

          {status === "hasil" && (
            <div className="action-box">
              <h2>Tinjau hasil video</h2>
              <p className="hint">Tonton sampai selesai. Perbaikan gratis untuk gambar salah tempat, typo, dan pengucapan yang keliru.</p>
              <button type="button" className="btn btn-primary btn-block btn-center" onClick={() => setStatus("siap")}>
                <CheckCircle2 size={18} aria-hidden="true" /> Setujui hasil
              </button>
              <button type="button" className="btn btn-block btn-center" onClick={() => setNote("Pratinjau: formulir revisi per adegan dibuat pada tahap berikutnya.")}>
                <RefreshCw size={18} aria-hidden="true" /> Minta perbaikan
              </button>
            </div>
          )}

          {status === "siap" && (
            <div className="action-box">
              <h2>Video siap diposting</h2>
              <p className="hint">Jadwalkan ke akun yang terhubung, atau unduh untuk diposting sendiri.</p>
              <Link href={`/app/jadwal?video=${video.id}`} className="btn btn-primary btn-block btn-center"><Send size={18} aria-hidden="true" /> Jadwalkan posting</Link>
              <button type="button" className="btn btn-block btn-center" onClick={() => setNote("Unduhan tersedia setelah file video sungguhan ada.")}><Download size={18} aria-hidden="true" /> Unduh MP4</button>
            </div>
          )}

          {status === "terjadwal" && video.schedule && (
            <div className="action-box" style={{ borderColor: "var(--line)" }}>
              <h2>Terjadwal</h2>
              <p>{new Date(video.schedule.at).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })} WITA</p>
              <p className="hint">{video.schedule.account} · {video.schedule.platform}</p>
              <Link href="/app/jadwal" className="btn btn-block btn-center">Buka jadwal</Link>
            </div>
          )}

          {note && <p className="notice" role="status">{note}</p>}

          <div className="card">
            <p className="detail-label">Detail</p>
            <p className="card-text">Brand: {video.brand}</p>
            <p className="card-text">Gaya: {style?.name}</p>
            <p className="card-text">Durasi: {video.duration} detik · 9:16</p>
            <p className="card-text">Dibuat: {new Date(video.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
