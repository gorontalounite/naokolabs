import { Palette } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StylePreview } from "@/components/dashboard/StylePreview";
import { examplesForStyle } from "@/lib/style-examples";
import { getVideoStyles } from "@/lib/catalog";

export const metadata = { title: "Katalog Gaya" };
export const revalidate = 300;

export default async function StylesPage() {
  const videoStyles = await getVideoStyles();
  return (
    <>
      <PageHeader
        icon={Palette}
        title="Katalog Gaya Video"
        subtitle="Pilih gaya yang paling cocok dengan pesan Anda. Gaya standar termasuk kuota langganan; gaya dengan label “Perlu penawaran” memakai biaya tambahan yang ditampilkan sebelum produksi."
      />
      <div className="grid-3">
        {videoStyles.map((s) => (
          <article key={s.id} className="style-card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2>{s.name}</h2>
              {s.tier === "quote" ? <span className="badge badge-warning">Perlu penawaran</span> : <span className="badge badge-success">Standar</span>}
            </div>
            <p className="tagline">{s.tagline}</p>
            <p className="card-text">{s.description}</p>
            <div className="style-meta">
              <span><strong>Cocok untuk:</strong> {s.bestFor}</span>
              <span><strong>Yang perlu disiapkan:</strong> {s.needs}</span>
            </div>
            {examplesForStyle(s.id).map((ex) => (
              <div key={ex.id} className="example">
                <div className="example-media">
                  {ex.video ? (
                    <video src={ex.video} poster={ex.poster ?? undefined} controls muted playsInline preload="metadata" aria-label={`Video contoh: ${ex.title}`} />
                  ) : (
                    <StylePreview styleId={s.id} label="Video contoh menyusul" />
                  )}
                </div>
                <div className="example-body">
                  <p className="detail-label">Contoh video</p>
                  <p className="card-title">{ex.title}</p>
                  <p className="hint">{ex.look}</p>
                  <p className="detail-label" style={{ marginTop: 6 }}>Prompt (ide)</p>
                  <blockquote className="example-prompt">{ex.idea}</blockquote>
                </div>
                <Link href={`/app?gaya=${s.id}&contoh=${ex.id}`} className="btn btn-block btn-center">Buat seperti contoh ini →</Link>
              </div>
            ))}
            <Link href={`/app?gaya=${s.id}`} className="text-link" style={{ justifySelf: "center" }}>Pakai gaya ini tanpa contoh</Link>
          </article>
        ))}
      </div>
    </>
  );
}
