# Storyboard dan preview sebelum produksi

Status: rancangan produk, 11 Oktober 2026. Tidak menjalankan contoh atau produksi. Acuan perilaku utama: PRD; status: WORKFLOW. Semua batas tarif dan kuota penyesuaian rencana yang belum disepakati tetap TBD.

## Tujuan

Pelanggan memahami pesan, tampilan, alur gerak, ucapan, aset, dan perkiraan durasi sebelum menyetujui produksi. Storyboard adalah kontrak kreatif yang dapat diperiksa, bukan kumpulan deskripsi visual umum. Preview membantu mengurangi perubahan konsep setelah generasi, tetapi tidak menjamin kualitas lip-sync, ekspresi, gerakan sintetis atau pengucapan final.

## Tiga lapisan preview

1. Rencana adegan/slide: copy, narasi, visual binding, gerakan dan durasi rencana. Biaya penyusunan rencana mengikuti allowance order; bukan diklaim gratis tanpa kebijakan.
2. Keyframe/layout: gambar representatif dari template, aset klien atau pustaka yang boleh digunakan. Logo, teks, warna, crop dan posisi CTA terlihat. Placeholder diberi label dan tidak dianggap aset final. Frame hasil AI hanya dibuat bila anggaran praproduksi tersebut sudah diotorisasi; bukan generate video otomatis.
3. Animatic: preview beresolusi rendah dari template gerak, keyframe dan timing rencana. Dapat memakai penanda narasi/teks tanpa audio sintetis. VO preview opsional memakai budget yang telah diotorisasi; ketika suara sudah diukur, timing diperbarui dan versi yang berubah ditinjau kembali sebelum produksi final.

Label selalu eksplisit: RENCANA, PLACEHOLDER, PREVIEW TEMPLATE, atau ASET FINAL. Jangan menampilkan gerak template seolah sudah membuktikan hasil footage AI. Animatic belum setara video final. Untuk carousel statis, preview seluruh delapan layout lebih berguna daripada animatic.

## Isi setiap adegan video

scene_id stabil; tujuan/pesan; visual_description konkret; teks layar persis; narasi persis; durasi perkiraan; timing_basis (estimated/measured); aset dan crop; status serta sumber aset (client/library/generated/placeholder); presenter dan durasi tampil bila dipilih; gerakan masuk, perubahan utama, gerakan keluar/transisi; voice/pronunciation; musik/SFX bila ada; keyframe/preview; catatan pelanggan; masalah yang menghambat produksi.

UGC edit memerlukan asset_id dan source in/out per shot; source timecode berbeda dari posisi shot di timeline. Jangan menunjuk footage yang tidak tersedia. Narasi ditautkan ke segmen script, tidak disalin dengan isi berbeda antaradegan. Musik memiliki sumber dan hak penggunaan, bukan hanya nama lagu terkenal.

## Isi setiap slide carousel

slide_id dan nomor urut; fungsi slide (hook/pesan/bukti/ringkasan/CTA); heading, body dan catatan sumber; visual binding/crop; template/layout; keyframe; feedback. Delapan slide merupakan default standar yang dipilih, bukan alasan memecah pesan menjadi delapan halaman kosong. Jika brief tidak cukup, tampilkan kebutuhan informasi atau usulan jumlah berbeda untuk disetujui. Klaim faktual tetap membutuhkan sumber meskipun copy singkat.

## Dashboard pelanggan di ponsel

Urutan layar: ringkasan brief → strategi singkat → storyboard visual → caption → ringkasan produksi/harga → persetujuan. Video memakai satu kartu adegan per layar dengan thumbnail dan tab Visual / Naskah & Suara / Aset; tersedia play animatic dan pindah adegan. Carousel memakai swipe delapan slide dan navigasi nomor slide. Teks narasi lengkap dapat dibuka, tidak tersembunyi hanya dalam thumbnail kecil.

Pelanggan bisa mengubah field copy, memberi komentar pada scene/slide tertentu, mengganti aset, menandai pengucapan, dan meminta susunan ulang. Perubahan disimpan sebagai versi baru. Perubahan langsung yang diizinkan form tetap divalidasi server. Action utama: Simpan perubahan, Kirim penyesuaian rencana, Setujui untuk produksi. Persetujuan tidak otomatis memublikasikan.

