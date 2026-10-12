import { Target } from "lucide-react";
import type { Brief } from "@/lib/ai/schema";

// Brief konten hasil planner: dasar storyboard yang ditinjau klien.
export function BriefCard({ brief, durationReason }: { brief: Brief; durationReason?: string }) {
  return (
    <section className="panel stack-s" aria-labelledby="brief-title">
      <h2 id="brief-title" className="section-title"><Target size={20} aria-hidden="true" /> Brief konten</h2>
      <dl className="brief">
        <div><dt>Pesan utama</dt><dd>{brief.keyMessage}</dd></div>
        <div><dt>Tujuan</dt><dd>{brief.goal}</dd></div>
        <div><dt>Penonton</dt><dd>{brief.audience}</dd></div>
        <div><dt>Sudut cerita</dt><dd>{brief.angle}</dd></div>
        {brief.points.length > 0 && (
          <div><dt>Isi</dt><dd><ol className="brief-points">{brief.points.map((p) => <li key={p}>{p}</li>)}</ol></dd></div>
        )}
        <div><dt>Ajakan</dt><dd>{brief.cta}</dd></div>
        {durationReason && <div><dt>Durasi</dt><dd>{durationReason}</dd></div>}
      </dl>
    </section>
  );
}
