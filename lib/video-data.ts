// Data katalog dan contoh untuk dashboard video.
// Gaya, durasi dan batas mengikuti docs/FULLSET-SPEC.md dan docs/REFERENCE-LIBRARY.md.
// Video contoh (sampleVideos) fiktif; diganti data database pada tahap 4.

export const tones = [
  { id: "edukasi", label: "Edukasi & Wawasan", desc: "Penjelasan runtut dan jelas" },
  { id: "promosi", label: "Promosi & Jualan", desc: "Sorot keunggulan, ajakan beli" },
  { id: "hook", label: "Hook Viral", desc: "Pembuka memancing rasa ingin tahu" },
  { id: "santai", label: "Santai & Akrab", desc: "Bahasa sehari-hari yang mengalir" },
  { id: "formal", label: "Formal & Resmi", desc: "Untuk instansi dan layanan publik" },
] as const;

export type StyleTier = "standar" | "quote";

export type VideoStyle = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  needs: string;
  tier: StyleTier;
};

// MVP hanya dua gaya (D-22).
export const videoStyles: VideoStyle[] = [
  {
    id: "motion-graphic",
    name: "Motion Graphic",
    tagline: "Teks bergerak, bentuk & ikon",
    description: "Tipografi dan bentuk yang bergerak mengikuti narasi. Rapi, cepat, cocok untuk pesan singkat.",
    bestFor: "Promo, pengumuman, tips singkat",
    needs: "Logo dan warna brand",
    tier: "standar",
  },
  {
    id: "explainer",
    name: "Explainer",
    tagline: "Masalah → cara kerja → manfaat",
    description: "Diagram langkah demi langkah yang menjelaskan produk atau proses dengan runtut.",
    bestFor: "Edukasi produk, layanan, cara pakai",
    needs: "Poin yang ingin dijelaskan",
    tier: "standar",
  },
];

export const voices = [
  { id: "pria-hangat", label: "Pria · hangat" },
  { id: "pria-tegas", label: "Pria · tegas" },
  { id: "wanita-ramah", label: "Wanita · ramah" },
  { id: "wanita-energik", label: "Wanita · energik" },
];

export type VideoStatus = "rencana" | "produksi" | "hasil" | "perbaikan" | "siap";

export const statusInfo: Record<VideoStatus, { label: string; step: number; action: string | null }> = {
  rencana: { label: "Menunggu persetujuan storyboard", step: 1, action: "Tinjau rencana" },
  produksi: { label: "Sedang diproduksi", step: 2, action: null },
  hasil: { label: "Menunggu persetujuan hasil", step: 3, action: "Tinjau hasil" },
  perbaikan: { label: "Perbaikan sedang dikerjakan", step: 3, action: null },
  siap: { label: "Video siap diunduh", step: 4, action: "Unduh" },
};

export const videoSteps = ["Rencana", "Produksi", "Hasil", "Unduh"] as const;

export type Scene = {
  id: string;
  seconds: number;
  screenText: string;
  narration: string;
  visual: string;
  asset: { label: string; placeholder: boolean };
  purpose?: string;
  motion?: string;
  sound?: string;
  icon?: string;
};

export type SampleVideo = {
  id: string;
  title: string;
  brand: string;
  styleId: string;
  duration: number;
  tone: string;
  status: VideoStatus;
  planVersion: number;
  createdAt: string;
  scenes: Scene[];
  caption: string;
};

const promoScenes: Scene[] = [
  { id: "s1", seconds: 5, screenText: "Ruang Sela kini buka di Gorontalo", narration: "Cari tempat untuk berhenti sejenak? Ruang Sela kini buka di Gorontalo.", visual: "Judul besar masuk dari bawah di atas foto fasad", asset: { label: "foto-fasad.jpg", placeholder: false } },
  { id: "s2", seconds: 7, screenText: "Kopi lokal, diseduh pelan", narration: "Kami menyeduh kopi lokal dengan pelan, supaya setiap cangkir terasa.", visual: "Footage menyeduh, teks muncul per kata", asset: { label: "video-seduh.mp4", placeholder: false } },
  { id: "s3", seconds: 6, screenText: "Diskon 20% minggu pertama", narration: "Selama minggu pertama, semua minuman diskon dua puluh persen.", visual: "Angka 20% membesar di latar warna brand", asset: { label: "Grafik promo", placeholder: true } },
  { id: "s4", seconds: 6, screenText: "Jl. Contoh No. 12 · 08.00–22.00", narration: "Datang ke Jalan Contoh nomor dua belas. Kami tunggu.", visual: "Logo masuk, alamat muncul seperti diketik", asset: { label: "logo-ruang-sela.png", placeholder: false } },
];

