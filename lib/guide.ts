// Isi panduan pengguna. Mengikuti alur yang sudah diputuskan (docs/DECISIONS.md D-11–D-15).
export type GuideModule = { id: string; title: string; subtitle: string; intro: string; steps: { title: string; body: string }[] };

export const guideModules: GuideModule[] = [
  {
    id: "mulai",
    title: "Mulai cepat",
    subtitle: "Video pertama Anda",
    intro: "Membuat video di NaokoLabs terdiri dari tiga langkah: masukkan bahan, setujui rencana, lalu video siap diposting.",
    steps: [
      { title: "Pilih cara memasukkan bahan", body: "Di Studio Video pilih Link Web (link produk/artikel/postingan), Tulis Naskah (teks Anda sendiri), atau Ide Singkat (satu kalimat topik)." },
      { title: "Atur durasi dan gaya bahasa", body: "Pilih 15, 30 atau 60 detik, lalu gaya bahasa seperti Promosi atau Edukasi." },
      { title: "Pilih gaya video, suara dan musik", body: "Pilih gaya dari Katalog Gaya. Nyalakan voice-over, musik dan subtitle sesuai kebutuhan." },
      { title: "Klik “Buat Rencana Video”", body: "Kami menyusun naskah, storyboard dan caption. Langkah ini gratis dan belum memakai kuota." },
    ],
  },
  {
    id: "rencana",
    title: "Menyetujui rencana",
    subtitle: "Naskah, storyboard, caption",
    intro: "Rencana adalah gambaran video sebelum diproduksi. Periksa dengan teliti karena produksi mengikuti rencana yang Anda setujui.",
    steps: [
      { title: "Baca storyboard per adegan", body: "Setiap adegan berisi teks di layar, narasi yang dibacakan, dan visual. Label PLACEHOLDER berarti gambar belum final." },
      { title: "Periksa naskah dan caption", body: "Pastikan nama brand, harga, alamat dan ejaan sudah benar." },
      { title: "Minta perubahan atau setujui", body: "Jika ada yang kurang pas, minta perubahan. Jika sudah sesuai, klik “Setujui & Produksi Video”. Satu kuota terpakai saat ini." },
    ],
  },
  {
    id: "hasil",
    title: "Produksi, hasil & revisi",
    subtitle: "Menunggu dan meninjau",
    intro: "Produksi berjalan di server. Anda boleh menutup dashboard; kami kabari lewat email saat video siap.",
    steps: [
      { title: "Pantau progres", body: "Halaman video menampilkan tahap yang sedang berjalan: suara narasi, render, lalu pemeriksaan kualitas." },
      { title: "Tonton hasil sampai selesai", body: "Dengarkan pengucapan nama dan angka, periksa teks dan gambar di setiap adegan." },
      { title: "Minta perbaikan bila perlu", body: "Perbaikan gratis untuk gambar salah tempat, typo, dan pengucapan yang keliru. Perubahan konsep, durasi atau gaya dihitung sebagai video baru." },
    ],
  },
  {
    id: "jadwal",
    title: "Jadwal & auto-post",
    subtitle: "Instagram, TikTok, Facebook",
    intro: "Video yang sudah disetujui bisa dijadwalkan ke akun yang terhubung atau diunduh untuk diposting sendiri.",
    steps: [
      { title: "Hubungkan akun", body: "Buka Pengaturan → Akun Medsos dan hubungkan akun. Menghubungkan akun tidak otomatis memposting apa pun." },
      { title: "Pilih waktu", body: "Di Jadwal & Auto-Post pilih hari dan jam. Waktu ditampilkan dalam WITA dan bisa diubah." },
      { title: "Konfirmasi", body: "Periksa akun, video dan caption sebelum menyimpan jadwal. Jadwal bisa diubah atau dibatalkan sebelum waktunya." },
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
      { title: "Gaya premium", body: "Gaya berlabel “Perlu penawaran” memakai biaya tambahan yang ditampilkan sebelum produksi, tidak ditagih diam-diam." },
      { title: "Kegagalan teknis", body: "Jika produksi gagal karena sistem, kuota tidak berkurang." },
    ],
  },
];
