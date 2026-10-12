import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { videoStyles, type StyleTier, type VideoStyle } from "@/lib/video-data";

type StyleRow = { id: string; name: string; tagline: string; description: string; best_for: string; needs: string; tier: StyleTier };

// Katalog gaya dibaca dari tabel video_styles (metadata, bisa diubah tanpa deploy).
// Selama tabel belum ada atau Supabase tidak terjangkau, pakai daftar bawaan.
export async function getVideoStyles(): Promise<VideoStyle[]> {
  if (!isSupabaseConfigured) return videoStyles;
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("video_styles")
      .select("id,name,tagline,description,best_for,needs,tier")
      .eq("active", true)
      .order("sort_order")
      .abortSignal(AbortSignal.timeout(3000));
    if (error || !data?.length) return videoStyles;
    const allowed = new Set(videoStyles.map((v) => v.id));
    return (data as StyleRow[]).filter((r) => allowed.has(r.id)).map((r) => ({ id: r.id, name: r.name, tagline: r.tagline, description: r.description, bestFor: r.best_for, needs: r.needs, tier: r.tier }));
  } catch {
    return videoStyles;
  }
}
