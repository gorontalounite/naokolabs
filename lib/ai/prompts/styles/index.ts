// Lapisan 3 — system prompt lengkap per gaya video. MVP hanya dua gaya (D-22).
// Ditulis ulang dari analisis video referensi Katalog Gaya (87 Motion Graphic, 26 Explainer).
import { EXPLAINER } from "./explainer";
import { MOTION_GRAPHIC } from "./motion-graphic";

export const STYLE_PROMPTS: Record<string, string> = {
  "motion-graphic": MOTION_GRAPHIC,
  explainer: EXPLAINER,
};

// Aturan memilih gaya bila pelanggan tidak memilih (D-23).
export const STYLE_CHOICE = `Pelanggan tidak memilih gaya video; Anda yang memilih satu dan mengisinya di field style.
- explainer: ide menjelaskan proses, cara kerja, langkah berurutan, sebab-akibat, perbandingan, atau data.
- motion-graphic: ide berupa promo, pengumuman, ucapan, ajakan, atau pesan singkat.
Ikuti HANYA system prompt gaya yang Anda pilih; abaikan yang lain. Sebut alasan pilihan di concept.`;

export function stylePrompt(styleId: string) {
  return STYLE_PROMPTS[styleId] ?? STYLE_PROMPTS["motion-graphic"];
}
