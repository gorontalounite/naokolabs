// Pratinjau gerak singkat per gaya video (CSS, tanpa file video).
// Diganti contoh video asli per gaya setelah produksi sungguhan berjalan.
export function StylePreview({ styleId, label }: { styleId: string; label?: string }) {
  return (
    <span className={`sp sp-${KNOWN.has(styleId) ? styleId : "motion-graphic"}`} aria-hidden="true">
      {scenes[styleId] ?? scenes["motion-graphic"]}
      {label && <span className="sp-label">{label}</span>}
    </span>
  );
}

const scenes: Record<string, React.ReactNode> = {
  "motion-graphic": (
    <>
      <span className="sp-dot" />
      <span className="sp-bar sp-b1" />
      <span className="sp-bar sp-b2" />
      <span className="sp-bar sp-b3" />
    </>
  ),
  explainer: (
    <>
      <span className="sp-line" />
      <span className="sp-node sp-n1">1</span>
      <span className="sp-node sp-n2">2</span>
      <span className="sp-node sp-n3">3</span>
    </>
  ),
  whiteboard: (
    <svg viewBox="0 0 90 160" className="sp-svg">
      <path className="sp-draw sp-d1" d="M45 38 a16 16 0 1 1 0.1 0 M38 70 h14 M40 76 h10" />
      <path className="sp-draw sp-d2" d="M18 104 h54 M18 116 h40 M18 128 h48" />
    </svg>
  ),
  "ugc-edit": (
    <>
      <span className="sp-rec" />
      <span className="sp-head" />
      <span className="sp-body" />
      <span className="sp-cap"><i>Coba</i> <i>ini</i> <i>deh!</i></span>
    </>
  ),
  "stock-cinematic": (
    <>
      <span className="sp-sky" />
      <span className="sp-hill sp-h1" />
      <span className="sp-hill sp-h2" />
      <span className="sp-lb sp-lb-top" />
      <span className="sp-lb sp-lb-bot" />
      <span className="sp-title" />
    </>
  ),
  "ilustrasi-2d": (
    <>
      <span className="sp-sun" />
      <span className="sp-char"><span className="sp-char-head" /><span className="sp-char-body" /></span>
      <span className="sp-ground" />
    </>
  ),
  "presenter-ai": (
    <>
      <span className="sp-avatar" />
      <span className="sp-shoulder" />
      <span className="sp-third"><span /><span /></span>
    </>
  ),
  "cinematic-ai": (
    <>
      <span className="sp-glow" />
      <span className="sp-horizon" />
      <span className="sp-sweep" />
    </>
  ),
};

const KNOWN = new Set(Object.keys(scenes));
