import { notFound } from "next/navigation";
import { ResultView } from "@/components/dashboard/ResultView";
import { findItem } from "@/lib/fixtures";

export const metadata = { title: "Hasil konten" };

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findItem(id);
  if (!item || item.outputVersion === null) notFound();
  return <ResultView item={item} />;
}
