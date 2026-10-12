// Lapisan 3 — system prompt lengkap per gaya video. MVP hanya dua gaya (D-22).
// Isinya masih draf; ditulis ulang dari analisis video referensi Katalog Gaya.
import { EXPLAINER } from "./explainer";
import { MOTION_GRAPHIC } from "./motion-graphic";

export const STYLE_PROMPTS: Record<string, string> = {
  "motion-graphic": MOTION_GRAPHIC,
  explainer: EXPLAINER,
};

export function stylePrompt(styleId: string) {
  return STYLE_PROMPTS[styleId] ?? STYLE_PROMPTS["motion-graphic"];
}