## Persetujuan dan versi

Approval mengikat brief, script/caption, urutan scene/slide, binding aset, template/reference/prompt version, spesifikasi, quote, serta preview manifest. Tombol approval nonaktif jika ada blocking_issue, harga baru yang belum disetujui, aset wajib hilang, atau preview yang tidak cocok dengan versi rencana. Tidak semua field harus diperiksa ulang pelanggan untuk koreksi administratif yang tidak memengaruhi output; keputusan dampak dicatat server.

Jika perubahan memengaruhi konsep, aset, copy, timing, suara, rasio, template atau harga, approval kreatif lama tidak berlaku untuk versi baru. Tampilkan diff yang mudah dipahami dan bangun ulang hanya preview yang terdampak. Produksi mengambil snapshot immutable; perubahan CMS atau prompt setelah approval tidak mengganti snapshot.

Setelah audio terukur, sistem membandingkan durasi dengan rentang rencana. Koreksi timing teknis yang tetap dalam envelope bisa diproses menurut aturan yang disepakati; perubahan bermakna terhadap urutan, pesan, durasi yang dijual atau durasi presenter kembali untuk persetujuan. Jangan memangkas ucapan yang disetujui agar muat.

## Pembagian biaya dan revisi

Penyesuaian rencana sebelum approval berbeda dari revisi hasil. Di tahap rencana, pelanggan dapat memperbaiki arah konsep sesuai allowance perencanaan yang dijelaskan saat checkout. Kuota dan harga tambahan masih harus ditetapkan. Eksplorasi footage/presenter AI dan audio premium pada tahap preview tetap berbiaya, sehingga harus terlihat sebelum eksekusi.

Sesudah approval, perubahan konsep adalah change request dengan quote sebelum pelaksanaan. Koreksi cacat layanan—penempatan media, typo, pengucapan keliru—mengikuti hak koreksi pengguna. Storyboard tidak dipakai untuk mengalihkan tanggung jawab atas output yang menyimpang dari rencana yang disetujui.

## Kontrak plan manifest — konseptual

- Header: schema_version, plan_id, version, organization_id, order_item_id, brief_version, kind, production_type, target_spec, quote_version.
- Kreatif: strategy, reference_ids, template_version, brand_kit_version, script_version, caption_version, scenes ATAU slides, pronunciation_dictionary.
- Preview: preview_manifest_id, derived_from_plan_version, timing_basis, keyframes, animatic_artifact_id bila ada, placeholder_count, limitations.
- Validasi: blocking_issues, warnings, source_bindings, rights_status, capability_snapshot, estimated_cost, cost_status.
- Reproducibility: prompt_version, skill_version, planner_model_id, created_at, content_hash. Provider model tidak menjamin hasil identik; simpan request/result yang benar-benar diterima.

Validasi schema, kecocokan tenant dan asset ownership, harga, kemampuan template/provider serta hak produksi dijalankan kode server. Output LLM tidak dapat mengesahkan payment/approval. Gunakan discriminated type video/carousel dan field wajib per jenis; jangan mengandalkan prompt untuk validasi.

## Kriteria penerimaan

1. Pelanggan dapat meninjau dan mengomentari semua adegan/slide serta naskah lengkap dari ponsel.
2. Keyframe menunjukkan teks/aset/crop/layout dari versi yang disetujui; placeholder terlihat jelas.
3. Perubahan satu scene menghasilkan versi/diff dan invalidasi yang benar, tanpa perubahan diam-diam pada scene lain.
4. Produksi ditolak ketika payment/approval/version/cost cap tidak valid; endpoint server juga menolak walau tombol UI dilewati.
5. Timing perkiraan dan terukur dibedakan; audio overflow tidak dipotong otomatis.
6. Output diperiksa terhadap manifest: teks, aset, urutan, durasi, presenter, brand, format; video didengar penuh dan slide diperiksa seluruhnya.
