// Tanggal hari ini menurut WITA (zona default UI, docs/PRD.md FR-07), terlepas dari zona server.
export function todayWita() {
  const [y, m, d] = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" }).split("-").map(Number);
  return new Date(y, m - 1, d);
}
