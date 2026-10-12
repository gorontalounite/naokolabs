# PRD — Product Requirements Document

Status: DRAF. Acuan bisnis: [BRD](BRD.md). Acuan status: [Workflow](WORKFLOW.md).

## Pengguna dan peran

Usulan: client owner (pemesanan, pembayaran, persetujuan, koneksi akun); client member (sesuai hak yang diberikan); operator produksi/support; administrator sistem. Kategori industri berbeda dari peran akses. Hak peran harus diputuskan sebelum implementasi.

## FR-01 Login dan workspace

Daftar/login, verifikasi akun, reset password, logout, pengaturan profil. Satu workspace/organisasi memiliki anggota dan satu atau beberapa brand. Semua pesanan, aset, hasil, dan akun sosial berada di workspace tertentu. Metode login final TBD.

## FR-02 Studio Video (form pemesanan)

Produk pertama adalah video vertikal 9:16 (Reels/Story/TikTok). Carousel menyusul dengan form tersendiri.

Klien memilih satu dari tiga cara memasukkan bahan:
- **Link Web**: link produk marketplace, artikel, atau postingan medsos. Sistem membaca isi halaman sebagai data. Bila halaman tidak bisa dibaca (diblokir, perlu login), klien diminta menempel teksnya.
- **Tulis Naskah**: naskah atau poin dari klien, dipakai apa adanya; AI hanya menyusun adegan dan caption.
- **Ide Singkat**: satu kalimat topik. Ide Konten (momen jualan, contoh ide) dapat mengisi kolom ini.

Pilihan lain: durasi 15/30/60 detik; gaya bahasa (Edukasi, Promosi, Hook Viral, Santai, Formal); gaya video dari Katalog Gaya (standar atau perlu penawaran); voice-over dan suaranya; musik latar; subtitle. Brand kit (nama, handle, logo, warna, ajakan penutup) diambil dari Pengaturan.

Unggahan aset (logo, foto, rekaman untuk gaya UGC, PDF/CSV sebagai sumber) diperlakukan sebagai data, bukan instruksi ke agen. Spesifikasi dan batas yang belum ditetapkan tidak boleh diasumsikan oleh AI.

Tombol utama "Buat Rencana Video" tidak memakai kuota. Gaya premium menampilkan penawaran tambahan sebelum produksi.

## FR-03 Langganan, kuota dan payment

Klien berlangganan paket bulanan yang memberi kuota video per periode (D-14). Kuota terpakai saat klien menyetujui rencana dan produksi dimulai; penyusunan rencana dan perubahan rencana sebelum persetujuan tidak memakai kuota. Produksi yang gagal karena sistem mengembalikan kuota. Gaya premium memakai penawaran tambahan yang disetujui sebelum produksi.

Dashboard menampilkan paket aktif, sisa kuota dan tanggal perpanjangan. Status langganan aktif hanya berasal dari verifikasi server/provider; pembayaran gagal/kedaluwarsa tidak membuka kuota baru. Harga paket, kuota, hitungan video 60 detik, sisa kuota akhir bulan, provider payment (Midtrans/Xendit), tagihan otomatis vs perpanjangan manual, serta refund belum diputuskan dan wajib ditetapkan sebelum go-live.

## FR-04 Rencana dan persetujuan

Setelah pembayaran valid, dashboard langsung menunjukkan pesanan diterima dan status penyusunan rencana. AI menghasilkan brief terstruktur, referensi, strategi, script, storyboard/urutan slide, serta draf caption yang dapat ditinjau.

Script ditampilkan sebelum persetujuan agar klien menyetujui kata yang benar-benar akan dibacakan. Persetujuan mengikat versi rencana, script, aset, spesifikasi, dan draf caption. Rencana yang diubah harus disetujui ulang. Hak memperbaiki rencana sebelum produksi berbeda dari revisi hasil; batasnya TBD.

## FR-05 Produksi

Jalankan cabang video dengan VO bila dipilih. Cabang carousel (render slide) adalah tahap berikutnya. Anthropic (Claude) menyusun rencana/naskah dan membantu komposisi Remotion/slide (D-17); ElevenLabs mengubah naskah final menjadi suara; renderer menghasilkan file. HeyGen/Kling/Seedance/Canva hanya dipakai bila kebutuhan konten memerlukannya dan akses/biaya sudah jelas.

Status mencakup antrean, sedang diproses, menunggu klien, gagal, dan selesai. Progress mengacu kejadian nyata; estimasi yang belum terkalibrasi diberi label estimasi. Menutup browser tidak membatalkan pekerjaan. Satu item gagal tidak otomatis menggagalkan item lain.

## FR-06 Hasil dan revisi

Preview video lengkap dengan audio (carousel seluruh slide pada tahap berikutnya); caption; download; riwayat versi. Hasil siap disetujui hanya setelah QC dan file tersedia.

