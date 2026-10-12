"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { countWords, MAX_VIDEO_SECONDS, readingSeconds, type Scene } from "@/lib/video-data";

type Tab = "storyboard" | "naskah" | "caption";

const MIN_SCENES = 1;
const MAX_SCENES = 12;

function newScene(): Scene {
  return { id: `s-${Date.now().toString(36)}`, seconds: 4, screenText: "", narration: "", visual: "", asset: { label: "Belum dipilih", placeholder: true } };
}

export function PlanEditor({
  scenes,
  caption,
  version,
  editable,
  onSave,
  onDirtyChange,
}: {
  scenes: Scene[];
  caption: string;
  version: number;
  editable: boolean;
  onSave: (scenes: Scene[], caption: string) => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("storyboard");
  const [draft, setDraft] = useState<Scene[]>(scenes);
  const [draftCaption, setDraftCaption] = useState(caption);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Saat versi tersimpan berubah dari luar (simpan/atur ulang), samakan draf.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkron draf dengan versi tersimpan
    setDraft(scenes);
    setDraftCaption(caption);
    setEditing(null);
  }, [scenes, caption]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(scenes) || draftCaption !== caption, [draft, scenes, draftCaption, caption]);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const total = draft.reduce((sum, s) => sum + s.seconds, 0);
  const spoken = draft.reduce((sum, s) => sum + readingSeconds(s.narration), 0);
  const tooLong = total > MAX_VIDEO_SECONDS;
  const narrationOver = spoken > total + 2;

  const patch = (id: string, value: Partial<Scene>) => setDraft((list) => list.map((s) => (s.id === id ? { ...s, ...value } : s)));
  const move = (index: number, dir: -1 | 1) =>
    setDraft((list) => {
      const next = [...list];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];
      return next;
    });

  const save = () => {
    const empty = draft.findIndex((s) => !s.narration.trim() && !s.screenText.trim());
    if (empty !== -1) return setError(`Adegan ${empty + 1} masih kosong. Isi teks di layar atau narasi, atau hapus adegannya.`);
    if (!draftCaption.trim()) return setError("Caption tidak boleh kosong.");
    setError("");
    onSave(draft, draftCaption.trim());
  };

  return (
    <section className="panel" aria-labelledby="rencana-title">
      <div className="section-head">
        <h2 id="rencana-title" className="section-title">Rencana versi {version}{dirty && <span className="badge badge-warning">Belum disimpan</span>}</h2>
        <span className="badge">± {total} detik · mengikuti adegan</span>
      </div>

      <div className="segment" role="tablist" aria-label="Bagian rencana" style={{ marginBottom: 16 }}>
        {(["storyboard", "naskah", "caption"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t === "storyboard" ? "Storyboard" : t === "naskah" ? "Naskah" : "Caption"}
          </button>
        ))}
      </div>

      {(tooLong || narrationOver) && (
        <p className="notice notice-warning row" role="status" style={{ marginBottom: 14 }}>
          <TriangleAlert size={18} aria-hidden="true" />
          {tooLong
            ? `Total ${total} detik, melebihi batas ${MAX_VIDEO_SECONDS} detik per video. Hapus atau persingkat adegan.`
            : `Narasi butuh ± ${spoken} detik, adegan hanya ${total} detik. Ringkas narasi atau tambah durasi adegan; naskah yang disetujui tidak dipotong otomatis.`}
        </p>
      )}

      {tab === "storyboard" && (
        <ol className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {draft.map((scene, i) => {
            const isEditing = editable && editing === scene.id;
            const words = countWords(scene.narration);
            return (
              <li key={scene.id} className="scene" data-editing={isEditing || undefined}>
                <div className="scene-head">
                  <h3>Adegan {i + 1}</h3>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="badge">± {scene.seconds} detik</span>
                    {editable && !isEditing && (
                      <button type="button" className="icon-btn" onClick={() => setEditing(scene.id)} aria-label={`Edit adegan ${i + 1}`}>
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="stack-s">
                    <div className="field">
                      <label className="label" htmlFor={`st-${scene.id}`}>Teks di layar</label>
                      <textarea id={`st-${scene.id}`} className="textarea" rows={2} style={{ minHeight: 64 }} value={scene.screenText} onChange={(e) => patch(scene.id, { screenText: e.target.value })} aria-describedby={`st-hint-${scene.id}`} />
                      <p id={`st-hint-${scene.id}`} className="hint">Maksimal 2 baris, tiap baris ± 8 kata.</p>
                    </div>
                    <div className="field">
                      <label className="label" htmlFor={`nr-${scene.id}`}>Narasi (dibacakan)</label>
                      <textarea id={`nr-${scene.id}`} className="textarea" style={{ minHeight: 96 }} value={scene.narration} onChange={(e) => patch(scene.id, { narration: e.target.value })} aria-describedby={`nr-hint-${scene.id}`} />
                      <p id={`nr-hint-${scene.id}`} className="hint">{words} kata · ± {readingSeconds(scene.narration)} detik dibaca</p>
                    </div>
                    <div className="field">
                      <label className="label" htmlFor={`vs-${scene.id}`}>Visual</label>
                      <input id={`vs-${scene.id}`} className="input" value={scene.visual} onChange={(e) => patch(scene.id, { visual: e.target.value })} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor={`dr-${scene.id}`}>Durasi adegan</label>
                      <select id={`dr-${scene.id}`} className="select" value={scene.seconds} onChange={(e) => patch(scene.id, { seconds: Number(e.target.value) })}>
                        {Array.from({ length: 14 }, (_, n) => n + 2).map((n) => <option key={n} value={n}>{n} detik</option>)}
                      </select>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div className="row" style={{ gap: 6 }}>
                        <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Pindah ke atas"><ArrowUp size={16} aria-hidden="true" /></button>
                        <button type="button" className="icon-btn" disabled={i === draft.length - 1} onClick={() => move(i, 1)} aria-label="Pindah ke bawah"><ArrowDown size={16} aria-hidden="true" /></button>
                        <button type="button" className="icon-btn icon-btn-danger" disabled={draft.length <= MIN_SCENES}
                          onClick={() => { setDraft((list) => list.filter((s) => s.id !== scene.id)); setEditing(null); }} aria-label={`Hapus adegan ${i + 1}`}>
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                      <button type="button" className="btn" onClick={() => setEditing(null)}>Selesai</button>
                    </div>
                  </div>
                ) : (
                  <div className="scene-body">
                    <div className="keyframe">{scene.asset.placeholder ? "PLACEHOLDER" : "RENCANA"}<br />{scene.asset.label}</div>
                    <div className="stack-s">
                      <div><p className="detail-label">Teks di layar</p><p className="detail-text" style={{ whiteSpace: "pre-line" }}>{scene.screenText || <span className="hint">Belum diisi</span>}</p></div>
                      <div><p className="detail-label">Narasi</p><p className="detail-text">{scene.narration || <span className="hint">Belum diisi</span>}</p></div>
                      <div><p className="detail-label">Visual</p><p className="detail-text">{scene.visual || <span className="hint">Belum diisi</span>}</p></div>
                      {scene.motion && <div><p className="detail-label">Gerakan</p><p className="detail-text">{scene.motion}</p></div>}
                      {scene.purpose && <p className="hint">Tujuan adegan: {scene.purpose}</p>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {tab === "naskah" && (
        <div className="stack-s">
          <ol className="stack" style={{ margin: 0, paddingLeft: 20 }}>
            {draft.map((scene) => <li key={scene.id} className="detail-text">{scene.narration || <span className="hint">(tanpa narasi)</span>}</li>)}
          </ol>
          <p className="hint">{draft.reduce((n, s) => n + countWords(s.narration), 0)} kata · ± {spoken} detik dibaca. {editable && "Edit narasi di tab Storyboard."}</p>
        </div>
      )}

      {tab === "caption" && (editable ? (
        <div className="field">
          <label className="label" htmlFor="caption">Caption posting</label>
          <textarea id="caption" className="textarea" value={draftCaption} onChange={(e) => setDraftCaption(e.target.value)} />
          <p className="hint">{draftCaption.length} karakter</p>
        </div>
      ) : <p className="detail-text">{caption}</p>)}

      {editable && (
        <div className="stack-s" style={{ marginTop: 16 }}>
          {tab === "storyboard" && draft.length < MAX_SCENES && (
            <button type="button" className="btn btn-block btn-center" onClick={() => { const s = newScene(); setDraft((list) => [...list, s]); setEditing(s.id); }}>
              <Plus size={18} aria-hidden="true" /> Tambah adegan
            </button>
          )}
          {error && <p className="field-error" role="alert">{error}</p>}
          {dirty && (
            <div className="btn-pair">
              <button type="button" className="btn btn-center" onClick={() => { setDraft(scenes); setDraftCaption(caption); setEditing(null); setError(""); }}>Batalkan perubahan</button>
              <button type="button" className="btn btn-dark btn-center" onClick={save}>Simpan sebagai versi {version + 1}</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
