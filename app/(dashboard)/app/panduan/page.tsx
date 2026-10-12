import { BookOpen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { guideModules } from "@/lib/guide";

export const metadata = { title: "Panduan" };

export default async function GuidePage({ searchParams }: { searchParams: Promise<{ modul?: string }> }) {
  const { modul } = await searchParams;
  const current = guideModules.find((m) => m.id === modul) ?? guideModules[0];
  const index = guideModules.indexOf(current);
  const next = guideModules[index + 1];

  return (
    <>
      <PageHeader icon={BookOpen} title="Panduan" subtitle="Cara memakai Studio Video NaokoLabs, langkah demi langkah." />
      <div className="guide">
        <nav aria-label="Daftar modul">
          <ol className="guide-nav">
            {guideModules.map((m, i) => (
              <li key={m.id}>
                <Link href={`/app/panduan?modul=${m.id}`} aria-current={m.id === current.id ? "true" : undefined}>
                  <span className="num">{i + 1}</span>
                  <strong>{m.title}</strong>
                  <small>{m.subtitle}</small>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <article className="panel guide-body">
          <h2 className="section-title" style={{ fontSize: 22 }}>{index + 1}. {current.title}</h2>
          <p className="card-text" style={{ fontSize: 15 }}>{current.intro}</p>
          <ol>
            {current.steps.map((s) => (
              <li key={s.title}><strong>{s.title}</strong><span className="card-text">{s.body}</span></li>
            ))}
          </ol>
          {next ? (
            <Link href={`/app/panduan?modul=${next.id}`} className="btn" style={{ justifySelf: "start" }}>Lanjut: {next.title} →</Link>
          ) : (
            <Link href="/app" className="btn btn-primary" style={{ justifySelf: "start" }}>Buat video sekarang →</Link>
          )}
        </article>
      </div>
    </>
  );
}
