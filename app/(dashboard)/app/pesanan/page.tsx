import { ItemList } from "@/components/dashboard/ItemList";
import { FixtureNote, PageHeader } from "@/components/dashboard/PageHeader";
import { contentItems } from "@/lib/fixtures";

export const metadata = { title: "Pesanan" };

export default function OrdersPage() {
  return (
    <div className="narrow">
      <PageHeader title="Pesanan" subtitle="Status setiap konten yang dipesan." />
      <ItemList items={contentItems} hrefFor={(item) => item.action.href} linkLabel={(item) => item.action.label} />
      <FixtureNote />
    </div>
  );
}
