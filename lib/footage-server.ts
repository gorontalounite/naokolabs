import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { getViewer } from "@/lib/workspace";

export const BUCKET = "footage";
export const FOOTAGE_LIMITS = { gambar: 10 * 1024 * 1024, video: 50 * 1024 * 1024 } as const;
export const MAX_FOOTAGE_FILES = 15;
const MIME: Record<string, "gambar" | "video"> = {
  "image/png": "gambar", "image/jpeg": "gambar", "image/webp": "gambar",
  "video/mp4": "video", "video/quicktime": "video", "video/webm": "video",
};

export const kindOfMime = (mime: string) => MIME[mime];

/** Pemilik folder: ID pengguna, atau "preview" selama login belum diaktifkan (AUTH_REQUIRED=false). */
export async function footageOwner(): Promise<string | null> {
  const viewer = await getViewer();
  if (!viewer) return null;
  if (viewer.mode === "signed-in" && isSupabaseConfigured) {
    const user = await getCurrentUser();
    return user?.id ?? null;
  }
  return "preview";
}

export function safeName(name: string) {
  const base = name.normalize("NFKD").replace(/[^\w.\- ]+/g, "").trim().replace(/\s+/g, "-").slice(-80) || "berkas";
  return base;
}
