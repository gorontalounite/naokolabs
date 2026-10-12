// Video referensi Katalog Gaya (D-22). Sebagian besar karya pihak lain: hanya dipakai sebagai acuan
// gaya untuk pengguna yang sudah login. Video dan thumbnail tidak disimpan di repo ini; thumbnail
// diambil langsung dari Google Drive pemilik katalog.
// Data dibuat dari analisis frame video referensi; jangan edit references-data.ts manual.
import { referenceData } from "./references-data";

export type Reference = {
  id: string; // ID file Google Drive
  file: string;
  style: "motion-graphic" | "explainer";
  title: string;
  prompt: string;
  duration: number;
  aspect: string;
};

export const references: Reference[] = referenceData;

export function findReference(id: string | undefined) {
  return id ? references.find((r) => r.id === id) : undefined;
}

export function referenceThumbnail(id: string, width = 480) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${width}`;
}
