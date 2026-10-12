import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Studio } from "@/components/dashboard/Studio";
import { getVideoStyles } from "@/lib/catalog";
import { formatShortDate, upcomingMoments } from "@/lib/moments";
import { todayWita } from "@/lib/today";
import { getViewer } from "@/lib/workspace";

export const metadata = { title: "Studio Video" };

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ gaya?: string; ide?: string }> }) {
  const params = await searchParams;
  const [viewer, styles] = await Promise.all([getViewer(), getVideoStyles()]);
  const name = viewer?.mode === "signed-in" ? (viewer.fullName ?? viewer.email.split("@")[0]) : null;
  const moments = upcomingMoments(todayWita(), 4);

  return (
    <>
      <section className="hero">
        <div className="stack">
          <h1 className="hero-title">Studio Video</h1>
          <p className="hero-greet">{name ? `Selamat datang, ${name}!` : "Selamat datang!"} Buat video Reels, Story dan TikTok untuk brand Anda.</p>
          <p className="hero-lede">Tempel link, tulis naskah, atau cukup satu ide. Kami susun rencananya, Anda setujui, lalu video diproduksi.</p>
          <ol className="steps-inline" aria-label="Langkah membuat video">
            <li>Masukkan bahan</li>
            <li>Setujui rencana</li>
            <li>Video siap posting</li>
          </ol>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div><span>Reels 9:16 · 30 detik</span><b>Video brand Anda</b></div>
        </div>
      </section>

      <div className="section">
        <Studio styles={styles} presetStyle={params.gaya} presetIdea={params.ide} />
      </div>

      <section className="section" aria-labelledby="momen-title">
        <div className="section-head">
          <h2 id="momen-title" className="section-title"><CalendarDays size={20} aria-hidden="true" /> Momen jualan terdekat</h2>
          <Link href="/app/ide" className="text-link">Semua ide konten →</Link>
        </div>
        <div className="moments">
          {moments.map((m) => (
            <div className="moment" key={m.name + m.date.toISOString()}>
              <div className="row"><span className="hint">{formatShortDate(m.date)}</span><span className="badge">{m.daysLeft === 0 ? "Hari ini" : `${m.daysLeft} hari lagi`}</span></div>
              <p className="moment-name">{m.name}</p>
              <Link className="text-link" href={`/app?ide=${encodeURIComponent(`Konten ${m.name}: ${m.angle}`)}`}>Buat video →</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
