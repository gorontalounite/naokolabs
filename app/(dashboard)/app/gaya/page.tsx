import { Palette } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StylePreview } from "@/components/dashboard/StylePreview";
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
            <div className="style-card-preview"><StylePreview styleId={s.id} label="Contoh gerak" /></div>
            <p className="card-text">{s.description}</p>
            <div className="style-meta">
              <span><strong>Cocok untuk:</strong> {s.bestFor}</span>
              <span><strong>Yang perlu disiapkan:</strong> {s.needs}</span>
            </div>
            <Link href={`/app?gaya=${s.id}`} className="btn btn-block btn-center">Pakai gaya ini →</Link>
          </article>
        ))}
      </div>
    </>
  );
}