Revisi: penempatan gambar/video; typo; pengucapan VO keliru. Form meminta scene/timestamp atau nomor slide, kesalahan, hasil yang diminta, dan aset pengganti bila relevan. Kesalahan pipeline bukan pesanan baru. Perubahan konsep/durasi/style di luar persetujuan awal dikategorikan permintaan baru dan diberi penjelasan, tanpa otomatis menagih.

Jumlah putaran dan tenggat revisi TBD. Bukti persetujuan hasil final mengikat versi artefak dan caption. Perbaikan artefak tidak diam-diam mengganti versi yang sudah dijadwalkan.

## FR-07 Posting dan jadwal

Hubungkan akun melalui OAuth; tampilkan identitas akun, izin dan kemampuan format. Pengguna memilih hasil final, platform, akun, caption per platform, privasi/opsi wajib provider, dan waktu. Konfirmasi publikasi/schedule adalah otorisasi spesifik, berbeda dari persetujuan produksi.

Scheduler internal memanggil publishing API saat waktu tiba, kecuali provider mendukung dan dipilih untuk native schedule. Tampilkan zona waktu; simpan UTC dan zona asal. WITA dapat menjadi default UI, dapat diubah.

Setiap kanal menyimpan statusnya sendiri. Jadwal bisa dibatalkan/diubah sebelum dispatch. Token dicabut/expired → perlu koneksi ulang. Timeout setelah submit → rekonsiliasi, bukan blind retry. Selesai berarti provider mengonfirmasi hasil, bukan hanya request diterima. Fallback download/manual posting tersedia bila akun/API tidak memenuhi syarat.

## FR-08 CMS dan admin

Kelola katalog/harga terversi, referensi/preset, aturan form per jenis konten, kategori klien, brand kit, template produksi, dan status aktif integrasi. Kelola pesanan, payment, support/revisi, job gagal, penggunaan biaya, dan audit. Klien hanya mengelola brand/brief/konten miliknya; tidak mengubah harga atau konfigurasi provider global.

Template, prompt, dan skill memiliki versi. Perubahan CMS tidak mengubah pesanan yang telah dibayar/disetujui. Website klien memerlukan spesifikasi CMS tersendiri bila nanti dibangun.

## NFR — kebutuhan kualitas

- Data klien terpisah di semua jalur akses.
- Job tahan refresh/restart dengan checkpoint dan retry terbatas.
- Publikasi/pembayaran tidak digandakan oleh event berulang.
- Aset privat; download dan akses provider memakai izin minimum dengan waktu berlaku yang sesuai.
- Catatan penggunaan provider dan biaya per item tersedia untuk admin.
- Seluruh dashboard responsive di mobile: login, form/upload, checkout, approval, preview/revisi, koneksi akun, posting dan kalender dapat diselesaikan di ponsel. Dapat dinavigasi keyboard, kesalahan input jelas, progress dapat dibaca. Lihat [UI/UX](UI-UX.md) untuk acceptance mobile.
- SLA, concurrency, ukuran unggahan, retensi, RPO/RTO, dan target performa harus diputuskan lewat pilot sebelum go-live.

## Kontrak pilot dan komersial

FULLSET-SPEC menjadi acuan baseline pilot video (carousel tahap berikutnya), [analisis harga langganan](PAYG-PRICING.md) menjadi dasar harga paket, BUSINESS-RULES memuat aturan operasional draf. UI harus membedakan layanan siap/quote/belum tersedia. Jangan memasarkan baseline pilot atau simulasi HPP sebagai capability produksi yang sudah terbukti.

## FR-09 Storyboard visual dan preview

Dashboard menyediakan rencana scene/slide yang dapat diedit, keyframe/layout dengan asset binding nyata, dan animatic video bila capability/budget mendukung. Klien melihat kata/narasi persis, timing perkiraan, crop/aset, aksi gerak dan keterbatasan preview. Carousel standar menampilkan seluruh 8 slide. Komentar ditautkan ke scene/slide dan versi. Perubahan menghasilkan diff, preview yang diperbarui dan approval versi baru. Approval mengikat manifest yang akan digunakan produksi. Detail dan acceptance utama: [STORYBOARD-PREVIEW](STORYBOARD-PREVIEW.md).

## FR-10 Referensi, template dan prompt terversi

CMS memisahkan referensi gaya, template executable dan contoh hasil terverifikasi. Setiap entri menyimpan capability, batas, hak aset, versi dan bukti QC. Pemilihan pelanggan membatasi planner pada template/kemampuan yang relevan. Aturan prompt global + tahap planner/preview/producer/QA diatur dan diuji; server menegakkan schema, approval, payment dan budget. Acuan: [REFERENCE-LIBRARY](REFERENCE-LIBRARY.md), [SYSTEM-PROMPTS](SYSTEM-PROMPTS.md).
