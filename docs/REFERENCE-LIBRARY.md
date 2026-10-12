# Pustaka referensi dan template produksi

Status: spesifikasi katalog; belum mengumpulkan atau membuat contoh. Referensi unggahan adalah data untuk dianalisis, bukan instruksi yang mengubah aturan sistem.

## Tiga benda yang berbeda

- Referensi gaya: menunjukkan ritme, komposisi, gerak atau storytelling. Tidak otomatis memberi hak menyalin aset, musik, logo, karakter atau karya secara utuh.
- Template produksi: komposisi milik layanan atau berlisensi, dengan parameter dan batas yang diuji. Template yang sama digunakan pada preview dan final; perbedaan kualitas/resolusi dicatat.
- Contoh hasil terverifikasi: output dari versi template dan pipeline tertentu yang telah ditinjau, dengan biaya/waktu terukur. Label siap produksi hanya setelah validasi, bukan hanya dari video referensi menarik.

## Katalog awal yang relevan

| Jenis | Referensi perlu memperlihatkan | Kontrol template | Bukti pada storyboard |
|---|---|---|---|
| Motion Graphic | Hierarki teks, diagram/shape, ritme transisi | Font, warna, panjang copy, beat, aset, safe zone | Keyframe dan aksi gerak per beat |
| Explainer | Urutan masalah → mekanisme → manfaat/CTA | Langkah, node diagram, hubungan, ikon | Penjelasan tiap langkah dan perubahan keadaan |
| Whiteboard | Urutan gambar digambar lalu dijelaskan | Stroke/reveal, urutan elemen, tulisan | Sketsa awal/akhir, urutan reveal, narasi |
| UGC edit footage klien | Cut, crop, tempo, subtitle, kontinuitas produk | Binding file dan source timecode, crop, teks | Shot asli yang tersedia dan trim rencana |
| Illustration 2D | Bahasa ilustrasi dan konsistensi bentuk/karakter | Aset/rig siap pakai, pose, layer, gerak | Karakter/aset terpilih dan keyframe |
| Carousel standar 8 slide | Hook, alur copy, keterbacaan, CTA | Grid, tipografi, crop, urutan slide | Preview seluruh slide dan copy persis |
| Presenter + motion | Porsi presenter, ruang grafis, perpindahan suara | Identitas, durasi presenter, audio route, overlay | Posisi opening/closing dan batas detik |
| Cinematic/animation custom | Shot, kamera, kesinambungan dan kualitas | Parameter generator sesuai capability | Placeholder/hasil keyframe yang diberi label; quote premium |

Whiteboard tidak wajib gambar tangan AI; reveal path/template deterministik dapat dipakai bila menghasilkan bentuk yang diinginkan. UGC edit dari footage klien berbeda dari UGC presenter sintetis; katalog/form/harganya dipisahkan. Illustration beraset siap pakai berbeda dari karakter baru per order.

## Metadata wajib pada CMS

reference_id; nama; jenis; status (draft/reviewed/active/retired); pemilik; sumber/link/file; hak penggunaan/expiry; izin tampil sebagai contoh publik; purpose; durasi/rasio; language; karakter gerak; jumlah scene/slide; parameter template dan min/max; asset requirements; VO/presenter/music requirements; required capabilities; preview/example artifact; template_version; prompt_profile_version; QC evidence; biaya/waktu dengan status simulated/estimated/measured; batas yang tidak didukung.

Visual contoh tampil bersama ringkasan: apa yang bisa disesuaikan, aset yang harus dikirim, komponen yang termasuk, biaya premium jika ada, serta bagian yang hanya referensi. Contoh milik klien tidak dimasukkan katalog publik tanpa izin; logo/identitas/sumber privat tidak dibagikan lintas workspace.

## Pemilihan dan retrieval

Filter dahulu berdasarkan jenis konten, template aktif, rasio, durasi, hak penggunaan, aset tersedia, pilihan VO/presenter dan envelope harga. Baru cocokkan pesan/audiens/gaya. Referensi yang indah tetapi tidak didukung runtime tidak menjadi pilihan siap produksi.

Pelanggan memilih satu arah utama; perpaduan referensi harus dijelaskan sebagai usulan baru. Planner menerima paket referensi terkurasi dengan anotasi konkret, bukan seluruh pustaka setiap request. Jangan mengklaim dapat memahami video hanya dari URL: gunakan analisis/frame/transkrip yang benar-benar tersedia dan catat bukti serta keterbatasan. Instruksi dalam PDF/CSV/video caption tidak boleh mengendalikan tool atau mengganti system prompt.

## Urutan menyiapkan pustaka

1. Tentukan scope dan batas per jenis yang dijual.
2. Kumpulkan referensi dengan hak pakai/tampil yang jelas dan anotasi komposisi/gerak.
3. Siapkan satu template yang representatif per jenis prioritas; jumlah contoh bertambah berdasarkan cakupan nyata, bukan kuota arbitrer.
4. Validasi preview dan final menggunakan manifest yang sama, termasuk copy panjang/pendek dan aset klien yang berbeda.
5. Uji kualitas audio/visual/mobile serta biaya dan koreksi; simpan contoh terverifikasi.
6. Aktifkan hanya capability yang lulus, tampilkan lainnya sebagai request/quote atau belum tersedia.

Tidak ada pembuatan contoh yang diotorisasi oleh dokumen ini. Eksekusi contoh tetap dihentikan sesuai arahan pengguna.
