# Workflow produksi dan publikasi

Status: DRAF. Setiap item memiliki workflow sendiri; order mengagregasi jumlah selesai/gagal/menunggu. Jangan memakai satu status untuk payment, produksi, dan publikasi.

## Payment

draft → pending_payment → paid. Cabang: failed, expired, refund_pending, refunded sesuai kebijakan/provider. Event berulang tidak boleh memberi kredit/dispatch berulang. Paid memulai perencanaan, bukan otomatis render sebelum approval.

## Per item

1. brief_draft: klien mengisi, unggahan divalidasi, hasil ekstraksi ditinjau.
2. planning_queued/planning: pembayaran valid; AI menyusun strategi, script, storyboard/slide, draf caption.
3. awaiting_plan_approval: klien melihat versi lengkap; edit menghasilkan versi baru.
4. approved: simpan siapa/kapan/versi yang disetujui; pastikan payment masih memenuhi kebijakan.
5. production_queued: reserve budget dan antrekan cabang sesuai jenis.
6. producing: generate voice bila perlu; finalisasi timing; komposisi; render; simpan output per tahap.
7. quality_check: periksa media, teks, timing, pengucapan, seluruh slide, dan caption.
8. awaiting_output_approval: preview dan download tersedia.
9. revision_requested/revising: hanya koreksi dalam cakupan; hasil versi baru masuk QC dan persetujuan lagi.
10. accepted: versi hasil disetujui; siap dipilih untuk publikasi.

Status tambahan: needs_input (aset tidak cukup), retry_wait, failed, budget_paused. Setiap status mencatat alasan dan tindakan berikutnya. Operator mengulang hanya tahap terdampak. Pembatalan/refund setelah paid mengikuti kebijakan yang belum diputuskan.

## Cabang produksi

Reels/Story: script disetujui → TTS bila dipilih → ukur audio/alignment → komposisi mengikuti audio → render video → QC visual/audio.

Carousel: pesan dan urutan slide disetujui → layout/template → render slide → QC seluruh slide → caption. ElevenLabs/HeyGen tidak diperlukan untuk carousel statis.

Kling/Seedance untuk footage sintetis tambahan; HeyGen untuk presenter/avatar bila dipilih; Canva untuk template/desain editable bila dipilih. Semuanya opsional dan memerlukan spesifikasi serta batas biaya.

## Posting per akun/platform

draft → awaiting_confirmation → scheduled (atau queued untuk sekarang) → publishing → published.

Cabang: canceled, needs_reconnect, failed, outcome_unknown. Konfirmasi mengikat artifact_version, caption_version, account_id, jadwal, dan opsi platform. Perubahan hasil tidak mengganti scheduled post; perlu pilih versi baru dan konfirmasi ulang.

Timeout setelah submit: cari status/provider ID dulu. Jangan mengklaim gagal lalu mengirim ulang tanpa rekonsiliasi. Published hanya setelah provider mengonfirmasi, dengan ID/link jika tersedia. Satu kanal gagal tidak menghapus kanal yang berhasil.

## Progress UI

Tampilkan tahap nyata dan jumlah item selesai, misalnya 'VO selesai; video sedang dirender; 2 dari 4 konten siap'. Persentase render hanya dari renderer yang mendukung; tahap lainnya cukup status. ETA tampil setelah punya data terukur. Approval tidak dihitung sebagai pekerjaan AI yang tetap berjalan.

## Koreksi

Typo → ubah field teks terdampak dan render ulang bagian yang relevan. Media salah → ganti binding aset tanpa mengubah naskah. Pengucapan → perbaiki dictionary/input TTS yang menjaga makna, regenerate segmen jika didukung, cek audio dan timing; render ulang bagian terdampak. Semua versi lama tetap terlacak sampai retensi yang disepakati.

## Detail tahap perencanaan sebelum approval

planning → validating_plan → preview_building → awaiting_plan_approval. Cabang needs_input/unsupported/budget_paused ditangani sebelum approval. Perubahan klien: plan_editing → validating_plan → preview_building → awaiting_plan_approval dengan version baru. Produksi final tidak berjalan selama tahap ini. Pembuatan aset/VO preview berbiaya hanya jika allowance tahap telah diotorisasi. Preview manifest menunjuk plan version dan menandai timing estimated/measured serta placeholder. Ketika audio terukur mengubah rencana secara bermakna, kembali ke approval; acuan [STORYBOARD-PREVIEW](STORYBOARD-PREVIEW.md).
