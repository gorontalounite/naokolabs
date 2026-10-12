// Contoh video per gaya di Katalog Gaya (D-20). Data publik: aman dipakai di browser.
// System prompt tiap contoh ada di lib/ai/prompts/examples.ts (hanya server).
// Video contoh: taruh file di public/contoh/<id>.mp4 lalu isi `video` dengan "/contoh/<id>.mp4".

export type StyleExample = {
  id: string;
  styleId: string;
  title: string;
  /** Prompt pengguna yang menghasilkan contoh ini (ide singkat di Studio). */
  idea: string;
  tone: string;
  vo: boolean;
  music: boolean;
  /** Ringkasan tampilan untuk pengguna; detail lengkap di system prompt contoh. */
  look: string;
  video: string | null;
  poster: string | null;
};

export const styleExamples: StyleExample[] = [
  {
    id: "mg-kopi-aren",
    styleId: "motion-graphic",
    title: "Promo es kopi aren",
    idea: "Promo es kopi gula aren Ruang Sela, beli 2 gratis 1 setiap Jumat",
    tone: "promosi",
    vo: true,
    music: true,
    look: "Krem hangat, aksen terakota, huruf tebal besar, tempo cepat",
    video: null,
    poster: null,
  },
  {
    id: "ex-qris",
    styleId: "explainer",
    title: "Cara kerja pembayaran QRIS",
    idea: "Bagaimana pembayaran QRIS bekerja dari scan sampai uang masuk ke rekening penjual",
    tone: "edukasi",
    vo: true,
    music: true,
    look: "Putih bersih, diagram simpul dan panah, satu warna aksen biru",
    video: null,
    poster: null,
  },
  {
    id: "wb-simpan-kopi",
    styleId: "whiteboard",
    title: "3 cara menyimpan biji kopi",
    idea: "3 cara menyimpan biji kopi agar tetap segar di rumah",
    tone: "edukasi",
    vo: true,
    music: true,
    look: "Papan putih, garis hitam digambar, aksen cokelat kopi",
    video: null,
    poster: null,
  },
  {
    id: "ugc-review-sambal",
    styleId: "ugc-edit",
    title: "Review jujur sambal roa",
    idea: "Review pelanggan mencoba sambal roa kami pertama kali",
    tone: "santai",
    vo: false,
    music: true,
    look: "Rekaman ponsel asli, teks pelat putih, potongan cepat",
    video: null,
    poster: null,
  },
  {
    id: "sc-pagi-danau",
    styleId: "stock-cinematic",
    title: "Pagi di tepi danau",
    idea: "Ajak wisatawan menikmati pagi tenang di penginapan kami dekat Danau Limboto",
    tone: "santai",
    vo: true,
    music: true,
    look: "Cahaya pagi keemasan, gerak kamera pelan, teks tipis",
    video: null,
    poster: null,
  },
  {
    id: "il-laundry",
    styleId: "ilustrasi-2d",
    title: "Laundry antar-jemput",
    idea: "Ibu pekerja yang tidak sempat mencuci, terbantu layanan laundry antar-jemput kami",
    tone: "santai",
    vo: true,
    music: true,
    look: "Ilustrasi datar pastel, tokoh konsisten, aksen hijau",
    video: null,
    poster: null,
  },
  {
    id: "pa-klinik",
    styleId: "presenter-ai",
    title: "Layanan cek kesehatan klinik",
    idea: "Perkenalan paket cek kesehatan dasar di klinik kami dan cara daftarnya",
    tone: "formal",
    vo: true,
    music: true,
    look: "Presenter di ruang terang, grafis biru-putih yang rapi",
    video: null,
    poster: null,
  },
  {
    id: "ca-kain-karawo",
    styleId: "cinematic-ai",
    title: "Kain karawo",
    idea: "Kain karawo Gorontalo sebagai hadiah yang bercerita",
    tone: "hook",
    vo: true,
    music: true,
    look: "Cahaya sore sinematik, tekstur kain dekat, teks emas tipis",
    video: null,
    poster: null,
  },
];

export function examplesForStyle(styleId: string) {
  return styleExamples.filter((e) => e.styleId === styleId);
}

export function findExample(id: string | undefined) {
  return id ? styleExamples.find((e) => e.id === id) : undefined;
}
