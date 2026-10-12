"use client";

import { useState } from "react";
import { connectedAccounts, timezones, type ContentItem } from "@/lib/fixtures";

export function PostingForm({ item }: { item: ContentItem }) {
  const [mode, setMode] = useState<"now" | "schedule">("schedule");
  const [account, setAccount] = useState("");
  const [when, setWhen] = useState("");
  const [zone, setZone] = useState("Asia/Makassar");
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return setError("Pilih akun tujuan.");
    if (mode === "schedule" && !when) return setError("Isi tanggal dan waktu.");
    setError("");
    setReview(true);
  };

  const accountLabel = connectedAccounts.find((a) => a.id === account)?.label;
  const zoneLabel = timezones.find((z) => z.id === zone)?.label;

  return (
    <div className="narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">Posting konten</h1>
          <p className="page-subtitle">Setelah persetujuan hasil</p>
        </div>
      </div>

      <form className="wizard" noValidate onSubmit={submit}>
        <div className="card card-muted post-item">
          <span className="post-thumb" aria-hidden="true" />
          <div>
            <p className="card-title" style={{ fontSize: 16 }}>{item.title}</p>
            <p className="meta" style={{ marginTop: 8 }}>Output versi {item.outputVersion} · Disetujui (contoh)</p>
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="account">Akun tujuan</label>
          <select id="account" className="select" value={account} onChange={(event) => { setAccount(event.target.value); setReview(false); }}>
            <option value="">Pilih akun terhubung</option>
            {connectedAccounts.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </div>

        <fieldset className="field fieldset">
          <legend className="label" style={{ marginBottom: 8 }}>Waktu publikasi</legend>
          <div className="btn-row">
            <button type="button" className="seg" aria-pressed={mode === "now"} onClick={() => { setMode("now"); setReview(false); }}>Posting sekarang</button>
            <button type="button" className="seg" aria-pressed={mode === "schedule"} onClick={() => { setMode("schedule"); setReview(false); }}>Jadwalkan</button>
          </div>
        </fieldset>

        {mode === "schedule" && (
          <>
            <div className="field">
              <label className="label" htmlFor="when">Tanggal dan waktu</label>
              <input id="when" type="datetime-local" className="input" value={when} onChange={(event) => { setWhen(event.target.value); setReview(false); }} />
            </div>
            <div className="field">
              <label className="label" htmlFor="zone">Zona waktu</label>
              <select id="zone" className="select" value={zone} onChange={(event) => { setZone(event.target.value); setReview(false); }}>
                {timezones.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
              </select>
            </div>
          </>
        )}

        <p className="hint">Periksa akun, konten dan waktu.</p>
        {error && <p className="field-error" role="alert">{error}</p>}

        {review && (
          <div className="notice" role="status">
            <p><strong>Konfirmasi (pratinjau)</strong></p>
            <p>{item.title} · output versi {item.outputVersion}</p>
            <p>{accountLabel}</p>
            <p>{mode === "now" ? "Posting sekarang" : `${when.replace("T", " · ")} · ${zoneLabel}`}</p>
            <p style={{ marginTop: 8 }}>Koneksi akun sosial dan publikasi belum aktif.</p>
          </div>
        )}

        <div className="wizard-footer">
          <button type="submit" className="btn btn-primary">Tinjau konfirmasi</button>
          <p className="save-status">Akun sosial harus mendukung format konten.</p>
        </div>
      </form>
    </div>
  );
}
