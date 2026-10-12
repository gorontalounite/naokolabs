# PRD — Product Requirements Document

Status: DRAF. Acuan bisnis: [BRD](BRD.md). Acuan status: [Workflow](WORKFLOW.md).

## Pengguna dan peran

Usulan: client owner (pemesanan, pembayaran, persetujuan, koneksi akun); client member (sesuai hak yang diberikan); operator produksi/support; administrator sistem. Kategori industri berbeda dari peran akses. Hak peran harus diputuskan sebelum implementasi.

## FR-01 Login dan workspace

Daftar/login, verifikasi akun, reset password, logout, pengaturan profil. Satu workspace/organisasi memiliki anggota dan satu atau beberapa brand. Semua pesanan, aset, hasil, dan akun sosial berada di workspace tertentu. Metode login final TBD.

## FR-02 Form pemesanan

Nama klien/brand, kategori, keluaran video Reels/Story atau Carousel, format/gaya produksi (UGC, Explainer, Motion Graphic, Cinematic, Illustration, Animation, Whiteboard sesuai capability aktif), jumlah konten/tier satuan atau paket 5/10, referensi visual, nama campaign/promo/content, tujuan, audiens, brief/notes, CTA, warna dominan, logo/font dan identitas brand, bahasa, serta kanal tujuan.

Reels/Story menampilkan durasi, rasio, pilihan voice, contoh pengucapan nama, backsound/jingle, serta footage. Carousel menampilkan jumlah slide, rasio, dan urutan pesan; durasi/VO tidak diwajibkan.

Brief bisa ditulis manual atau diunggah: PDF, CSV, gambar, video, audio. Ekstraksi menghasilkan draf untuk diperiksa klien, bukan instruksi langsung ke agen. CSV memerlukan pratinjau dan pemetaan kolom sebelum membuat beberapa item. PDF hasil scan memerlukan OCR bila dipilih dan tersedia.

Konfigurasi PAYG memisahkan sumber visual (klien/tanpa footage/stock/AI/custom), sumber naskah, VO, dan musik. Komponen saling independen; tanpa VO tetap dapat memakai musik/naskah. Harga dihitung server dari komponen pada tier order dan batas yang dipilih, mengikuti [analisis PAYG](PAYG-PRICING.md) setelah tariff disetujui. Pilihan premium belum teruji memakai quote, tidak harga standar otomatis.

Harga tampil dari versi katalog yang berlaku. Spesifikasi dan batas yang belum ditetapkan tidak boleh diasumsikan oleh AI. Item pesanan menyimpan brief masing-masing; bulk duplicate tersedia sebagai usulan.

## FR-03 Payment

Checkout memuat item, spesifikasi, harga, biaya tambahan yang sudah ditetapkan, dan total. Provider payment belum dipilih. Order menyimpan snapshot harga, versi tarif, breakdown komponen dan allowance. Penghapusan komponen menghitung ulang sebelum bayar; perubahan setelah paid menjadi quote/change request terpisah. Kegagalan/retry internal tidak otomatis menambah tagihan pelanggan. Status paid hanya berasal dari verifikasi server/provider. Payment gagal/expired tidak memulai produksi berbayar. Refund dan kegagalan setelah pembayaran memerlukan kebijakan sebelum go-live.

## FR-04 Rencana dan persetujuan

Setelah pembayaran valid, dashboard langsung menunjukkan pesanan diterima dan status penyusunan rencana. AI menghasilkan brief terstruktur, referensi, strategi, script, storyboard/urutan slide, serta draf caption yang dapat ditinjau.

Script ditampilkan sebelum persetujuan agar klien menyetujui kata yang benar-benar akan dibacakan. Persetujuan mengikat versi rencana, script, aset, spesifikasi, dan draf caption. Rencana yang diubah harus disetujui ulang. Hak memperbaiki rencana sebelum produksi berbeda dari revisi hasil; batasnya TBD.

## FR-05 Produksi

Jalankan cabang sesuai item: video dengan VO bila dipilih; carousel dengan render slide. OpenAI menyusun rencana/naskah; ElevenLabs mengubah naskah final menjadi suara; Anthropic membantu komposisi Remotion/slide; renderer menghasilkan file. HeyGen/Kling/Seedance/Canva hanya dipakai bila kebutuhan konten memerlukannya dan akses/biaya sudah jelas.

Status mencakup antrean, sedang diproses, menunggu klien, gagal, dan selesai. Progress mengacu kejadian nyata; estimasi yang belum terkalibrasi diberi label estimasi. Menutup browser tidak membatalkan pekerjaan. Satu item gagal tidak otomatis menggagalkan item lain.

## FR-06 Hasil dan revisi

Preview video lengkap dengan audio atau carousel seluruh slide; caption; download; riwayat versi. Hasil siap disetujui hanya setelah QC dan file tersedia.

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

FULLSET-SPEC menjadi acuan baseline pilot video/carousel, PAYG menjadi kandidat kalkulasi komponen, BUSINESS-RULES memuat aturan operasional draf. UI harus membedakan layanan siap/quote/belum tersedia. Jangan memasarkan baseline pilot atau simulasi HPP sebagai capability produksi yang sudah terbukti.

## FR-09 Storyboard visual dan preview

Dashboard menyediakan rencana scene/slide yang dapat diedit, keyframe/layout dengan asset binding nyata, dan animatic video bila capability/budget mendukung. Klien melihat kata/narasi persis, timing perkiraan, crop/aset, aksi gerak dan keterbatasan preview. Carousel standar menampilkan seluruh 8 slide. Komentar ditautkan ke scene/slide dan versi. Perubahan menghasilkan diff, preview yang diperbarui dan approval versi baru. Approval mengikat manifest yang akan digunakan produksi. Detail dan acceptance utama: [STORYBOARD-PREVIEW](STORYBOARD-PREVIEW.md).

## FR-10 Referensi, template dan prompt terversi

CMS memisahkan referensi gaya, template executable dan contoh hasil terverifikasi. Setiap entri menyimpan capability, batas, hak aset, versi dan bukti QC. Pemilihan pelanggan membatasi planner pada template/kemampuan yang relevan. Aturan prompt global + tahap planner/preview/producer/QA diatur dan diuji; server menegakkan schema, approval, payment dan budget. Acuan: [REFERENCE-LIBRARY](REFERENCE-LIBRARY.md), [SYSTEM-PROMPTS](SYSTEM-PROMPTS.md).
