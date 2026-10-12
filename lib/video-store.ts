"use client";

import { useEffect, useState } from "react";
import type { RevisionItem, SampleVideo, Scene, VideoStatus } from "@/lib/video-data";

// Penyimpanan sementara di browser selama data akun belum aktif (BUILD-PLAN urutan F).
export type VideoState = {
  status: VideoStatus;
  planVersion: number;
  scenes: Scene[];
  caption: string;
  revisions: RevisionItem[];
  changeRequest: string;
};

const key = (id: string) => `naokolabs:video:${id}`;

function initial(video: SampleVideo): VideoState {
  return { status: video.status, planVersion: video.planVersion, scenes: video.scenes, caption: video.caption, revisions: [], changeRequest: "" };
}

export function useVideoState(video: SampleVideo) {
  const [state, setState] = useState<VideoState>(() => initial(video));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key(video.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- memulihkan progres contoh setelah hidrasi
      if (raw) setState({ ...initial(video), ...JSON.parse(raw) });
    } catch {
      // Abaikan: mulai dari data contoh.
    }
    setReady(true);
  }, [video]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key(video.id), JSON.stringify(state));
    } catch {
      // Penyimpanan perangkat tidak tersedia; progres hanya bertahan selama halaman terbuka.
    }
  }, [state, ready, video.id]);

  const update = (patch: Partial<VideoState>) => setState((s) => ({ ...s, ...patch }));
  const reset = () => {
    try { localStorage.removeItem(key(video.id)); } catch { /* abaikan */ }
    setState(initial(video));
  };

  return { state, update, reset, ready };
}
