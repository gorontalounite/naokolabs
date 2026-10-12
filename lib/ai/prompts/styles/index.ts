// Lapisan 3 — system prompt lengkap per gaya video. Satu gaya = satu prompt (D-20).
// Nanti bisa dipindah ke video_styles.profile (versi di database); teks di sini menjadi isi awal.
import { CINEMATIC_AI } from "./cinematic-ai";
import { EXPLAINER } from "./explainer";
import { ILUSTRASI_2D } from "./ilustrasi-2d";
import { MOTION_GRAPHIC } from "./motion-graphic";
import { PRESENTER_AI } from "./presenter-ai";
import { STOCK_CINEMATIC } from "./stock-cinematic";
import { UGC_EDIT } from "./ugc-edit";
import { WHITEBOARD } from "./whiteboard";

export const STYLE_PROMPTS: Record<string, string> = {
  "motion-graphic": MOTION_GRAPHIC,
  explainer: EXPLAINER,
  whiteboard: WHITEBOARD,
  "ugc-edit": UGC_EDIT,
  "stock-cinematic": STOCK_CINEMATIC,
  "ilustrasi-2d": ILUSTRASI_2D,
  "presenter-ai": PRESENTER_AI,
  "cinematic-ai": CINEMATIC_AI,
};

export function stylePrompt(styleId: string) {
  return STYLE_PROMPTS[styleId] ?? STYLE_PROMPTS["motion-graphic"];
}
