"use client";

import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VideoDetail } from "@/components/dashboard/VideoDetail";
import { loadLocalVideo, type LocalVideoMeta } from "@/lib/video-store";

// Video yang dibuat dari Studio disimpan di perangkat sampai penyimpanan akun tersambung.
export function LocalVideo({ id }: { id: string }) {
  const [video, setVideo] = useState<LocalVideoMeta | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hanya tersedia setelah hidrasi
    setVideo(loadLocalVideo(id));
  }, [id]);

  if (video === undefined) return <p className="hint" role="status">Memuat video…</p>;
  if (video === null)
    return (
      <div className="empty">
        <span className="empty-icon"><FileQuestion size={26} aria-hidden="true" /></span>
        <h1 className="section-title">Video tidak ditemukan</h1>
        <p>Video ini tersimpan di perangkat lain atau datanya sudah dihapus dari browser.</p>
        <Link href="/app/riwayat" className="btn btn-primary">Buka Riwayat Video →</Link>
      </div>
    );
  return <VideoDetail key={video.id} video={video} />;
}
