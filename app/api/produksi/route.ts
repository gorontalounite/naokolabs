import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { footageOwner } from "@/lib/footage-server";
import { dispatchRender, githubEnabled, setStatus, writeJson } from "@/lib/produksi-server";
import { footageStorageEnabled } from "@/lib/supabase/admin";
import { FPS, specFrames, type VideoSpec } from "@/video/spec";

// Mulai produksi: simpan pekerjaan, picu workflow render di GitHub Actions. Hasil dipantau lewat /api/produksi/[id].
export const maxDuration = 30;

const Path = z.string().max(300).refine((p) => !p.includes(".."), "jalur tidak valid");
const Scene = z.object({
  id: z.string().max(40),
  frames: z.number().int().min(FPS).max(60 * FPS),
  lines: z.array(z.string().max(200)).max(2),
  narration: z.string().max(1000),
  icon: z.string().max(40).optional(),
  media: z.object({ path: Path, kind: z.enum(["gambar", "video"]) }).optional(),
});
const Spec = z.object({
  style: z.enum(["motion-graphic", "explainer"]),
  title: z.string().max(200),
  brand: z.object({ name: z.string().max(120), handle: z.string().max(60), tagline: z.string().max(200), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), ink: z.string().regex(/^#[0-9a-fA-F]{6}$/) }),
  audio: z
    .object({
      voice: z.union([z.object({ mode: z.literal("ai"), kind: z.enum(["pria", "wanita"]), style: z.enum(["hangat", "tegas", "ramah", "energik"]) }), z.object({ mode: z.literal("track"), src: z.string().max(0), path: Path })]).optional(),
      music: z.object({ src: z.string().max(0), path: Path }).optional(),
    })
    .optional(),
  scenes: z.array(Scene).min(1).max(40),
});

export async function POST(request: NextRequest) {
  if (!footageStorageEnabled() || !githubEnabled()) return NextResponse.json({ error: "Produksi belum aktif di server ini.", disabled: true }, { status: 503 });
  const owner = await footageOwner();
  if (!owner) return NextResponse.json({ error: "Masuk dulu untuk memproduksi video." }, { status: 401 });

  const parsed = Spec.safeParse((await request.json().catch(() => null))?.spec);
  if (!parsed.success) return NextResponse.json({ error: "Spesifikasi video tidak valid." }, { status: 400 });
  const spec = parsed.data as VideoSpec;
  if (specFrames(spec) > 65 * FPS) return NextResponse.json({ error: "Durasi melebihi 65 detik." }, { status: 400 });

  // Berkas harus berada di folder pemilik.
  const paths = [...spec.scenes.flatMap((s) => (s.media?.path ? [s.media.path] : [])), ...(spec.audio?.voice?.mode === "track" && spec.audio.voice.path ? [spec.audio.voice.path] : []), ...(spec.audio?.music?.path ? [spec.audio.music.path] : [])];
  if (paths.some((p) => !p.startsWith(`${owner}/`))) return NextResponse.json({ error: "Berkas tidak dikenali." }, { status: 403 });

  const jobId = randomUUID().slice(0, 12);
  try {
    await writeJson(`jobs/${jobId}.json`, { owner, spec });
    await setStatus(jobId, { state: "antre", message: "Menunggu worker", owner });
    await dispatchRender(jobId);
  } catch (e) {
    console.error("produksi_error", e instanceof Error ? e.message : e);
    await setStatus(jobId, { state: "gagal", message: "Worker tidak bisa dijalankan", owner }).catch(() => {});
    return NextResponse.json({ error: "Tidak bisa memulai produksi. Coba lagi sebentar lagi." }, { status: 502 });
  }
  return NextResponse.json({ jobId });
}
