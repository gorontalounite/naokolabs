import { ItemList } from "@/components/dashboard/ItemList";
import { FixtureNote, PageHeader } from "@/components/dashboard/PageHeader";
import { contentItems } from "@/lib/fixtures";

export const metadata = { title: "Hasil Konten" };

export default function ResultsPage() {
  const ready = contentItems.filter((item) => item.outputVersion !== null);
  return (
    <div className="narrow">
      <PageHeader title="Hasil Konten" subtitle="Preview, caption, unduh dan revisi." />
      <ItemList items={ready} hrefFor={(item) => `/app/hasil/${item.id}`} linkLabel={() => "Lihat hasil"} />
      <FixtureNote />
    </div>
  );
}
