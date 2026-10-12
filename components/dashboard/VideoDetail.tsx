"use client";

import { CheckCircle2, Circle, Clapperboard, Download, LoaderCircle, Play, RefreshCw, RotateCcw, Send, Wand2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PlanEditor } from "@/components/dashboard/PlanEditor";
import { RevisionForm } from "@/components/dashboard/RevisionForm";
import { useVideoState } from "@/lib/video-store";
import { findStyle, revisionKinds, statusInfo, tones, videoSteps, type SampleVideo } from "@/lib/video-data";

export function VideoDetail({ video, fromStudio }: { video: SampleVideo; fromStudio: boolean }) {
  const { state, update, reset } = useVideoState(video);
  const [dirty, setDirty] = useState(false);
  const [note, setNote] = useState("");
  const [revising, setRevising] = useState(false);
  const [askAi, setAskAi] = useState(false);
  const [requestText, setRequestText] = useState("");
  const { status } = state;
  const info = statusInfo[status];
  const style = findStyle(video.styleId);
  const tone = tones.find((t) => t.id === video.tone);
  const sceneNo = (id: string) => state.scenes.findIndex((s) => s.id === id) + 1;

  const stepState = (index: number) => {
    const current = info.step - 1;
    if (status === "terbit" || status === "terjadwal") return index <= current ? "done" : "todo";
    return index < current ? "done" : index === current ? "current" : "todo";
  };

  const showPlan = status === "rencana" || status === "produksi";
  const showResult = !showPlan;

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
          {showPlan && (
            <PlanEditor
              scenes={state.scenes}
              caption={state.caption}
              version={state.planVersion}
              duration={video.duration}
              editable={status === "rencana"}
              onDirtyChange={setDirty}
              onSave={(scenes, caption) => {
                update({ scenes, caption, planVersion: state.planVersion + 1 });
                setNote(`Versi ${state.planVersion + 1} tersimpan. Periksa sekali lagi sebelum menyetujui.`);
              }}
            />
          )}

          {showResult && (
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
                <p style={{ marginTop: 8 }}>{state.caption}</p>
              </details>
            </section>
          )}

          {status === "hasil" && revising && (
            <RevisionForm
              scenes={state.scenes}
              onCancel={() => setRevising(false)}
              onSubmit={(items) => {
                update({ revisions: items, status: "perbaikan" });
                setRevising(false);
                setNote(`${items.length} perbaikan terkirim. Kami kabari saat versi perbaikan siap ditinjau.`);
              }}
            />
          )}

          {status === "perbaikan" && state.revisions.length > 0 && (
            <section className="panel stack-s" aria-labelledby="daftar-revisi">
              <h2 id="daftar-revisi" className="section-title">Perbaikan yang diminta</h2>
              {state.revisions.map((r) => (
                <div key={r.id} className="card">
                  <p className="row" style={{ gap: 6 }}><span className="badge badge-accent">{revisionKinds.find((k) => k.id === r.kind)?.label}</span><span className="hint">Adegan {sceneNo(r.sceneId)}</span></p>
                  <p className="card-text"><strong>Salah:</strong> {r.wrong}</p>
                  <p className="card-text"><strong>Seharusnya:</strong> {r.expected}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="detail-aside stack">
          {status === "rencana" && (
            <div className="action-box">
              <h2>Yang perlu Anda lakukan</h2>
              <p className="hint">Periksa storyboard, naskah dan caption. Klik ikon pensil untuk mengubah adegan. Setelah disetujui, video diproduksi dan memakai 1 kuota.</p>
              <button type="button" className="btn btn-primary btn-block btn-center" disabled={dirty}
                onClick={() => { update({ status: "produksi" }); setNote(""); }}>
                <Clapperboard size={18} aria-hidden="true" /> Setujui versi {state.planVersion} & Produksi
              </button>
              {dirty && <p className="hint">Simpan atau batalkan perubahan dulu sebelum menyetujui.</p>}
              {!askAi ? (
                <button type="button" className="btn btn-block btn-center" onClick={() => setAskAi(true)}>
                  <Wand2 size={18} aria-hidden="true" /> Minta AI menyusun ulang
                </button>
              ) : (
                <div className="field">
                  <label className="label" htmlFor="ai-request">Apa yang perlu diubah?</label>
                  <textarea id="ai-request" className="textarea" style={{ minHeight: 100 }} placeholder="Contoh: buat pembuka lebih memancing rasa ingin tahu, sebut harga di adegan 2"
                    value={requestText} onChange={(e) => setRequestText(e.target.value)} />
                  <div className="btn-pair">
                    <button type="button" className="btn btn-center" onClick={() => setAskAi(false)}>Batal</button>
                    <button type="button" className="btn btn-dark btn-center" disabled={!requestText.trim()}
                      onClick={() => { update({ changeRequest: requestText.trim() }); setAskAi(false); setNote("Permintaan tersimpan. Penyusunan ulang oleh AI aktif setelah planner tersambung."); }}>
                      Kirim
                    </button>
                  </div>
                </div>
              )}
              {state.changeRequest && <p className="notice"><strong>Permintaan terakhir:</strong> {state.changeRequest}</p>}
            </div>
          )}

          {status === "produksi" && (
            <div className="action-box" style={{ borderColor: "var(--line)" }}>
              <h2>Video sedang diproduksi</h2>
              <p className="hint">Anda boleh menutup halaman ini. Kami kabari lewat email saat video siap ditinjau.</p>
              <ul className="progress-list">
                <li><CheckCircle2 size={18} color="var(--success)" aria-hidden="true" /> Rencana versi {state.planVersion} disetujui</li>
                <li><LoaderCircle size={18} color="var(--accent-strong)" aria-hidden="true" /> Membuat suara narasi</li>
                <li><Circle size={18} color="var(--line-strong)" aria-hidden="true" /> Menyusun adegan & render</li>
                <li><Circle size={18} color="var(--line-strong)" aria-hidden="true" /> Pemeriksaan kualitas</li>
              </ul>
              <button type="button" className="btn btn-block btn-center" onClick={() => update({ status: "hasil" })}>Lihat contoh hasil (pratinjau)</button>
            </div>
          )}

          {status === "hasil" && !revising && (
            <div className="action-box">
              <h2>Tinjau hasil video</h2>
              <p className="hint">Tonton sampai selesai. Perbaikan gratis untuk gambar salah tempat, typo, dan pengucapan yang keliru.</p>
              <button type="button" className="btn btn-primary btn-block btn-center" onClick={() => update({ status: "siap" })}>
                <CheckCircle2 size={18} aria-hidden="true" /> Setujui hasil
              </button>
              <button type="button" className="btn btn-block btn-center" onClick={() => setRevising(true)}>
                <RefreshCw size={18} aria-hidden="true" /> Minta perbaikan
              </button>
            </div>
          )}

          {status === "perbaikan" && (
            <div className="action-box" style={{ borderColor: "var(--line)" }}>
              <h2>Perbaikan sedang dikerjakan</h2>
              <p className="hint">Hanya bagian yang diminta yang diubah. Versi baru kembali untuk Anda tinjau.</p>
              <button type="button" className="btn btn-block btn-center" onClick={() => update({ status: "hasil" })}>Lihat hasil perbaikan (pratinjau)</button>
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
            <p className="card-text">Rencana: versi {state.planVersion}</p>
            <p className="card-text">Dibuat: {new Date(video.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
            <button type="button" className="back-link" style={{ marginTop: 6 }} onClick={() => { reset(); setNote("Contoh dikembalikan ke kondisi awal."); setRevising(false); }}>
              <RotateCcw size={14} aria-hidden="true" style={{ verticalAlign: -2 }} /> Atur ulang contoh
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
