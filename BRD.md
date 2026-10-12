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

| Layanan | Harga dasar dari pengguna | Unit |
|---|---:|---|
| Web landing page | Rp750.000 | Per tahun, termasuk domain |
| Web multiple page | Rp1.500.000 | Per tahun, termasuk domain |
| Video standar fullset | Rp350.000 | Satu video; batas jenis, durasi dan aset TBD |
| Carousel fullset | Rp350.000 | Satu konten Carousel, jumlah slide TBD |

Model terbaru adalah PAYG per komponen yang dipesan, dengan tarif tier paket. Acuan fullset pengguna: Rp1.250.000/5 konten dan Rp2.000.000/10 konten yang dipilih sekaligus. Fullset mencakup footage/aset, naskah, dan VO untuk video sesuai batas yang akan diputuskan; carousel memakai komponen yang relevan tanpa VO/musik statis. Tidak memasukkan semua jenis premium tanpa batas.

Tanpa penyediaan footage/visual, tanpa VO, atau memakai naskah klien menghasilkan harga berbeda. Pengurangan menggunakan komponen pada tier paket, bukan harga satuan tanpa diskon. Lihat [analisis PAYG](PAYG-PRICING.md) untuk simulasi dan ketentuan; angka komponen belum disetujui. Satu konten Carousel bukan satu slide, dan satu video tidak otomatis mencakup banyak versi/rasio.

Pajak, fee payment, biaya posting, penyimpanan, revisi, premium asset, dan perpanjangan domain belum ditetapkan. Total checkout harus transparan setelah keputusan tersebut tersedia.

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

[Fullset pilot](FULLSET-SPEC.md) mendefinisikan video hingga 30 detik dan carousel hingga 8 slide sebagai batas uji, bukan tariff aktif. [Laporan biaya](PILOT-COST-REPORT.md) memisahkan quote, simulasi dan actual spending. Target margin dan ketentuan komersial tetap perlu keputusan pemilik.
