// Isi panduan pengguna. Mengikuti alur yang sudah diputuskan (docs/DECISIONS.md D-11–D-19).
export type GuideModule = { id: string; title: string; subtitle: string; intro: string; steps: { title: string; body: string }[] };

export const guideModules: GuideModule[] = [
  {
    id: "mulai",
    title: "Mulai cepat",
    subtitle: "Video pertama Anda",
    intro: "Membuat video di NaokoLabs terdiri dari tiga langkah: tulis ide, setujui brief & storyboard, lalu unduh video.",
    steps: [
      { title: "Tulis ide singkat", body: "Di Studio Video tulis satu atau dua kalimat, misalnya “3 alasan kopi lokal lebih segar”. Sebut jumlah poin bila ada." },
      { title: "Pilih nada bicara dan gaya video", body: "Pilih nada bicara seperti Promosi atau Edukasi, lalu pilih Motion Graphic atau Explainer. Contoh video tiap gaya ada di Katalog Gaya (perlu masuk akun)." },
      { title: "Tambahkan footage, voice-over, backsound (opsional)", body: "Unggah foto/video, rekaman voice-over, atau backsound milik Anda. Tanpa itu, video dibuat tanpa footage, tanpa suara dan tanpa musik, kecuali Anda memilih suara AI atau musik dari pustaka." },
      { title: "Klik “Buat Brief & Storyboard”", body: "Kami menyusun brief konten, storyboard, naskah dan caption. Durasi video ditentukan dari isi ide Anda. Langkah ini gratis dan belum memakai kuota." },
    ],
  },
  {
    id: "rencana",
    title: "Menyetujui brief & storyboard",
    subtitle: "Brief, storyboard, naskah, caption",
    intro: "Brief dan storyboard adalah gambaran video sebelum diproduksi. Periksa dengan teliti karena produksi mengikuti versi yang Anda setujui.",
    steps: [
      { title: "Baca brief konten", body: "Pastikan pesan utama, penonton, poin isi dan ajakan sudah sesuai maksud Anda." },
      { title: "Periksa storyboard per adegan", body: "Setiap adegan berisi teks di layar, narasi, visual dan gerakan. Label PLACEHOLDER berarti gambar belum final. Durasi video mengikuti jumlah dan panjang adegan." },
      { title: "Ubah atau setujui", body: "Ubah adegan langsung, atau minta AI menyusun ulang. Jika sudah sesuai, klik “Setujui & Produksi”. Satu kuota terpakai saat ini." },
    ],
  },
  {
    id: "hasil",
    title: "Produksi, hasil & unduh",
    subtitle: "Menunggu, meninjau, mengunduh",
    intro: "Produksi berjalan di server. Anda boleh menutup dashboard; kami kabari lewat email saat video siap.",
    steps: [
      { title: "Tonton hasil sampai selesai", body: "Dengarkan pengucapan nama dan angka, periksa teks dan gambar di setiap adegan." },
      { title: "Minta perbaikan bila perlu", body: "Perbaikan gratis untuk gambar salah tempat, typo, dan pengucapan yang keliru. Perubahan konsep, gaya atau suara dihitung sebagai video baru." },
      { title: "Unduh dan posting", body: "Setelah hasil disetujui, unduh MP4 1080×1920 dan salin caption, lalu posting dari aplikasi Instagram, TikTok atau Facebook." },
    ],
  },
  {
    id: "brand",
    title: "Brand kit",
    subtitle: "Logo, warna, penutup",
    intro: "Brand kit membuat semua video tampil konsisten dengan identitas Anda.",
    steps: [
      { title: "Isi nama brand dan handle", body: "Handle tampil di penutup video." },
      { title: "Unggah logo", body: "Gunakan PNG transparan agar logo tampil bersih di atas warna apa pun." },
      { title: "Pilih warna brand dan ajakan penutup", body: "Warna dipakai pada teks dan latar; ajakan penutup tampil di akhir video." },
    ],
  },
  {
    id: "paket",
    title: "Paket & kuota",
    subtitle: "Langganan bulanan",
    intro: "Langganan bulanan memberi kuota video per bulan. Harga dan kuota tiap paket sedang difinalkan.",
    steps: [
      { title: "Rencana tidak memakai kuota", body: "Kuota baru terpakai saat Anda menyetujui rencana dan memulai produksi." },
      { title: "Dua gaya", body: "Paket saat ini mencakup Motion Graphic dan Explainer." },
      { title: "Kegagalan teknis", body: "Jika produksi gagal karena sistem, kuota tidak berkurang." },
    ],
  },
];
