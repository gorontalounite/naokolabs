import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ScheduleWeek } from "@/components/dashboard/ScheduleWeek";
import { todayWita } from "@/lib/today";
import { findVideo } from "@/lib/video-data";

export const metadata = { title: "Jadwal & Auto-Post" };

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ video?: string }> }) {
  const { video } = await searchParams;
  const t = todayWita();
  const todayIso = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  return (
    <>
      <PageHeader icon={CalendarDays} title="Jadwal & Auto-Post" subtitle="Atur kapan video terbit di Instagram, TikTok dan Facebook." />
      <ScheduleWeek todayIso={todayIso} pendingTitle={video ? findVideo(video)?.title : undefined} />
    </>
  );
}
