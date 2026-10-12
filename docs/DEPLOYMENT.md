# Deployment dan operasional

Status: DRAF; hosting/compute belum dipilih. Tidak ada deployment dari paket dokumen ini.

## Lingkungan

Local untuk pengembangan; preview/staging untuk payment sandbox dan akun sosial uji; production untuk klien nyata. Pisahkan database, bucket, OAuth redirect, webhook URL, key dan batas biaya tiap lingkungan.

## Gerbang rilis

1. Spesifikasi komersial jelas: unit keluaran, durasi/slide/rasio, revisi, refund, total checkout, dan retensi.
2. Login, pemisahan klien, upload privat, payment, approval, worker recovery dan QC lolos kriteria relevan.
3. Akses API/model pada akun pemilik teruji; app review/audit diperlukan diselesaikan untuk kanal yang diaktifkan.
4. Budget per job dan pemantauan error/biaya berjalan; retry tidak menimbulkan produksi/post berulang.
5. Backup/restore dan rollback diuji; domain, HTTPS dan OAuth redirect valid.
6. Pemilik mengotorisasi rilis production pada hasil yang bisa ditinjau.

Kanal yang belum memenuhi syarat ditandai belum tersedia; download/manual posting dapat digunakan. Jangan menjanjikan semua integrasi hanya karena UI tombolnya tersedia.

## Prosedur

Simpan versi aplikasi, migration, template, prompt, skill, dan model config. Jalankan pemeriksaan staging, migrasi kompatibel, deploy, smoke test alur nyata, lalu pantau. Jika gagal, pause dispatch baru, rekonsiliasi job aktif, rollback aplikasi bila aman. Rollback schema bukan sekadar redeploy; restore mengikuti rencana teruji.

Alarm: job macet, webhook gagal, biaya melonjak, token expiry, render gagal, jadwal terlambat, post outcome_unknown. Jangan otomatis mengirim ulang post yang statusnya belum jelas.

## Keputusan operasi terbuka

SLA support/produksi, jam layanan, RPO/RTO, concurrency, retensi, backup frequency, auto-delete aset, ownership domain, ekstensi domain yang termasuk harga, dan mekanisme perpanjangan website tahunan.
