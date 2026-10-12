"use client";

import { Player } from "@remotion/player";
import { NaokoVideo } from "@/video/Composition";
import { FPS, HEIGHT, WIDTH, specFrames, type VideoSpec } from "@/video/spec";

// Pratinjau komposisi Remotion di browser: tanpa suara, memakai storyboard yang sedang tampil.
export function VideoPreview({ spec }: { spec: VideoSpec }) {
  const frames = specFrames(spec);
  return (
    <section className="panel stack-s" aria-labelledby="pratinjau-title">
      <div className="section-head">
        <h2 id="pratinjau-title" className="section-title">Pratinjau video</h2>
        <span className="badge">{Math.round(frames / FPS)} detik · tanpa suara</span>
      </div>
      <div className="preview-frame">
        <Player
          component={NaokoVideo}
          inputProps={{ spec }}
          durationInFrames={Math.max(frames, 1)}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          controls
          initialFrame={Math.min(24, Math.max(frames - 1, 0))}
          loop
          clickToPlay
          style={{ width: "100%", aspectRatio: "9 / 16" }}
          acknowledgeRemotionLicense
        />
      </div>
      <p className="hint">Pratinjau dari storyboard. Suara dan footage ditambahkan saat produksi.</p>
    </section>
  );
}
