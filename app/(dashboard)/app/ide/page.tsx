import { CalendarDays, Lightbulb } from "lucide-react";
import Link from "next/link";
import { IdeaBoard } from "@/components/dashboard/IdeaBoard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { formatShortDate, upcomingMoments } from "@/lib/moments";
import { todayWita } from "@/lib/today";

export const metadata = { title: "Ide Konten" };
export const dynamic = "force-dynamic";

export default function IdeasPage() {
  const moments = upcomingMoments(todayWita(), 10);
  return (
    <>
      <PageHeader icon={Lightbulb} title="Ide Konten" subtitle="Bingung mau posting apa? Pilih momen atau ide, klik “Jadikan video”, dan topiknya langsung terisi di Studio." />

      <section aria-labelledby="momen-title">
        <h2 id="momen-title" className="section-title" style={{ marginBottom: 14 }}><CalendarDays size={20} aria-hidden="true" /> Momen jualan terdekat</h2>
        <div className="moments">
          {moments.map((m) => (
            <div className="moment" key={m.name + m.date.toISOString()}>
              <div className="row"><span className="hint">{formatShortDate(m.date)}</span><span className="badge badge-accent">{m.daysLeft === 0 ? "Hari ini" : `${m.daysLeft} hari lagi`}</span></div>
              <p className="moment-name">{m.name}</p>
              <p className="hint">{m.angle}</p>
              <Link className="text-link" href={`/app?ide=${encodeURIComponent(`Konten ${m.name}: ${m.angle}`)}`}>Buat video →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="ide-title">
        <div className="section-head">
          <h2 id="ide-title" className="section-title"><Lightbulb size={20} aria-hidden="true" /> Ide per kategori</h2>
        </div>
        <p className="notice" style={{ marginBottom: 14 }}>Berita & tren harian pilihan AI belum tersambung. Sementara ini tersedia contoh ide yang bisa langsung dipakai.</p>
        <IdeaBoard />
      </section>
    </>
  );
}
