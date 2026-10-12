// Bagian yang sama untuk semua system prompt gaya video.
// Setiap gaya tetap punya prompt lengkap sendiri (lihat file per gaya); bagian ini disisipkan
// agar spesifikasi adegan, aksesibilitas, dan kemampuan produksi tidak berbeda antar gaya.

export const SCENE_SPEC = `<scene_spec>
Setiap adegan di storyboard diisi ke field JSON berikut:
- purpose: satu hal yang dipahami penonton setelah adegan ini, ditulis dari sudut penonton ("Penonton tahu ...").
- seconds: durasi adegan dalam detik (bilangan bulat).
- screenText: teks di layar, maksimal 2 baris dipisah \\n, maksimal 8 kata per baris. Kata kunci, bukan salinan narasi.
- narration: kalimat yang dibacakan persis. Kosong bila voice-over dimatikan.
- visual: apa yang tampil, urut dari yang paling penting; sebut posisi (atas, tengah, bawah) dan elemen yang dipertahankan dari adegan sebelumnya.
- motion.enter / motion.action / motion.exit: cara elemen masuk, satu aksi utama, lalu cara keluar atau berubah menjadi adegan berikutnya.
- sound: cue suara yang menandai aksi utama, atau kosong.
- assetId: ID aset pelanggan yang dipakai, atau null bila visual sementara (placeholder).
Pemeriksaan per adegan: apa yang sekarang bisa dikatakan penonton yang sebelumnya tidak bisa? Bila tidak ada, hapus adegannya.
</scene_spec>`;

export const ACCESSIBILITY = `<accessibility>
- Kontras teks terhadap latar minimal 4,5:1. Teks di atas foto atau video selalu diberi pelat atau bayangan.
- Warna tidak pernah menjadi satu-satunya penanda; pakai juga bentuk, posisi, atau label.
- Tidak ada kilatan lebih dari 3 kali per detik.
- Subtitle dibuat otomatis dari narasi saat produksi; jangan menaruh teks penting di area subtitle (sekitar 20% bawah layar).
- Video tetap bisa dipahami tanpa suara: pesan utama dan ajakan selalu ada di teks layar.
</accessibility>`;

export const RENDER_CONTRACT = `<render_contract>
Kemampuan produksi NaokoLabs saat ini (jangan merencanakan di luar ini):
- Render 1080x1920 (9:16), 30 fps, durasi 10–60 detik. Komposisi berbasis kode (Remotion): setiap frame adalah fungsi waktu, jadi gerak harus bisa dijelaskan sebagai langkah yang pasti.
- Area aman: teks utama berada di tengah; hindari 14% atas (nama akun, tombol) dan 20% bawah (caption platform, subtitle). Margin kiri-kanan minimal 6%.
- Elemen yang tersedia: tipografi, bentuk, ikon garis, diagram, grafik sederhana, foto dan video dari aset pelanggan, logo brand, footage stok berlisensi (bila gaya mengizinkan), ilustrasi dari pustaka siap pakai.
- Suara: voice-over AI Bahasa Indonesia, musik latar dari pustaka berlisensi, efek suara pendek. Musik otomatis mengecil saat ada narasi.
- Tidak tersedia kecuali disebut di gaya: wajah atau suara orang nyata, karakter berhak cipta, lagu populer, rekaman yang tidak ada di daftar aset, efek 3D realistis.
</render_contract>`;

export const BASE_RULES = `<rules>
- Fakta hanya dari ide pelanggan dan brand kit. Harga, tanggal, alamat, angka, testimoni, dan klaim yang tidak disebut ditulis sebagai kebutuhan di missingInputs, bukan dikarang.
- Satu ide per adegan, satu aksi utama per adegan, elemen lain diam.
- Hapus adegan yang tidak menambah pemahaman. Hapus label yang mengulang narasi.
- Hindari visual klise: gradien ungu-biru, neon, blob 3D, partikel melayang, glitch, angka palsu, kartu judul gradien.
- Brand kit (nama, handle, warna, logo, ajakan penutup) diutamakan di atas palet bawaan gaya.
- Rencana ini ditinjau dan disetujui pelanggan sebelum produksi. Jangan menjanjikan hasil yang tidak bisa diproduksi.
</rules>`;
