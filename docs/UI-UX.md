# UI/UX dashboard

Status: DRAF; identitas visual dan referensi UI belum dipilih.

## Navigasi klien

Beranda; Pesanan; Buat Konten; Brand & Aset; Hasil Konten; Posting & Kalender; Akun Sosial; Pembayaran; Bantuan & Revisi. Nama dan jumlah menu dapat disederhanakan setelah prototipe.

Alur Buat Konten: pilih jenis dan jumlah → pilih referensi → isi brief spesifik → upload dan tinjau → ringkasan biaya → payment → rencana → persetujuan → progress → hasil/revisi → persetujuan final → posting/jadwal.

## Tampilan penting

- Beranda: pekerjaan butuh persetujuan, pesanan aktif, jadwal terdekat dan tindakan untuk error.
- Detail item: brief, strategi, script, storyboard/slide, aset terikat, riwayat persetujuan dan status.
- Hasil: video dengan audio atau semua slide berurutan, caption, download, dan revisi terarah.
- Kalender: waktu/zona, akun tujuan, thumbnail, status per kanal, ubah/batalkan.
- Akun Sosial: nama akun dan platform, izin/format yang tersedia, perlu reconnect, disconnect.
- Payment: invoice/status/total yang berasal dari server.

Progress menyebut pekerjaan yang sedang berlangsung. Saat menunggu persetujuan, tampilkan tindakan klien; saat gagal, jelaskan opsi pemulihan. Nama model, token, dan pesan teknis raw tidak perlu muncul pada flow klien.

## Admin/CMS

Daftar pesanan dan antrean gagal; katalog harga; referensi dan preset; kategori; template/prompt/skill version; support; biaya per item/provider; status integrasi; audit. Operator hanya mendapat data yang diperlukan untuk tugasnya.

## Acceptance antarmuka

Form berbeda untuk video/carousel, validasi di dekat field, autosave dengan status tersimpan/gagal, empty/loading/error/success yang jelas, navigasi keyboard, preview mobile, pemutaran audio, dan konfirmasi akun/waktu sebelum publikasi. Referensi visual dashboard dan hasil konten adalah dua keputusan desain yang terpisah.

## Responsive mobile — wajib

Seluruh alur klien harus selesai di ponsel, bukan hanya halaman beranda. Uji viewport 360, 390, 430, 768 dan 1280 piksel serta browser Safari iOS dan Chrome Android yang didukung. Target minimum dukungan browser/version ditetapkan sebelum implementasi.

- Mobile memakai satu kolom dan form bertahap, label jelas, simpan draf dan lanjutkan setelah upload/checkout.
- Kartu harga menunjukkan total dan daftar komponen; sticky ringkasan/CTA tidak menutupi field, error, keyboard atau safe area.
- Pilihan format, gaya, sumber aset, naskah, VO dan musik dipisah. Komponen tak relevan disembunyikan (misalnya VO pada carousel statis). Harga berubah segera pada pilihan, lalu diverifikasi server saat quote.
- Sidebar desktop menjadi drawer/menu pada mobile. Hindari menampilkan semua menu panjang sekaligus.
- Tabel order/admin menjadi kartu dengan detail yang dapat dibuka. Storyboard menjadi kartu scene/slide; jangan memaksa tabel desktop lebar.
- Preview video menyesuaikan rasio dan layar, kontrol audio/fullscreen mudah disentuh. Carousel dapat digeser dengan nomor slide dan tombol alternatif; aksi approval/revisi tetap tersedia.
- Kalender mobile memakai agenda/list dengan pergantian tanggal dan zona waktu; grid bulanan bersifat opsional.
- Upload dari file picker/galeri ponsel mempunyai progress, status gagal, retry dan pilihan simpan draf. Ketahanan terhadap jaringan terputus disesuaikan teknologi upload.
- Target sentuh utama sekurangnya 44×44 CSS pixel sebagai ketentuan desain proyek; jangan mengandalkan hover.
- Tidak ada horizontal scroll halaman pada lebar 360 piksel; konten khusus yang membutuhkan scroll berada dalam container dengan petunjuk.

Acceptance: user dapat login → memesan konfigurasi PAYG → upload → bayar → approve → preview/revisi → pilih akun/jadwal dari ponsel, dengan teks/biaya terbaca tanpa zoom manual dan tanpa aksi tertutup keyboard/overlay.

## Konfigurator video 60s + presenter

Mobile: pilih jenis/durasi, aset milik klien atau layanan, naskah baru/siap pakai, VO dan presenter sebagai pilihan terpisah. Tampilkan durasi presenter 15–20 detik dalam total video 60s. Ringkasan harga rupiah tetap mudah terlihat; mode paket menjelaskan harga per item dan total. Perubahan opsi memperbarui quote sebelum bayar. Jangan menjanjikan semua pilihan tetap Rp350.000. Tampilan progress menunjukkan tahap nyata, bukan persentase waktu palsu. Approval mencatat versi script/storyboard dan output. OAuth/post sekarang/jadwalkan ditempatkan setelah approval output.
