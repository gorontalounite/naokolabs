"use client";

import type { Brief } from "@/lib/ai/schema";
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

// ---------------------------------------------------------------------------
// Video yang dibuat dari Studio (belum ada database): metadata + daftar disimpan di browser.

export type LocalVideoMeta = SampleVideo & {
  local: true;
  plannerMode: "contoh" | "ai";
  concept: string;
  hook: string;
  hashtags: string[];
  missingInputs: string[];
  warnings: string[];
  idea?: string;
  exampleTitle?: string;
  brief?: Brief;
  durationReason?: string;
};

const META_PREFIX = "naokolabs:video-meta:";
const INDEX_KEY = "naokolabs:videos";

export function saveLocalVideo(meta: LocalVideoMeta) {
  localStorage.setItem(META_PREFIX + meta.id, JSON.stringify(meta));
  const ids: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
  localStorage.setItem(INDEX_KEY, JSON.stringify([meta.id, ...ids.filter((x) => x !== meta.id)].slice(0, 100)));
}

export function loadLocalVideo(id: string): LocalVideoMeta | null {
  try {
    const raw = localStorage.getItem(META_PREFIX + id);
    return raw ? (JSON.parse(raw) as LocalVideoMeta) : null;
  } catch {
    return null;
  }
}

export function listLocalVideos(): LocalVideoMeta[] {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
    return ids.map(loadLocalVideo).filter((v): v is LocalVideoMeta => !!v).map((v) => {
      // Status terkini ada di state video (bisa sudah disetujui/diproduksi).
      const state = localStorage.getItem(key(v.id));
      return state ? { ...v, status: (JSON.parse(state) as VideoState).status } : v;
    });
  } catch {
    return [];
  }
}