export const sampleVideos: SampleVideo[] = [
  {
    id: "promo-ruang-sela",
    title: "Promo pembukaan Ruang Sela",
    brand: "Ruang Sela",
    styleId: "motion-graphic",
    duration: 30,
    tone: "promosi",
    status: "rencana",
    planVersion: 2,
    createdAt: "2026-10-12",
    scenes: promoScenes,
    caption:
      "Ruang Sela resmi buka! ☕ Tempat berhenti sejenak dengan kopi lokal yang diseduh pelan. Diskon 20% semua minuman selama minggu pertama. Jl. Contoh No. 12, buka 08.00–22.00. #RuangSela #KopiGorontalo",
  },
  {
    id: "cara-seduh",
    title: "3 langkah menyeduh kopi di rumah",
    brand: "Ruang Sela",
    styleId: "explainer",
    duration: 30,
    tone: "edukasi",
    status: "produksi",
    planVersion: 1,
    createdAt: "2026-10-11",
    scenes: promoScenes.slice(0, 3),
    caption: "Kopi enak di rumah itu gampang. Simpan video ini dan coba besok pagi! #TipsKopi",
  },
  {
    id: "menu-musiman",
    title: "Menu musiman: es kopi aren",
    brand: "Ruang Sela",
    styleId: "motion-graphic",
    duration: 15,
    tone: "santai",
    status: "hasil",
    planVersion: 1,
    createdAt: "2026-10-10",
    scenes: promoScenes.slice(1, 3),
    caption: "Menu baru buat nemenin sore kamu: es kopi aren. Udah coba? #RuangSela",
  },
  {
    id: "hari-santri",
    title: "Ucapan Hari Santri",
    brand: "Ruang Sela",
    styleId: "explainer",
    duration: 15,
    tone: "formal",
    status: "siap",
    planVersion: 1,
    createdAt: "2026-10-09",
    scenes: promoScenes.slice(0, 2),
    caption: "Selamat Hari Santri Nasional 2026. #HariSantri",
  },
];

// Kecepatan baca narasi Bahasa Indonesia untuk perkiraan durasi (kata per detik).
// Perkiraan saja; durasi final diukur dari audio (docs/STORYBOARD-PREVIEW.md).
export const WORDS_PER_SECOND = 2.3;

// Durasi ditentukan dari isi ide (D-18), dalam batas ini.
export const MIN_VIDEO_SECONDS = 10;
export const MAX_VIDEO_SECONDS = 60;

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function readingSeconds(text: string) {
  return Math.ceil(countWords(text) / WORDS_PER_SECOND);
}

export type RevisionKind = "media" | "typo" | "pengucapan";

export const revisionKinds: { id: RevisionKind; label: string; hint: string }[] = [
  { id: "media", label: "Gambar/video salah tempat", hint: "Visual tidak sesuai adegan, terpotong, atau tertukar" },
  { id: "typo", label: "Typo / teks salah", hint: "Ejaan, angka, harga, alamat, atau nama yang salah di layar" },
  { id: "pengucapan", label: "Pengucapan keliru", hint: "Narasi salah membaca nama, singkatan, atau angka" },
];

export type RevisionItem = {
  id: string;
  sceneId: string;
  kind: RevisionKind;
  wrong: string;
  expected: string;
  replacementFile?: string;
};

export function findVideo(id: string) {
  return sampleVideos.find((video) => video.id === id);
}

export function findStyle(id: string) {
  return videoStyles.find((style) => style.id === id);
}
