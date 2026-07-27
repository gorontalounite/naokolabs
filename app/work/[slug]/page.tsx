import Link from "next/link";
import { notFound } from "next/navigation";

const explorations = {
  "brand-system": {
    number: "01",
    category: "Brand Identity",
    title: "Make it clear.",
    description: "Eksplorasi tentang bagaimana positioning, visual system, dan panduan sederhana dapat membuat brand tampil lebih konsisten.",
    focus: ["Positioning", "Visual system", "Guidelines"],
    tone: "case-red",
  },
  "social-presence": {
    number: "02",
    category: "Social Media",
    title: "Simple ideas. Strong presence.",
    description: "Eksplorasi sistem editorial untuk membuat kehadiran sosial terasa terarah, mudah dikenali, dan relevan bagi audiens.",
    focus: ["Strategy", "Editorial", "Design"],
    tone: "case-light",
  },
  "moving-image": {
    number: "03",
    category: "Content & Video",
    title: "Every frame counts.",
    description: "Eksplorasi pendekatan short-form video yang menjaga pesan brand tetap utuh dalam format yang bergerak cepat.",
    focus: ["Reels", "Editing", "Motion"],
    tone: "case-dark",
  },
} as const;

type Slug = keyof typeof explorations;

export default async function WorkExplorationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in explorations)) notFound();
  const work = explorations[slug as Slug];

  return (
    <main className={`case-page ${work.tone}`}>
      <nav className="case-nav">
        <Link href="/" className="case-brand">NAOKOLABS</Link>
        <Link href="/#work" className="case-back">Kembali ke arah kerja</Link>
      </nav>
      <section className="case-hero">
        <p>{work.number} / Studio exploration</p>
        <span className="case-kanji" aria-hidden="true">尚子</span>
        <h1>{work.title}</h1>
        <div className="case-summary"><span>{work.category}</span><p>{work.description}</p></div>
      </section>
      <section className="case-focus"><p>Fokus eksplorasi</p><div>{work.focus.map((item) => <span key={item}>{item}</span>)}</div></section>
      <section className="case-note"><p>Catatan</p><h2>Ini adalah arah eksplorasi studio, bukan studi kasus klien.</h2><p>Halaman ini menunjukkan jenis pemikiran dan output yang dapat dikembangkan bersama. Case study dengan hasil dan konteks bisnis nyata akan ditambahkan ketika materi portfolio tersedia.</p><Link href="/#contact">Diskusikan kebutuhan Anda</Link></section>
    </main>
  );
}
