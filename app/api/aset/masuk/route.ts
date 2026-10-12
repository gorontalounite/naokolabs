import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { BUCKET, FOOTAGE_LIMITS, MAX_FOOTAGE_FILES, footageOwner, kindOfMime, safeName } from "@/lib/footage-server";
import { createAdminClient, footageStorageEnabled } from "@/lib/supabase/admin";

// Langkah 1 unggahan footage: validasi lalu beri URL unggah bertanda tangan (satu per berkas).
const Body = z.object({
  files: z.array(z.object({ name: z.string().max(200), size: z.number().int().positive(), type: z.string().max(100) })).min(1).max(MAX_FOOTAGE_FILES),
});

export async function POST(request: NextRequest) {
  if (!footageStorageEnabled()) return NextResponse.json({ error: "Penyimpanan footage belum aktif.", disabled: true }, { status: 503 });
  const owner = await footageOwner();
  if (!owner) return NextResponse.json({ error: "Masuk dulu untuk mengunggah footage." }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Daftar berkas tidak valid." }, { status: 400 });

  for (const f of parsed.data.files) {
    const kind = kindOfMime(f.type);
    if (!kind) return NextResponse.json({ error: `Jenis berkas ${f.name} tidak didukung. Gunakan PNG, JPG, WebP, MP4, MOV, WebM, MP3, M4A, atau WAV.` }, { status: 415 });
    if (f.size > FOOTAGE_LIMITS[kind]) return NextResponse.json({ error: `${f.name} melebihi batas ${FOOTAGE_LIMITS[kind] / 1024 / 1024} MB untuk ${kind}.` }, { status: 413 });
  }

  const admin = createAdminClient();
  const batch = randomUUID().slice(0, 8);
  const out: { name: string; path: string; token: string; kind: "gambar" | "video" | "audio" }[] = [];
  for (const f of parsed.data.files) {
    const path = `${owner}/${batch}/${randomUUID().slice(0, 6)}-${safeName(f.name)}`;
    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("footage_sign_error", error?.message);
      return NextResponse.json({ error: "Tidak bisa menyiapkan unggahan. Coba lagi." }, { status: 502 });
    }
    out.push({ name: f.name, path, token: data.token, kind: kindOfMime(f.type) });
  }
  return NextResponse.json({ files: out });
}
