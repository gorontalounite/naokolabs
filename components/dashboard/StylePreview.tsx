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
};

const KNOWN = new Set(Object.keys(scenes));
