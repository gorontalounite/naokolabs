// Lapisan 4 — system prompt per video referensi (arahan tampilan terukur dari analisis frame).
// Dipakai bila pelanggan memilih video referensi sebagai acuan. Isi dibuat dari analisis frame video referensi.
import { REFERENCE_DIRECTIONS } from "./reference-directions";

export function examplePrompt(id: string | undefined) {
  return id ? REFERENCE_DIRECTIONS[id] : undefined;
}
