import { NextResponse, type NextRequest } from "next/server";
import { footageOwner } from "@/lib/footage-server";
import { isTerminal, JOB_BUCKET, readJson, runConclusion, setStatus, githubEnabled, type JobStatus } from "@/lib/produksi-server";
import { createAdminClient, footageStorageEnabled } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Status pekerjaan untuk pemiliknya; bila selesai, sertakan URL putar dan unduh (1 jam).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{8,16}$/.test(id) || !footageStorageEnabled()) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  const owner = await footageOwner();
  if (!owner) return NextResponse.json({ error: "Masuk dulu." }, { status: 401 });

  let status = await readJson<JobStatus>(`status/${id}.json`);
  if (!status || status.owner !== owner) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

  // Worker mati sebelum melapor: periksa run di GitHub setelah 3 menit tanpa kabar.
  if (!isTerminal(status.state) && githubEnabled() && Date.now() - Date.parse(status.updatedAt) > 3 * 60_000) {
    if ((await runConclusion(id)) === "gagal") {
      status = { ...status, state: "gagal", message: "Render berhenti. Coba lagi." };
      await setStatus(id, { state: status.state, message: status.message, owner }).catch(() => {});
    }
  }

  let playUrl: string | undefined;
  let downloadUrl: string | undefined;
  if (status.state === "selesai" && status.result) {
    const storage = createAdminClient().storage.from(JOB_BUCKET);
    const [play, dl] = await Promise.all([storage.createSignedUrl(status.result, 3600), storage.createSignedUrl(status.result, 3600, { download: "video-naokolabs.mp4" })]);
    playUrl = play.data?.signedUrl;
    downloadUrl = dl.data?.signedUrl;
  }
  return NextResponse.json({ state: status.state, message: status.message, progress: status.progress, playUrl, downloadUrl });
}
