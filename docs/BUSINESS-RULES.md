# Aturan bisnis operasional — draf

Status: USULAN v0.4. Bukan terms hukum final. Diperbarui 12 Oktober 2026: langganan + kuota (D-14). Harga mengacu BRD dan [analisis langganan](PAYG-PRICING.md), unit pada FULLSET-SPEC.

## Langganan dan kuota

Klien berlangganan paket bulanan dengan kuota video. Rencana video dan perubahan rencana sebelum persetujuan tidak memakai kuota. Satu persetujuan "Setujui & Produksi Video" memakai satu kuota (hitungan untuk video 60 detik belum diputuskan). Klik ganda, retry, atau event berulang tidak boleh memakai kuota dua kali.

Produksi gagal karena sistem mengembalikan kuota. Perbaikan dalam cakupan tidak memakai kuota. Perubahan konsep, durasi, gaya atau suara setelah persetujuan diproses sebagai video baru dengan konfirmasi klien. Gaya premium memakai penawaran tambahan yang ditampilkan dan disetujui sebelum produksi; tidak ada tagihan diam-diam di luar paket.

Kuota habis: dashboard menawarkan naik paket atau kuota tambahan (aturan B-6 di analisis langganan belum diputuskan); produksi tidak berjalan tanpa kuota. Sisa kuota akhir bulan mengikuti keputusan B-4.

## Payment, cancel dan refund

Langganan aktif hanya berdasarkan verifikasi server/provider. Pembayaran pending/gagal/kedaluwarsa tidak membuka kuota baru; video yang sudah selesai tetap dapat diunduh sesuai kebijakan retensi. Tidak ada tagihan atas retry internal.

Usulan: pembatalan langganan berlaku di akhir periode berjalan; kuota yang tersisa tetap bisa dipakai sampai periode berakhir. Refund, pro-rata, perpanjangan otomatis vs manual, dan masa tenggang gagal bayar belum ditetapkan dan perlu kajian vendor serta ketentuan hukum sebelum dipublikasikan. Dokumen ini tidak menyatakan hak hukum pelanggan.

Jika layanan gagal memenuhi video yang kuotanya sudah terpakai: perbaiki atau kembalikan kuota sesuai kebijakan yang akan diputuskan.

## Approval dan revisi

Approval mengikat versi naskah/aset/storyboard/spec/caption yang ditampilkan. Perubahan versi sebelum produksi membutuhkan approval baru. Koreksi penempatan media, typo dan pronunciation included sesuai arahan pengguna; perubahan konsep/voice/durasi/format setelah approval membutuhkan change request.

Usulan feedback dua putaran dalam 7 hari setelah delivery; koreksi kesalahan layanan yang masih terbukti tidak otomatis menjadi biaya ekstra setelah dua putaran. Review/approval pelanggan harus jelas, tidak dianggap setuju hanya karena tidak menjawab. Deadline expiry, pause dan reminder perlu diputuskan.

## Aset dan data

Klien memberi konfirmasi hak penggunaan aset upload. Library layanan mencatat sumber dan batas lisensi; tidak menjanjikan hak eksklusif. Shooting/jingle/karakter custom diberi scope dan hak tersendiri. Avatar/voice identity mengikuti izin dan kebijakan provider. Retensi/penghapusan harus ditampilkan setelah jangka waktunya dipilih; jangan menganggap media tersimpan selamanya.

## Publishing

Koneksi OAuth bukan izin memublikasikan setiap output. Klien mengonfirmasi versi, akun, caption dan waktu. Status unknown direkonsiliasi sebelum retry. Penyediaan file konten berbeda dari keberhasilan distribusi platform; kanal unsupported menawarkan download/manual posting. Tarif posting/scheduling masih terbuka.

## Penanganan operator

Saat budget stop/provider gagal, tunjukkan status dan tindakan; jangan mengganti model/kualitas/content scope diam-diam. Support dapat mengulang tahap yang sudah diotorisasi dan masih dalam budget; tindakan extra spend/publishing mengikuti persetujuan yang relevan. Catat biaya serta siapa yang memutuskan.

## SKU presenter 60 detik

Presenter opening/closing total 15–20 detik kini termasuk gaya premium "Presenter AI" yang memakai penawaran tambahan di luar kuota standar. Angka Rp350.000 berasal dari analisis PAYG lama. Audio native presenter tidak dikenai biaya ElevenLabs ganda untuk segmen yang sama. Detik billable provider menghitung seluruh kandidat; pelanggan mendapat quote terkunci dan perubahan yang disetujui, bukan tagihan retry cacat layanan.
