// Data contoh untuk wireframe dashboard. Bukan data pelanggan, bukan hasil produksi.
// Ganti dengan data dari database setelah login dan workspace tersedia (BUILD-PLAN tahap 3).

export type ContentKind = "video" | "carousel";

export type ContentItem = {
  id: string;
  title: string;
  kind: ContentKind;
  brand: string;
  planVersion: number;
  outputVersion: number | null;
  stage: string;
  action: { label: string; href: string };
};

export type Scene = {
  id: string;
  duration: string;
  screenText: string;
  narration: string;
  asset: string;
  crop: string;
  motion: string;
};

export type Slide = {
  id: string;
  role: string;
  heading: string;
  body: string;
};

export const sampleBrand = "Ruang Sela (brand fiktif)";

export const contentItems: ContentItem[] = [
  {
    id: "ruang-sela-promo",
    title: "Promo pembukaan Ruang Sela",
    kind: "video",
    brand: sampleBrand,
    planVersion: 2,
    outputVersion: 1,
    stage: "Menunggu persetujuan rencana",
    action: { label: "Tinjau rencana", href: "/app/rencana/ruang-sela-promo" },
  },
  {
    id: "ruang-sela-menu",
    title: "Menu musiman Ruang Sela",
    kind: "video",
    brand: sampleBrand,
    planVersion: 1,
    outputVersion: null,
    stage: "Sedang menyusun storyboard",
    action: { label: "Lihat detail", href: "/app/rencana/ruang-sela-menu" },
  },
  {
    id: "ruang-sela-tips",
    title: "5 tips menyeduh kopi di rumah",
    kind: "carousel",
    brand: sampleBrand,
    planVersion: 1,
    outputVersion: 1,
    stage: "Perlu melengkapi aset",
    action: { label: "Lengkapi aset", href: "/app/buat" },
  },
];

export const pendingApproval = contentItems[0];
export const activeOrders = contentItems.slice(1);

export const nextSchedule = {
  title: "Promo pembukaan Ruang Sela",
  account: "@ruangsela.contoh",
  platform: "Instagram",
  date: "Jumat, 16 Oktober 2026",
  time: "19.00 WITA",
};

export const scenes: Scene[] = [
  {
    id: "s1",
    duration: "± 5 detik",
    screenText: "Ruang Sela kini buka di Gorontalo",
    narration: "Cari tempat untuk berhenti sejenak? Ruang Sela kini buka di Gorontalo.",
    asset: "foto-fasad.jpg",
    crop: "9:16",
    motion: "Teks masuk dari bawah · zoom pelan · potong ke scene 2",
  },
  {
    id: "s2",
    duration: "± 6 detik",
    screenText: "Kopi lokal, diseduh pelan",
    narration: "Kami menyeduh kopi lokal dengan pelan, supaya setiap cangkir terasa.",
    asset: "video-seduh.mp4",
    crop: "9:16",
    motion: "Footage klien · teks muncul per kata · transisi geser",
  },
  {
    id: "s3",
    duration: "± 5 detik",
    screenText: "Diskon 20% minggu pertama",
    narration: "Selama minggu pertama, semua minuman diskon dua puluh persen.",
    asset: "Placeholder · grafik promo",
    crop: "9:16",
    motion: "Angka membesar · latar warna brand · keluar memudar",
  },
  {
    id: "s4",
    duration: "± 4 detik",
    screenText: "Jl. Contoh No. 12 · Buka 08.00–22.00",
    narration: "Datang ke Jalan Contoh nomor dua belas. Kami tunggu.",
    asset: "logo-ruang-sela.png",
    crop: "9:16",
    motion: "Logo masuk · alamat mengetik · tahan sampai akhir",
  },
];

export const strategy = {
  goal: "Mengenalkan pembukaan kedai dan mendorong kunjungan minggu pertama.",
  audience: "Mahasiswa dan pekerja muda di sekitar kampus.",
  message: "Ruang Sela adalah tempat berhenti sejenak dengan kopi lokal yang diseduh pelan.",
  cta: "Datang dan klaim diskon 20% minggu pertama.",
};

export const caption =
  "Ruang Sela resmi buka! ☕ Tempat berhenti sejenak dengan kopi lokal yang diseduh pelan. Diskon 20% untuk semua minuman selama minggu pertama. Jl. Contoh No. 12, buka 08.00–22.00. #RuangSela #KopiGorontalo";

export const slides: Slide[] = [
  { id: "k1", role: "Hook", heading: "Kopi enak tidak harus ribet", body: "5 tips menyeduh kopi di rumah." },
  { id: "k2", role: "Pesan", heading: "1. Pakai biji segar", body: "Pilih biji yang disangrai kurang dari sebulan." },
  { id: "k3", role: "Pesan", heading: "2. Giling sebelum seduh", body: "Aroma paling kuat sesaat setelah digiling." },
  { id: "k4", role: "Pesan", heading: "3. Takar dengan timbangan", body: "Mulai dari rasio 1:15 lalu sesuaikan." },
  { id: "k5", role: "Pesan", heading: "4. Air 90–96°C", body: "Diamkan air mendidih sekitar 30 detik." },
  { id: "k6", role: "Pesan", heading: "5. Seduh pelan", body: "Tuang bertahap agar ekstraksi merata." },
  { id: "k7", role: "Ringkasan", heading: "Segar · giling · takar · suhu · pelan", body: "Simpan untuk dicoba nanti." },
  { id: "k8", role: "CTA", heading: "Mampir ke Ruang Sela", body: "Coba seduhan kami, lalu bandingkan." },
];

export const connectedAccounts = [
  { id: "ig", label: "@ruangsela.contoh · Instagram" },
  { id: "tt", label: "@ruangsela.contoh · TikTok" },
];

export const timezones = [
  { id: "Asia/Makassar", label: "WITA · Asia/Makassar (UTC+8)" },
  { id: "Asia/Jakarta", label: "WIB · Asia/Jakarta (UTC+7)" },
  { id: "Asia/Jayapura", label: "WIT · Asia/Jayapura (UTC+9)" },
];

export function findItem(id: string) {
  return contentItems.find((item) => item.id === id);
}
