"use client";

import { useState } from "react";
import { caption, scenes, strategy, type ContentItem } from "@/lib/fixtures";

const tabs = ["Strategi", "Naskah", "Storyboard", "Caption"] as const;
type Tab = (typeof tabs)[number];

export function PlanReview({ item }: { item: ContentItem }) {
  const [tab, setTab] = useState<Tab>("Storyboard");
  const [index, setIndex] = useState(0);
  const [decision, setDecision] = useState<"none" | "approved" | "changes">("none");
  const scene = scenes[index];

  return (
    <div className="narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rencana konten</h1>
          <p className="page-subtitle">{item.title} · Versi {item.planVersion}</p>
        </div>
      </div>

      <div className="stack">
        <div className="tabs" role="tablist" aria-label="Bagian rencana">
          {tabs.map((name) => (
            <button key={name} type="button" role="tab" id={`tab-${name}`} aria-selected={tab === name}
              aria-controls="plan-panel" className="tab" onClick={() => setTab(name)}>
              {name}
            </button>
          ))}
        </div>

        <div id="plan-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="stack">
          {tab === "Strategi" && (
            <dl className="dl">
              {([["Tujuan", strategy.goal], ["Audiens", strategy.audience], ["Pesan utama", strategy.message], ["CTA", strategy.cta]] as const).map(([label, text]) => (
                <div key={label}><dt className="detail-label">{label}</dt><dd className="detail-text" style={{ margin: 0 }}>{text}</dd></div>
              ))}
            </dl>
          )}

          {tab === "Naskah" && (
            <ol className="dl" style={{ margin: 0, paddingLeft: 20 }}>
              {scenes.map((s, i) => (
                <li key={s.id}>
                  <p className="detail-label">Scene {i + 1} · {s.duration}</p>
                  <p className="detail-text">{s.narration}</p>
                </li>
              ))}
            </ol>
          )}

          {tab === "Storyboard" && (
            <>
              <div className="scene-head">
                <h2>Scene {index + 1} / {scenes.length}</h2>
                <span className="meta">{scene.duration} · perkiraan</span>
              </div>
              <div className="preview-box">
                <div>
                  <span className="preview-label">{scene.asset.startsWith("Placeholder") ? "PLACEHOLDER" : "RENCANA"}</span>
                  <p>Keyframe / layout preview</p>
                </div>
              </div>
              <div><p className="detail-label">Teks layar</p><p className="detail-text">{scene.screenText}</p></div>
              <div><p className="detail-label">Narasi</p><p className="detail-text">{scene.narration}</p></div>
              <p className="meta">Aset: {scene.asset} · Crop: {scene.crop}</p>
              <p className="meta">Gerak: {scene.motion}</p>
              <button type="button" className="btn" style={{ minHeight: 60 }}
                onClick={() => setIndex(index === scenes.length - 1 ? 0 : index + 1)}>
                {index === scenes.length - 1 ? "Kembali ke scene 1" : "Scene berikutnya"}
              </button>
              {index > 0 && <button type="button" className="back-link" onClick={() => setIndex(index - 1)}>Scene sebelumnya</button>}
            </>
          )}

          {tab === "Caption" && <p className="detail-text">{caption}</p>}
        </div>

        <p className="hint">Tinjau seluruh scene, naskah dan caption.</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setDecision("changes")}>Minta perubahan</button>
          <button type="button" className="btn btn-primary" onClick={() => setDecision("approved")}>Setujui versi</button>
        </div>
        <p className="save-status" role="status" aria-live="polite">
          {decision === "approved" && `Pratinjau: versi ${item.planVersion} akan dicatat sebagai disetujui setelah server aktif.`}
          {decision === "changes" && "Pratinjau: formulir perubahan per scene dibuat pada tahap berikutnya."}
          {decision === "none" && "Persetujuan mencatat versi yang ditinjau."}
        </p>
      </div>
    </div>
  );
}
