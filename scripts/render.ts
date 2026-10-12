// Render satu video: npx tsx scripts/render.ts <spec.json> <hasil.mp4>
// Dijalankan oleh workflow GitHub Actions (.github/workflows/render.yml) dan bisa dijalankan lokal.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";
import type { VideoSpec } from "../video/spec";
import { specFrames, FPS } from "../video/spec";
import { prepareAudio } from "./audio";

const [specPath, outPath] = process.argv.slice(2);
if (!specPath || !outPath) {
  console.error("Pakai: tsx scripts/render.ts <spec.json> <hasil.mp4>");
  process.exit(2);
}


async function main() {
  const raw = JSON.parse(readFileSync(specPath, "utf8")) as VideoSpec;
  if (!Array.isArray(raw.scenes) || raw.scenes.length === 0) throw new Error("Spesifikasi tanpa adegan");
  const spec = await prepareAudio(raw);
  const frames = specFrames(spec);
  if (frames > 65 * FPS) throw new Error(`Durasi ${frames / FPS} detik melebihi batas 65 detik`);
  const browserExecutable = process.env.REMOTION_BROWSER || undefined;
  if (!browserExecutable) await ensureBrowser();

  const started = Date.now();
  const serveUrl = await bundle({ entryPoint: path.resolve("video/index.tsx"), publicDir: path.resolve("video/public") });
  const inputProps = { spec };
  const composition = await selectComposition({ serveUrl, id: "NaokoVideo", inputProps, browserExecutable });
  let lastLog = 0;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 20,
    pixelFormat: "yuv420p",
    outputLocation: path.resolve(outPath),
    inputProps,
    browserExecutable,
    concurrency: Number(process.env.REMOTION_CONCURRENCY) || undefined,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct > lastLog) { lastLog = pct; console.log(`render ${pct}%`); }
    },
  });
  const size = statSync(outPath).size;
  console.log(JSON.stringify({ ok: true, frames, seconds: frames / FPS, bytes: size, renderSeconds: Math.round((Date.now() - started) / 1000) }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
