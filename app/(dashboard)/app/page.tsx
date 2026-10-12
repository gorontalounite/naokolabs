import { Studio } from "@/components/dashboard/Studio";
import { findReference } from "@/lib/references";
import { getViewer } from "@/lib/workspace";

export const metadata = { title: "Studio Video" };

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ contoh?: string; ide?: string }> }) {
  const params = await searchParams;
  const viewer = await getViewer();
  const name = viewer?.mode === "signed-in" ? (viewer.fullName ?? viewer.email.split("@")[0]) : null;
  const ref = findReference(params.contoh);
  return (
    <>
      <section className="hero">
        <div className="stack">
          <h1 className="hero-title">Studio Video</h1>
          <p className="hero-greet">{name ? `Selamat datang, ${name}!` : "Selamat datang!"} Cukup tulis satu ide, kami jadikan video Reels, Story dan TikTok untuk brand Anda.</p>
          <p className="hero-lede">Ide Anda kami susun menjadi storyboard. Setelah Anda setujui, video diproduksi dan siap diunduh.</p>
          <ol className="steps-inline" aria-label="Langkah membuat video">
            <li>Tulis ide</li>
            <li>Setujui storyboard</li>
            <li>Unduh video</li>
          </ol>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div><span>Reels 9:16 · durasi sesuai ide</span><b>Video brand Anda</b></div>
        </div>
      </section>

      <div className="section">
        <Studio reference={ref ? { id: ref.id, title: ref.title, file: ref.file, style: ref.style } : null} presetIdea={params.ide} />
      </div>
    </>
  );
}
