import { notFound } from "next/navigation";
import { PostingForm } from "@/components/dashboard/PostingForm";
import { findItem } from "@/lib/fixtures";

export const metadata = { title: "Posting konten" };

export default async function PostingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findItem(id);
  if (!item || item.outputVersion === null) notFound();
  return <PostingForm item={item} />;
}
