import { Lock, Palette } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReferenceCard } from "@/components/dashboard/ReferenceCard";
import { referenceThumbnail, references } from "@/lib/references";
import { videoStyles } from "@/lib/video-data";
import { getViewer } from "@/lib/workspace";

export const metadata = { title: "Katalog Gaya" };
export const dynamic = "force-dynamic";

// Katalog hanya untuk pengguna yang sudah login: video referensi sebagian besar karya pihak lain (D-22).
export default async function StylesPage({ searchParams }: { searchParams: Promise<{ gaya?: string }> }) {
  const [{ gaya }, viewer] = await Promise.all([searchParams, getViewer()]);

  if (viewer?.mode !== "signed-in") {
    return (
      <>
        <PageHeader icon={Palette} title="Katalog Gaya" />
        <div className="empty">
          <span className="empty-icon"><Lock size={26} aria-hidden="true" /></span>
          <h2>Masuk untuk melihat katalog</h2>
          <p>Katalog berisi video acuan dan prompt-nya, khusus untuk akun yang sudah masuk.</p>
          <Link href="/masuk?next=/app/gaya" className="btn btn-primary">Masuk →</Link>
        </div>
      </>
    );
  }

  const active = videoStyles.find((s) => s.id === gaya)?.id ?? videoStyles[0].id;
  const items = references.filter((r) => r.style === active);

  return (
    <>
      <PageHeader icon={Palette} title="Katalog Gaya" />
      <nav className="segment" aria-label="Gaya video" style={{ marginBottom: 20 }}>
        {videoStyles.map((s) => (
          <Link key={s.id} href={`/app/gaya?gaya=${s.id}`} aria-current={active === s.id ? "page" : undefined}>
            {s.name} ({references.filter((r) => r.style === s.id).length})
          </Link>
        ))}
      </nav>
      {items.length === 0 ? (
        <p className="notice">Belum ada video acuan untuk gaya ini.</p>
      ) : (
        <div className="ref-grid">
          {items.map((r) => (
            <ReferenceCard key={r.id} item={{ id: r.id, file: r.file, title: r.title, style: r.style, prompt: r.prompt, thumbnail: referenceThumbnail(r.id), duration: r.duration, aspect: r.aspect }} />
          ))}
        </div>
      )}
    </>
  );
}
