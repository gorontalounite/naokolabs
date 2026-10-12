# UI/UX dashboard

Status: DRAF, diperbarui 12 Oktober 2026. Pola alur mengikuti referensi InstaDeck pilihan pemilik (D-12); identitas visual NaokoLabs (krem, tinta, vermilion; Manrope).

## Navigasi klien

Menu (D-15): Studio Video; Ide Konten; Katalog Gaya; Riwayat Video; Jadwal & Auto-Post; Panduan; Paket & Kuota; Pengaturan & Brand Kit. Sidebar menampilkan kartu kuota bulan ini dan akun.

Alur Buat Video: pilih cara input (Link Web / Tulis Naskah / Ide Singkat) → durasi 15/30/60 detik → gaya bahasa → gaya video → suara, musik, subtitle → "Buat Rencana Video" → halaman video dengan penanda Rencana → Produksi → Hasil → Posting dan satu kotak "Yang perlu Anda lakukan" per tahap.

Halaman video menjadi pusat: rencana (storyboard per adegan, naskah, caption), persetujuan yang memakai kuota, progres produksi, hasil dan perbaikan, lalu jadwal atau unduh. Status internal tidak ditampilkan ke klien.

## Tampilan penting

- Beranda: pekerjaan butuh persetujuan, pesanan aktif, jadwal terdekat dan tindakan untuk error.
- Detail item: brief, strategi, script, storyboard/slide, aset terikat, riwayat persetujuan dan status.
- Hasil: video dengan audio (carousel pada tahap berikutnya), caption, download, dan revisi terarah.
- Kalender: waktu/zona, akun tujuan, thumbnail, status per kanal, ubah/batalkan.
- Akun Sosial: nama akun dan platform, izin/format yang tersedia, perlu reconnect, disconnect.
- Paket & Kuota: paket aktif, sisa kuota, tanggal perpanjangan, dan tagihan yang berasal dari server.

Progress menyebut pekerjaan yang sedang berlangsung. Saat menunggu persetujuan, tampilkan tindakan klien; saat gagal, jelaskan opsi pemulihan. Nama model, token, dan pesan teknis raw tidak perlu muncul pada flow klien.

## Admin/CMS

Daftar pesanan dan antrean gagal; katalog harga; referensi dan preset; kategori; template/prompt/skill version; support; biaya per item/provider; status integrasi; audit. Operator hanya mendapat data yang diperlukan untuk tugasnya.

## Acceptance antarmuka

Form berbeda untuk video/carousel, validasi di dekat field, autosave dengan status tersimpan/gagal, empty/loading/error/success yang jelas, navigasi keyboard, preview mobile, pemutaran audio, dan konfirmasi akun/waktu sebelum publikasi. Referensi visual dashboard dan hasil konten adalah dua keputusan desain yang terpisah.

## Responsive mobile — wajib

Seluruh alur klien harus selesai di ponsel, bukan hanya halaman beranda. Uji viewport 360, 390, 430, 768 dan 1280 piksel serta browser Safari iOS dan Chrome Android yang didukung. Target minimum dukungan browser/version ditetapkan sebelum implementasi.

- Mobile memakai satu kolom dan form bertahap, label jelas, simpan draf dan lanjutkan setelah upload/checkout.
- Kartu kuota menunjukkan sisa kuota dan apa yang memakai kuota; tombol utama tidak menutupi field, error, keyboard atau safe area.
- Pilihan format, gaya, sumber aset, naskah, VO dan musik dipisah. Komponen tak relevan disembunyikan (misalnya VO pada carousel statis). Harga berubah segera pada pilihan, lalu diverifikasi server saat quote.
- Sidebar desktop menjadi drawer/menu pada mobile. Hindari menampilkan semua menu panjang sekaligus.
- Tabel order/admin menjadi kartu dengan detail yang dapat dibuka. Storyboard menjadi kartu scene/slide; jangan memaksa tabel desktop lebar.
- Preview video menyesuaikan rasio dan layar, kontrol audio/fullscreen mudah disentuh. Carousel dapat digeser dengan nomor slide dan tombol alternatif; aksi approval/revisi tetap tersedia.
- Kalender mobile memakai agenda/list dengan pergantian tanggal dan zona waktu; grid bulanan bersifat opsional.
- Upload dari file picker/galeri ponsel mempunyai progress, status gagal, retry dan pilihan simpan draf. Ketahanan terhadap jaringan terputus disesuaikan teknologi upload.
- Target sentuh utama sekurangnya 44×44 CSS pixel sebagai ketentuan desain proyek; jangan mengandalkan hover.
- Tidak ada horizontal scroll halaman pada lebar 360 piksel; konten khusus yang membutuhkan scroll berada dalam container dengan petunjuk.

Acceptance: user dapat membuat video di Studio → meninjau dan menyetujui rencana → melihat progres → meninjau hasil/revisi → menjadwalkan dari ponsel; login dan pembayaran langganan diuji di tahap akhir, dengan teks/biaya terbaca tanpa zoom manual dan tanpa aksi tertutup keyboard/overlay.

## Konfigurator video 60s + presenter

Mobile: pilih jenis/durasi, aset milik klien atau layanan, naskah baru/siap pakai, VO dan presenter sebagai pilihan terpisah. Tampilkan durasi presenter 15–20 detik dalam total video 60s. Ringkasan harga rupiah tetap mudah terlihat; mode paket menjelaskan harga per item dan total. Perubahan opsi memperbarui quote sebelum bayar. Jangan menjanjikan semua pilihan tetap Rp350.000. Tampilan progress menunjukkan tahap nyata, bukan persentase waktu palsu. Approval mencatat versi script/storyboard dan output. OAuth/post sekarang/jadwalkan ditempatkan setelah approval output.
