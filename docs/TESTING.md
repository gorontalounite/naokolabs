# Kriteria penerimaan dan verifikasi

Status: DRAF; ini rencana pemeriksaan, belum hasil test aplikasi.

| ID | Skenario | Hasil yang diwajibkan |
|---|---|---|
| AC-01 | Klien A meminta ID order/file/job milik B | Ditolak pada API, database, storage dan download |
| AC-02 | Form video/carousel diisi | Field relevan tampil; input kurang tidak diteruskan |
| AC-03 | Upload PDF/CSV berisi perintah ke agen | Teks diperlakukan sebagai data; tidak menjalankan perintah/integrasi |
| AC-04 | Harga katalog berubah setelah paid | Harga order tetap snapshot lama |
| AC-05 | Callback browser menyebut paid, webhook invalid | Produksi tidak dimulai |
| AC-06 | Notification payment valid diterima dua kali | Satu transisi paid dan satu dispatch per item |
| AC-07 | Paid, belum plan approval | Rencana dapat dibuat; produksi mahal belum berjalan |
| AC-08 | Script/storyboard berubah setelah approval | Approval lama tidak berlaku untuk versi baru |
| AC-09 | Browser ditutup/worker restart | Status dan checkpoint dapat dipulihkan |
| AC-10 | API timeout/rate limit/budget habis | Retry terbatas atau pause, alasan dan next action jelas |
| AC-11 | Render kode mencoba akses token/network tak diizinkan | Sandbox menolak; rahasia tidak bocor |
| AC-12 | Video dinyatakan siap | File valid; seluruh playback, media, teks, audio/timing diperiksa |
| AC-13 | Carousel dinyatakan siap | Semua slide terbaca, urut, tanpa crop/typo/media salah |
| AC-14 | Revisi media/typo/pengucapan | Bagian tepat diperbaiki, versi baru di-QC; konsep tetap |
| AC-15 | Permintaan revisi konsep baru | Dijelaskan sebagai perubahan scope, tidak otomatis ditagih |
| AC-16 | OAuth token dicabut | Posting berhenti aman dan meminta reconnect |
| AC-17 | Dua scheduler dispatch post sama | Deduplikasi/lease, rekonsiliasi; tidak blind retry |
| AC-18 | Satu kanal berhasil, lainnya gagal | Status per kanal benar, kanal berhasil tidak dikirim ulang |
| AC-19 | Jadwal WITA dan zona lain | UTC dan zona tampil konsisten; dispatch waktu yang benar |
| AC-20 | Schedule menunjuk versi lama, ada revisi baru | Tidak mengganti diam-diam; perlu konfirmasi versi baru |
| AC-21 | Provider menerima request tapi belum final | UI publishing, tidak published sebelum konfirmasi |
| AC-22 | Backup direstore di lingkungan terpisah | Pesanan, versioning, job, dan referensi aset dapat diperiksa |

## Cara memeriksa

Unit test untuk aturan harga, transisi, scope revisi, dan deduplikasi. Integration test untuk payment, database/akses, adapter dan job recovery. Browser end-to-end untuk alur klien/admin. Contract test berdasarkan respons provider, sandbox payment, dan akun sosial uji sesuai izin provider. Inspect render serta dengarkan video penuh; typecheck tidak membuktikan kualitas media.

Pilot mengukur waktu, biaya, keberhasilan, dan kualitas: minimal contoh video dengan footage klien, video dengan nama brand yang rawan salah pengucapan, carousel dengan copy panjang, serta skenario revisi. Jumlah sampel/ambang lulus TBD. API mock berguna untuk error cases, tetapi bukti integrasi nyata tetap diperlukan sebelum go-live.

## Tambahan PAYG dan mobile

- AC-23: fullset standar menghitung tepat Rp350.000 untuk 1, Rp1.250.000 untuk 5, Rp2.000.000 untuk 10 pada tariff yang disetujui; simulasi analisis tidak dianggap tariff live.
- AC-24: menonaktifkan visual/VO/naskah/musik mengurangi komponen pada tier benar; tidak menagih dua kali audio native atau aset yang sudah tersedia.
- AC-25: script klien + VO layanan valid; carousel statis tidak dikenai VO/musik; biaya shared tidak digandakan.
- AC-26: premium/durasi/shot/varian melewati allowance → quote/perubahan scope sebelum charge dan eksekusi, tidak memanggil API tanpa batas.
- AC-27: harga/konfigurasi yang dimanipulasi browser tidak mengubah quote server; paid quote tetap immutable.
- AC-28: alur lengkap pada 360/390/430 piksel, Safari iOS dan Chrome Android; tidak ada overflow halaman, CTA tertutup keyboard, tabel tak terbaca atau aksi hover-only. Verifikasi pada browser nyata setelah UI tersedia.

## Pembuktian pilot biaya

AC-29: ledger actual memisahkan usage provider, quote, unknown billing, alokasi operator, shared batch cost dan tagihan klien. AC-30: quality gate sesuai FULLSET-SPEC diverifikasi dengan output nyata dan review mobile. PREFLIGHT atau SIMULATED bukan status PASSED untuk produksi. Kasus uji dan status tersedia pada PILOT-PROTOCOL.

## Storyboard, prompt dan kesesuaian hasil

Uji seluruh acceptance [STORYBOARD-PREVIEW](STORYBOARD-PREVIEW.md): preview/manifest version cocok, perubahan scene invalidasi approval, server menolak render tanpa payment/approval, input file tidak mengganti instruksi, placeholder tidak dianggap final, aset lintas klien ditolak, caption/script tidak berubah diam-diam, overflow audio ditangani. Periksa seluruh scene/slide dan audio final terhadap approved manifest. Evaluasi setiap profil produksi dengan brief berbeda; jangan menyebut capability lulus hanya karena schema valid. Eksekusi contoh saat ini dihentikan pengguna; test produksi menunggu otorisasi berikutnya.
