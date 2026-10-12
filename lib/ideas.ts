// Contoh ide konten per kategori (bukan berita). Feed berita & tren harian belum tersambung.
export const ideaCategories = ["Semua", "UMKM & Bisnis", "Kuliner", "Fashion & Kecantikan", "Pendidikan", "Properti", "Instansi & Layanan Publik"] as const;

export type Idea = { category: (typeof ideaCategories)[number]; title: string; angle: string };

export const ideas: Idea[] = [
  { category: "UMKM & Bisnis", title: "Di balik layar produksi", angle: "Tunjukkan proses pembuatan produk dalam 30 detik" },
  { category: "UMKM & Bisnis", title: "3 pertanyaan yang paling sering ditanya", angle: "Jawab FAQ pelanggan dengan singkat" },
  { category: "Kuliner", title: "Menu andalan dalam 15 detik", angle: "Close-up proses masak dan harga" },
  { category: "Kuliner", title: "Cara menikmati menu yang benar", angle: "Tips penyajian supaya rasa maksimal" },
  { category: "Fashion & Kecantikan", title: "Satu produk, tiga gaya", angle: "Padu padan untuk acara berbeda" },
  { category: "Fashion & Kecantikan", title: "Mitos vs fakta perawatan", angle: "Luruskan anggapan yang keliru" },
  { category: "Pendidikan", title: "Kenalan dengan pengajar", angle: "Perkenalan singkat dan keahlian" },
  { category: "Pendidikan", title: "Tips belajar 5 menit", angle: "Satu teknik belajar yang bisa langsung dicoba" },
  { category: "Properti", title: "Tur unit dalam 30 detik", angle: "Sorot 3 keunggulan utama" },
  { category: "Properti", title: "Biaya yang sering terlupa", angle: "Edukasi calon pembeli soal biaya tambahan" },
  { category: "Instansi & Layanan Publik", title: "Cara mengurus layanan", angle: "Langkah singkat dan syarat dokumen" },
  { category: "Instansi & Layanan Publik", title: "Jadwal dan lokasi layanan", angle: "Informasi praktis untuk warga" },
];
