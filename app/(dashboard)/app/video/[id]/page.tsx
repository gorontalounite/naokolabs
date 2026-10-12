import { notFound } from "next/navigation";
import { VideoDetail } from "@/components/dashboard/VideoDetail";
import { findVideo } from "@/lib/video-data";

export const metadata = { title: "Detail video" };

export default async function VideoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ dari?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const video = findVideo(id);
  if (!video) notFound();
  return <VideoDetail key={video.id} video={video} fromStudio={query.dari === "studio"} />;
}
