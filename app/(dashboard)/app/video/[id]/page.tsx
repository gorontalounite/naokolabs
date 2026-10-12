import { notFound } from "next/navigation";
import { LocalVideo } from "@/components/dashboard/LocalVideo";
import { VideoDetail } from "@/components/dashboard/VideoDetail";
import { findVideo } from "@/lib/video-data";

export const metadata = { title: "Detail video" };

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = findVideo(id);
  if (video) return <VideoDetail key={video.id} video={video} />;
  if (/^v-[a-z0-9]{4,20}$/.test(id)) return <LocalVideo id={id} />;
  notFound();
}
