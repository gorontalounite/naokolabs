"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { revisionKinds, type RevisionItem, type RevisionKind, type Scene } from "@/lib/video-data";

type Draft = { sceneId: string; kind: RevisionKind | ""; wrong: string; expected: string; file: string };

const emptyDraft = (sceneId: string): Draft => ({ sceneId, kind: "", wrong: "", expected: "", file: "" });

function timeRange(scenes: Scene[], index: number) {
  const start = scenes.slice(0, index).reduce((n, s) => n + s.seconds, 0);
  const fmt = (t: number) => `0:${String(t).padStart(2, "0")}`;
  return `${fmt(start)}–${fmt(start + scenes[index].seconds)}`;
}

export function RevisionForm({ scenes, onSubmit, onCancel }: { scenes: Scene[]; onSubmit: (items: RevisionItem[]) => void; onCancel: () => void }) {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft(scenes[0]?.id ?? ""));
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [concept, setConcept] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => { setDraft((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const wrongLabel = draft.kind === "pengucapan" ? "Kata yang salah diucapkan" : draft.kind === "media" ? "Apa yang salah pada visual" : "Teks yang salah";
  const expectedLabel = draft.kind === "pengucapan" ? "Cara membaca yang benar" : draft.kind === "media" ? "Seharusnya tampil" : "Teks yang benar";
  const expectedHint = draft.kind === "pengucapan" ? "Tulis seperti diucapkan, misalnya “Ru-ang Se-la”." : undefined;

  const add = () => {
    const next: typeof errors = {};
    if (!draft.kind) next.kind = "Pilih jenis kesalahan.";
    if (!draft.wrong.trim()) next.wrong = "Jelaskan yang salah.";
    if (!draft.expected.trim()) next.expected = "Tulis yang seharusnya.";
    setErrors(next);
    if (Object.keys(next).length) return false;
    setItems((list) => [...list, { id: `r-${Date.now().toString(36)}`, sceneId: draft.sceneId, kind: draft.kind as RevisionKind, wrong: draft.wrong.trim(), expected: draft.expected.trim(), replacementFile: draft.file || undefined }]);
    setDraft(emptyDraft(draft.sceneId));
    return true;
  };

  const submit = () => {
    const hasDraft = draft.kind || draft.wrong || draft.expected;
    if (hasDraft && !add()) return;
    if (!hasDraft && items.length === 0) return setErrors({ kind: "Tambahkan minimal satu perbaikan." });
    // add() memperbarui state secara asinkron; gabungkan draf terakhir secara eksplisit.
    const last = hasDraft ? [{ id: `r-${Date.now().toString(36)}`, sceneId: draft.sceneId, kind: draft.kind as RevisionKind, wrong: draft.wrong.trim(), expected: draft.expected.trim(), replacementFile: draft.file || undefined }] : [];
    onSubmit([...items, ...last]);
  };

  const sceneLabel = (id: string) => {
    const i = scenes.findIndex((s) => s.id === id);
    return i === -1 ? "Adegan" : `Adegan ${i + 1} (${timeRange(scenes, i)})`;
  };

  return (
    <section className="panel stack" aria-labelledby="revisi-title">
      <div>
        <h2 id="revisi-title" className="section-title">Minta perbaikan</h2>
        <p className="hint" style={{ marginTop: 6 }}>Perbaikan gratis untuk gambar/video salah tempat, typo, dan pengucapan yang keliru. Tidak memakai kuota.</p>
      </div>

      {items.length > 0 && (
        <ul className="stack-s" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((it) => (
            <li key={it.id} className="card">
              <div className="card-head">
                <span className="row" style={{ gap: 6 }}><span className="badge badge-accent">{revisionKinds.find((k) => k.id === it.kind)?.label}</span><span className="hint">{sceneLabel(it.sceneId)}</span></span>
                <button type="button" className="icon-btn icon-btn-danger" aria-label="Hapus perbaikan" onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))}><Trash2 size={16} aria-hidden="true" /></button>
              </div>
              <p className="card-text"><strong>Salah:</strong> {it.wrong}</p>
              <p className="card-text"><strong>Seharusnya:</strong> {it.expected}</p>
              {it.replacementFile && <p className="card-text"><strong>Pengganti:</strong> {it.replacementFile}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="field">
        <label className="label" htmlFor="rv-scene">Bagian video</label>
        <select id="rv-scene" className="select" value={draft.sceneId} onChange={(e) => set("sceneId", e.target.value)}>
          {scenes.map((s, i) => <option key={s.id} value={s.id}>Adegan {i + 1} ({timeRange(scenes, i)}) · {s.screenText || s.narration.slice(0, 40)}</option>)}
        </select>
      </div>

      <fieldset className="fieldset field">
        <legend className="label" style={{ marginBottom: 8 }}>Jenis kesalahan</legend>
        <div className="options">
          {revisionKinds.map((k) => (
            <button key={k.id} type="button" className="option" aria-pressed={draft.kind === k.id} onClick={() => set("kind", k.id)}>
              <span className="option-title" style={{ fontSize: 15 }}>{k.label}</span>
              <span className="option-text">{k.hint}</span>
            </button>
          ))}
        </div>
        {errors.kind && <p className="field-error" role="alert">{errors.kind}</p>}
      </fieldset>

      {draft.kind && (
        <>
          <div className="field">
            <label className="label" htmlFor="rv-wrong">{wrongLabel}</label>
            <input id="rv-wrong" className="input" value={draft.wrong} onChange={(e) => set("wrong", e.target.value)} aria-invalid={!!errors.wrong} />
            {errors.wrong && <p className="field-error">{errors.wrong}</p>}
          </div>
          <div className="field">
            <label className="label" htmlFor="rv-expected">{expectedLabel}</label>
            <input id="rv-expected" className="input" value={draft.expected} onChange={(e) => set("expected", e.target.value)} aria-invalid={!!errors.expected} aria-describedby={expectedHint ? "rv-expected-hint" : undefined} />
            {expectedHint && <p id="rv-expected-hint" className="hint">{expectedHint}</p>}
            {errors.expected && <p className="field-error">{errors.expected}</p>}
          </div>
          {draft.kind === "media" && (
            <div className="field">
              <span className="label">Gambar/video pengganti (opsional)</span>
              <label className="btn" htmlFor="rv-file" style={{ justifySelf: "start" }}>{draft.file ? `Ganti berkas (${draft.file})` : "Pilih berkas"}</label>
              <input id="rv-file" type="file" className="sr-only" accept="image/*,video/*" onChange={(e) => { set("file", e.target.files?.[0]?.name ?? ""); e.target.value = ""; }} />
            </div>
          )}
          <button type="button" className="btn btn-center" onClick={add}><Plus size={18} aria-hidden="true" /> Tambah perbaikan lain</button>
        </>
      )}

      <label className="check">
        <input type="checkbox" checked={concept} onChange={(e) => setConcept(e.target.checked)} />
        Saya ingin mengubah konsep, durasi, gaya atau suara
      </label>
      {concept && (
        <p className="notice notice-warning">Perubahan konsep, durasi, gaya atau suara di luar rencana yang disetujui dibuat sebagai video baru dan memakai kuota. Buat dari Studio Video dengan rencana baru.</p>
      )}

      <div className="btn-pair">
        <button type="button" className="btn btn-center" onClick={onCancel}>Batal</button>
        <button type="button" className="btn btn-primary btn-center" onClick={submit}>Kirim perbaikan</button>
      </div>
    </section>
  );
}
