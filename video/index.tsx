// Titik masuk Remotion untuk render (worker/GitHub Actions). Pratinjau di browser tidak memakai file ini.
import { loadFont } from "@remotion/fonts";
import { Composition, registerRoot, staticFile } from "remotion";
import { NaokoVideo } from "./Composition";
import { FPS, HEIGHT, WIDTH, specFrames, type VideoSpec } from "./spec";

// SF Pro tidak boleh didistribusikan dan tidak ada di server Linux; Inter adalah pengganti terdekat berlisensi terbuka.
loadFont({ family: "Inter", url: staticFile("inter.woff2"), weight: "100 900" });

const empty: VideoSpec = {
  style: "motion-graphic",
  title: "",
  brand: { name: "", handle: "", tagline: "", accent: "#C43A24", ink: "#171513" },
  scenes: [{ id: "s1", frames: FPS, lines: [], narration: "" }],
};

registerRoot(() => (
  <Composition
    id="NaokoVideo"
    component={NaokoVideo}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={FPS}
    defaultProps={{ spec: empty }}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.max(specFrames(props.spec), 1) })}
  />
));
