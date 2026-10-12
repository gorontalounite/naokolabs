// Titik masuk Remotion untuk render (worker/GitHub Actions). Pratinjau di browser tidak memakai file ini.
import { loadFont } from "@remotion/fonts";
import { Composition, registerRoot, staticFile } from "remotion";
import { NaokoVideo } from "./Composition";
import { FPS, HEIGHT, WIDTH, specFrames, type VideoSpec } from "./spec";

loadFont({ family: "Manrope", url: staticFile("manrope.woff2"), weight: "200 800" });

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
