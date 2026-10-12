// Lapisan 3 — profil per gaya video. Satu profil dipilih sesuai pilihan pelanggan.
// Nanti dipindah ke tabel video_styles.profile (CMS) dengan versi; teks di sini menjadi isi awal.
export const STYLE_PROFILES: Record<string, string> = {
  "motion-graphic": `Gaya: MOTION GRAPHIC. Tipografi, bentuk, ikon, dan aset brand yang bergerak mengikuti narasi.
Pola cerita: Hook (0–15%) → Masalah atau keinginan penonton (15–35%) → Solusi/produk (35–70%) → Bukti atau detail penting (70–90%) → CTA (90–100%).
Visual: latar netral hangat, satu warna aksen dari brand kit, tipografi tebal untuk kata kunci, foto produk klien bila tersedia.
Gerak: teks muncul per kata atau per baris, angka membesar, bentuk menggeser untuk mengelompokkan informasi.`,
  explainer: `Gaya: EXPLAINER. Menjelaskan cara kerja atau proses dengan diagram langkah demi langkah.
Pola cerita: Pertanyaan (0–10%, buka dengan hal yang sering disalahpahami) → Model (10–35%, gambar paling sederhana tentang cara kerjanya, satu elemen per ketukan) → Bukti (35–75%, terapkan model pada contoh nyata) → Belokan (75–90%, ubah satu variabel dan tunjukkan akibatnya) → Penutup (90–100%, gambar pembuka dibaca ulang dengan benar + langkah berikutnya).
Visual: diagram bersih, node dan panah, label pendek. Benda dipertahankan antar adegan dan berubah bentuk, bukan diganti.
Metafora hanya bila membuat ide lebih akurat.`,
  whiteboard: `Gaya: WHITEBOARD. Ikon dan tulisan tampak digambar di latar putih sambil narasi berjalan.
Pola cerita: Pertanyaan → Penjelasan bertahap (satu gambar per poin) → Ringkasan gambar utuh → CTA.
Visual: garis hitam, satu warna aksen, ikon sederhana. Urutan munculnya gambar harus mengikuti urutan narasi.
Gerak: garis digambar (reveal path), lalu diam saat dibaca.`,
  "ugc-edit": `Gaya: UGC DARI VIDEO PELANGGAN. Rekaman pelanggan dipotong, diberi teks, subtitle, dan musik.
Pola cerita: Hook dari momen paling menarik di rekaman → Konteks singkat → Demonstrasi/manfaat → CTA.
Aturan: setiap adegan wajib menunjuk assetId rekaman video pelanggan. Jangan menunjuk footage yang tidak ada. Visual menjelaskan bagian rekaman yang dipakai; timecode pasti ditentukan saat produksi setelah rekaman ditranskrip.`,
  "stock-cinematic": `Gaya: CINEMATIC STOCK. Potongan video stok berlisensi disusun sinematik dengan narasi dan teks.
Pola cerita: Suasana (hook visual) → Cerita/manfaat → Puncak emosi → CTA.
Visual: deskripsikan shot stok yang dicari (subjek, suasana, gerak kamera) sebagai placeholder, assetId = null kecuali memakai aset pelanggan.
Gerak: potongan mengikuti ketukan musik bila musik aktif; teks minimal.`,
  "ilustrasi-2d": `Gaya: ILUSTRASI 2D. Ilustrasi datar yang bergerak sederhana memakai aset ilustrasi siap pakai.
Pola cerita: Tokoh/situasi yang dikenal penonton → Masalah → Perubahan berkat produk/layanan → CTA.
Visual: bentuk dan karakter konsisten di semua adegan (sebut ciri yang sama setiap kali). Tidak membuat karakter baru per adegan.`,
  "presenter-ai": `Gaya: PRESENTER AI (premium). Presenter digital di pembuka dan penutup, total 15–20 detik; bagian tengah motion graphic.
Pola cerita: Presenter membuka dengan hook → Motion graphic menjelaskan isi → Presenter menutup dengan CTA.
Aturan: tandai adegan presenter di visual dengan awalan "PRESENTER:". Total durasi adegan presenter 15–20 detik. Tidak meniru orang nyata.`,
  "cinematic-ai": `Gaya: CINEMATIC AI (premium). Adegan sinematik dibuat model video AI.
Pola cerita: Suasana → Cerita → Puncak → CTA.
Aturan: setiap adegan AI ditulis sebagai deskripsi shot yang jelas (subjek, aksi, kamera, cahaya, durasi). Biaya mengikuti detik adegan AI, jadi gunakan adegan AI hanya bila menambah makna; sisanya teks/motion sederhana.`,
};

export const TONE_GUIDE: Record<string, string> = {
  edukasi: "Gaya bahasa: edukasi dan wawasan — runtut, jelas, ramah, tanpa menggurui.",
  promosi: "Gaya bahasa: promosi dan jualan — sorot keunggulan dan manfaat, ajakan beli yang jelas, tidak berlebihan.",
  hook: "Gaya bahasa: hook viral — pembuka memancing rasa ingin tahu, kalimat pendek, tetap jujur pada fakta.",
  santai: "Gaya bahasa: santai dan akrab — bahasa sehari-hari yang sopan, seperti ngobrol dengan teman.",
  formal: "Gaya bahasa: formal dan resmi — baku, sopan, cocok untuk instansi dan layanan publik.",
};
