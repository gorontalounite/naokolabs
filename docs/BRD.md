# BRD — Business Requirements Document

Status: DRAF v0.2. Pemilik keputusan: pengguna/pemilik layanan. 11 Oktober 2026.

## Tujuan bisnis

Memudahkan klien memesan konten, membayar, menyetujui rencana, menerima hasil dan caption, memperbaiki kesalahan terbatas, lalu memublikasikan atau menjadwalkannya melalui satu dashboard.

Mengurangi koordinasi manual tanpa melepas kendali klien atas brief, pesan brand, dan publikasi. Klaim produktivitas atau keuntungan belum diukur.

## Layanan

1. Video Reels/Story dengan ragam format/gaya: Motion Graphic, UGC, Explainer, Cinematic, Illustration, Animation dan Whiteboard. Rincian capability dan tariff tiap jenis masih dianalisis.
2. Carousel Design.
3. Copywriting: caption, artikel, summary. Caption hadir pada keluaran konten; harga dan cakupan artikel/summary terpisah belum ditetapkan.
4. Web landing page dan multiple page. Harga ada, tetapi alur produksi website belum dijelaskan; usulan tahap awal berupa katalog dan permintaan layanan.
5. Posting dan penjadwalan Instagram, Facebook, TikTok sesuai kemampuan akun dan izin API.
6. Pengelolaan iklan Meta/TikTok/Google: ditunda sesuai jawaban terbaru pengguna. Istilah AdSense dalam brief awal tidak dipakai sebagai nama modul posting.

## Harga

Model bayar terbaru (D-14): **langganan bulanan dengan kuota video**. Rencana video (naskah, storyboard, caption) tidak memakai kuota; kuota terpakai saat klien menyetujui rencana dan produksi dimulai. Gaya premium (presenter AI, cinematic AI) memakai penawaran tambahan yang ditampilkan sebelum produksi.

Belum ditetapkan dan harus dihitung dari biaya produksi nyata: harga tiap paket, kuota video per paket, apakah video 60 detik dihitung lebih dari satu kuota, nasib sisa kuota di akhir bulan, diskon durasi tagihan. Analisis ada di [PAYG-PRICING](PAYG-PRICING.md).

Harga awal dari pengguna tetap dicatat sebagai acuan nilai:

| Layanan | Harga dasar dari pengguna | Unit |
|---|---:|---|
| Web landing page | Rp750.000 | Per tahun, termasuk domain |
| Web multiple page | Rp1.500.000 | Per tahun, termasuk domain |
| Video standar fullset | Rp350.000 | Satu video (acuan model PAYG lama) |
| Carousel fullset | Rp350.000 | Satu konten carousel (tahap berikutnya) |

Model PAYG per komponen dan paket 5/10 (D-07) digantikan D-14 untuk dashboard. Pajak, fee payment, penyimpanan, revisi, premium asset dan perpanjangan domain belum ditetapkan.

## Segmen klien

Segmen awal: pelajar/mahasiswa, pemerintahan, retail, properti, influencer, automotive.

Tambahan yang diminta: UMKM; kuliner/F&B; pendidikan; pariwisata/hospitality; komunitas/organisasi; event; jasa profesional; kesehatan/kebugaran; kecantikan/fashion; teknologi/startup; NGO/nonprofit; lain-lain.

Kategori dipakai untuk membantu form dan referensi, bukan alasan otomatis mengubah harga. Konten klaim kesehatan, promosi, atau informasi pemerintah membutuhkan sumber dan pemeriksaan yang sesuai konteks.

## Ukuran keberhasilan

- Rasio brief yang dilanjutkan menjadi pembayaran.
- Waktu dari pembayaran ke rencana siap ditinjau, lalu persetujuan ke hasil final.
- Tingkat hasil diterima pada percobaan pertama dan jenis revisi.
- Keberhasilan produksi, render, dan publikasi per provider.
- Biaya aktual per konten, termasuk kegagalan dan revisi.
- Margin kontribusi per pesanan.

Nilai target belum ditetapkan; tentukan setelah pilot nyata. Kredit API $20 per penyedia adalah rencana saldo awal, bukan bukti biaya tetap bulanan atau kapasitas produksi tertentu.

## Batas awal

Pemilik menginginkan aplikasi siap berkembang ke lebih dari 10 integrasi. Seluruh integrasi tidak perlu diaktifkan sekaligus. Produksi konten dan posting organik menjadi fokus; pengelolaan iklan dan otomasi produksi website berada pada tahap lanjutan.

## Baseline untuk pembuktian biaya

[Fullset pilot](FULLSET-SPEC.md) mendefinisikan video hingga 30 detik dan carousel hingga 8 slide sebagai batas uji, bukan tariff aktif. Laporan biaya memisahkan quote, simulasi dan actual spending. Target margin dan ketentuan komersial tetap perlu keputusan pemilik.
