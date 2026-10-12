// Sisi worker untuk pekerjaan produksi (dipanggil workflow GitHub Actions). Memakai service role dari secret Actions.
//   tsx scripts/job.ts get <id> <spec.json>    ambil pekerjaan, ubah jalur berkas jadi URL bertanda tangan
//   tsx scripts/job.ts status <id> <state> [pesan] [progres]
//   tsx scripts/job.ts finish <id> <hasil.mp4>  unggah MP4 dan tandai selesai
import { readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import type { VideoSpec } from "../video/spec";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur");
  process.exit(2);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });
const jobs = supabase.storage.from("produksi");
const footage = supabase.storage.from("footage");

async function sign(path: string) {
  const { data, error } = await footage.createSignedUrl(path, 2 * 3600);
  if (error || !data) throw new Error(`Berkas tidak bisa dibaca: ${path}`);
  return data.signedUrl;
}

async function readOwner(id: string) {
  const { data } = await jobs.download(`status/${id}.json`);
  return data ? (JSON.parse(await data.text()) as { owner: string }).owner : "";
}

async function setStatus(id: string, state: string, message?: string, progress?: number, result?: string) {
  const owner = await readOwner(id);
  const body = new Blob([JSON.stringify({ state, message, progress, owner, result, updatedAt: new Date().toISOString() })], { type: "application/json" });
  const { error } = await jobs.upload(`status/${id}.json`, body, { upsert: true, contentType: "application/json" });
  if (error) throw new Error(`Status gagal ditulis: ${error.message}`);
}

async function main() {
  const [cmd, id, a, b, c] = process.argv.slice(2);
  if (!id || !/^[a-f0-9-]{8,16}$/.test(id)) throw new Error("ID pekerjaan tidak valid");

  if (cmd === "get") {
    const { data, error } = await jobs.download(`jobs/${id}.json`);
    if (error || !data) throw new Error("Pekerjaan tidak ditemukan");
    const { spec } = JSON.parse(await data.text()) as { spec: VideoSpec };
    for (const scene of spec.scenes) if (scene.media?.path) scene.media = { kind: scene.media.kind, url: await sign(scene.media.path) };
    const v = spec.audio?.voice;
    if (v?.mode === "track" && v.path) spec.audio = { ...spec.audio, voice: { mode: "track", src: await sign(v.path) } };
    if (spec.audio?.music?.path) spec.audio = { ...spec.audio, music: { src: await sign(spec.audio.music.path) } };
    writeFileSync(a, JSON.stringify(spec));
    await setStatus(id, "menyiapkan", "Menyiapkan suara dan footage");
  } else if (cmd === "status") {
    await setStatus(id, a, b, c ? Number(c) : undefined);
  } else if (cmd === "finish") {
    await setStatus(id, "mengunggah", "Mengunggah hasil");
    const { error } = await jobs.upload(`hasil/${id}.mp4`, readFileSync(a), { upsert: true, contentType: "video/mp4" });
    if (error) throw new Error(`Unggah hasil gagal: ${error.message}`);
    await setStatus(id, "selesai", "Video siap", 100, `hasil/${id}.mp4`);
  } else {
    throw new Error("Perintah: get | status | finish");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
