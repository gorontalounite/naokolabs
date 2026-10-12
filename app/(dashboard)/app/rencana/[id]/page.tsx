import { notFound } from "next/navigation";
import { PlanReview } from "@/components/dashboard/PlanReview";
import { findItem } from "@/lib/fixtures";

export const metadata = { title: "Rencana konten" };

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findItem(id);
  if (!item) notFound();
  return <PlanReview item={item} />;
}
