import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { BUCKET, footageOwner } from "@/lib/footage-server";
import { createAdminClient, footageStorageEnabled } from "@/lib/supabase/admin";

// URL baca bertanda tangan untuk footage milik pemanggil (pratinjau di dashboard). Berlaku 6 jam.
const Body = z.object({ paths: z.array(z.string().max(300)).min(1).max(15) });

export async function POST(request: NextRequest) {
  if (!footageStorageEnabled()) return NextResponse.json({ urls: {} });
  const owner = await footageOwner();
  if (!owner) return NextResponse.json({ error: "Masuk dulu." }, { status: 401 });
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Daftar jalur tidak valid." }, { status: 400 });

  // Hanya jalur di folder pemanggil; tolak traversal.
  const allowed = parsed.data.paths.filter((p) => p.startsWith(`${owner}/`) && !p.includes(".."));
  if (allowed.length === 0) return NextResponse.json({ urls: {} });
  const { data, error } = await createAdminClient().storage.from(BUCKET).createSignedUrls(allowed, 6 * 3600);
  if (error) return NextResponse.json({ error: "Tidak bisa membaca footage." }, { status: 502 });
  const urls: Record<string, string> = {};
  for (const item of data ?? []) if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
  return NextResponse.json({ urls });
}
