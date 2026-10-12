# Analisis PAYG dan paket konten

Status: ANALISIS / USULAN v0.3 — 11 Oktober 2026. Angka komponen di bawah adalah simulasi harga jual, bukan HPP yang sudah diukur dan bukan tarif final. Acuan terbaru: fullset Rp350.000; 5 fullset Rp1.250.000; 10 fullset Rp2.000.000. Paket kembali masuk rancangan. Skill akan dipasang pada aplikasi kemudian.

## 1. Bentuk PAYG yang disarankan

Klien membayar konfigurasi yang dipesan: jenis produksi, durasi/jumlah slide, komponen, jumlah keluaran, dan tambahan yang terlihat sebelum pembayaran. Tidak ada langganan konten wajib. Harga ditetapkan sebelum eksekusi dengan batas yang disetujui; retry internal tidak otomatis menambah tagihan.

Ini PAYG berdasarkan layanan dan pemakaian yang disetujui, bukan tagihan token/API mentah yang baru diketahui setelah pekerjaan selesai. Pemakaian API aktual dicatat internal untuk menguji margin. Premium/generasi tambahan memerlukan quote/add-on dan persetujuan sebelum dipakai. Tidak memerlukan wallet kredit pelanggan untuk tahap awal.

Harga standar per item = produksi dasar + naskah baru + penyediaan visual + VO + penyediaan musik, sesuai pilihan. Durasi, jumlah shot/slide, kompleksitas, format dan versi tambahan mengubah tarif atau menghasilkan quote tambahan. Pajak/fee/status biaya posting masih perlu keputusan; tidak diam-diam masuk definisi all in.

## 2. Pisahkan tiga keputusan pelanggan

| Dimensi | Pilihan | Pengaruh harga |
|---|---|---|
| Format/tujuan | Reels/Story, UGC, explainer, carousel | Menentukan alur produksi dan unit keluaran |
| Gaya visual | Motion graphic, cinematic, illustration, 2D animation, whiteboard, mixed media, 3D | Mengubah kompleksitas dan kemungkinan kebutuhan shot/karakter/alat |
| Sumber komponen | Upload klien, stock standar, AI-generated, custom production | Mengubah biaya pengadaan dan generasi |

UGC dapat memakai footage klien atau presenter AI. Explainer dapat bergaya motion graphic, illustration atau whiteboard. Animation terlalu luas untuk satu tarif: template 2D dan karakter 3D custom harus dibedakan. Jangan menjumlahkan biaya explainer + illustration + animation otomatis bila semuanya menggambarkan satu pekerjaan yang sama.

Referensi [Higgsfield MCP](https://higgsfield.ai/mcp?tab=chatgpt) memuat workflow UGC, editorial motion, ilustrasi/whiteboard After Effects, dan produksi Blender. Pemilihan nama workflow tidak membuktikan akses backend atau kesetaraan biaya. Beberapa memerlukan aplikasi/runtime lain; Remotion tidak otomatis menjalankan proyek After Effects/Blender. Katalog baru dipasarkan setelah capability, output, akses, waktu, dan biaya diuji.

## 3. Komponen yang dibayar

| Komponen | Yang termasuk | Yang tidak otomatis termasuk |
|---|---|---|
| Produksi dasar | Validasi brief, rencana/storyboard, assembly/edit/animasi standar, render, QC, caption standar | Riset panjang, shooting, 3D/karakter custom, format/versi tanpa batas |
| Naskah | Penulisan satu naskah sesuai brief dan spesifikasi | Banyak alternatif hook, bahasa lain, penulisan ulang konsep setelah approval |
| Penyediaan visual | Pemilihan aset stock/library yang dapat dipakai sesuai lisensi, dalam kuota | Generasi video premium, footage custom, shooting, exclusive stock |
| Voice over | Satu narasi, satu voice dan bahasa, dalam batas durasi; koreksi pengucapan sesuai kebijakan | Presenter/avatar/lip-sync, voice cloning khusus, dubbing banyak bahasa |
| Musik | Pilihan track dari library berlisensi sesuai penggunaan, mixing standar | Jingle original, komposisi khusus, hak eksklusif |

Teks dan aset klien tetap perlu diperiksa serta dipasang: biaya itu ada di produksi dasar. Menghapus VO tidak menghapus caption; menghapus layanan naskah tidak menghapus pemeriksaan teks. Script upload harus ready-to-use; bila perlu rewrite substansial, tawarkan layanan naskah sebelum bayar.

## 4. Mode aset: hindari istilah 'tanpa footage' yang ambigu

1. Pakai aset klien: tidak ada biaya penyediaan visual, tetap ada assembly/edit dasar. Logo/product image boleh datang dari klien walaupun visual stock dipilih.
2. Tanpa footage foto/video: text, shape, grafik sederhana dan animasi template. Visual tidak kosong; elemen tersebut bagian produksi dasar.
3. Visual stock/library dari layanan: tambah komponen penyediaan visual standar.
4. AI-generated image/video: harga bergantung jumlah gambar, detik shot, model, resolusi dan kebutuhan konsistensi; kuota/premium quote terpisah.
5. Custom footage/shooting/karakter/3D: quotation tersendiri.

Footage generatif berbeda dari durasi video final: video 30 detik dapat memakai 10 detik footage AI dan 20 detik motion graphic. Metering menggunakan jumlah detik generasi yang diminta, termasuk kandidat berbayar yang disepakati dalam biaya internal, bukan otomatis seluruh durasi final.

Musik memiliki pilihan terpisah: upload klien, library dari layanan, atau tidak ada musik. Musik asli dalam footage tidak boleh dikenakan komponen baru lagi jika memang cukup untuk hasil akhir. Jika generasi menyediakan audio yang memenuhi kebutuhan, jangan otomatis menggandakan tagihan VO/musik tambahan.

## 5. Simulasi harga standar video

Berikut alokasi harga jual yang sengaja disusun agar cocok dengan tiga total dari pengguna. Angka harus divalidasi terhadap HPP. Ini satu opsi yang dapat ditinjau, bukan hasil penelitian harga pasar.

| Komponen per video | Satuan | Dalam paket 5 | Dalam paket 10 |
|---|---:|---:|---:|
| Produksi dasar | Rp150.000 | Rp110.000 | Rp90.000 |
| Naskah baru | Rp50.000 | Rp35.000 | Rp30.000 |
| Visual stock/library standar | Rp75.000 | Rp50.000 | Rp35.000 |
| VO standar | Rp50.000 | Rp35.000 | Rp30.000 |
| Musik library standar | Rp25.000 | Rp20.000 | Rp15.000 |
| Fullset per video | Rp350.000 | Rp250.000 | Rp200.000 |
| Total pesanan | Rp350.000 | Rp1.250.000 | Rp2.000.000 |

### Kombinasi

| Konfigurasi | 1 video | 5 video | 10 video |
|---|---:|---:|---:|
| Fullset standar | Rp350.000 | Rp1.250.000 | Rp2.000.000 |
| Tanpa penyediaan visual, dengan naskah/VO/musik | Rp275.000 | Rp1.000.000 | Rp1.650.000 |
| Tanpa VO, dengan naskah/visual/musik | Rp300.000 | Rp1.075.000 | Rp1.700.000 |
| Tanpa penyediaan visual dan tanpa VO, dengan naskah/musik | Rp225.000 | Rp825.000 | Rp1.350.000 |
| Tanpa penyediaan visual, VO dan musik; naskah dari layanan | Rp200.000 | Rp725.000 | Rp1.200.000 |
| Naskah/visual/musik dari klien, tanpa VO; produksi dasar saja | Rp150.000 | Rp550.000 | Rp900.000 |

Dengan cara ini, 5 konten tanpa visual dan VO tidak harus Rp1.000.000: contoh yang masih memakai naskah dan musik menjadi Rp825.000. Pengurangan mengikuti tarif komponen pada tier paket tersebut, bukan mengurangi harga komponen satuan dari paket diskon.

## 6. Ketentuan paket

- Paket 5/10 dihitung dari jumlah konten yang dibayar sekaligus dalam satu order, sesuai arahan pengguna; bukan saldo untuk dipakai tanpa tenggat.
- Fullset berarti seluruh komponen standar dalam spesifikasi yang jelas. Bukan semua model/preset, durasi, percobaan, asset custom dan revisi tanpa batas.
- Usulan awal: diskon berlaku pada item dalam kelompok tarif standar yang sama. Campuran video dan carousel atau premium perlu aturan terpisah, jangan otomatis diberi diskon yang sama.
- Tiap konten dapat memiliki brief dan naskah sendiri; 5 fullset meliputi 5 naskah dan 5 keluaran, bukan satu naskah dibagi lima.
- Jika komponen tiap item berbeda, jumlahkan tarif komponen item pada tier order. Jangan menampilkan total fullset ketika sebagian komponen dimatikan.
- Tambahan setelah order dibayar adalah quote perubahan; tidak mengubah harga/approval item lama otomatis.
- Pilihan pilot 1/5/10. Untuk quantity bebas kelak, usulan kombinasi paket + satuan transparan dengan jumlah output sesuai pesanan; hindari harga non-monotonik tanpa penjelasan. Mixed profile/jenis memerlukan aturan tersendiri.
- Pilot harus memeriksa apakah batch benar-benar menurunkan biaya setup; provider video/VO biasanya tetap punya biaya per output.

Diskon terhadap fullset satuan: paket 5 sekitar 28,57%; paket 10 sekitar 42,86%. Angka ini cukup besar, terutama jika output menggunakan banyak shot generatif premium.

## 7. Spesifikasi standar yang diusulkan untuk pilot

Usulan untuk diskusi, belum batas final: video hingga 30 detik, satu rasio/output 1080p, satu bahasa dan voice, satu naskah sekitar 60–80 kata yang diuji pada VO, hingga 6 scene, hingga 6 visual stock/library, satu track musik, satu caption dan satu hasil final per item.

Kata hanyalah perkiraan kemampuan narasi, bukan aturan memotong naskah yang sudah disetujui. Timing diukur pada audio sebenarnya. Thumbnail, subtitle, source editable, format tambahan dan posting termasuk/tidak termasuk masih perlu keputusan. Revisi koreksi tetap tiga jenis dari pengguna; putaran dan tenggat TBD.

Generasi premium tidak dimasukkan tanpa kuota ke komponen visual stock Rp75.000. Jika pemilik ingin footage AI termasuk dalam Rp350.000/Rp200.000, tetapkan model, detik generasi maksimum, kandidat dan HPP pilot yang cukup terlebih dahulu. Bila melampaui standar, harga baru ditampilkan sebelum pembayaran, bukan ditagih setelah selesai.

## 8. Tarif menurut jenis produksi

| Jenis | Jalan produksi | Ketentuan harga yang disarankan |
|---|---|---|
| Motion graphic | Template/komposisi + teks/aset + render | Kandidat tarif standar di atas |
| Explainer | Naskah/diagram/visual + VO opsional | Standar bila dalam envelope; riset/diagram kompleks quote |
| UGC edit | Footage klien + editing/caption | Kandidat produksi dasar; naskah/VO hanya bila dipesan |
| UGC AI | Presenter/karakter, demonstrasi, beberapa shot/lip-sync | Basis produksi + komponen presenter/shot generatif; premium hingga pilot membuktikan layak standar |
| Cinematic | Stock footage atau shot AI | Stock sederhana bisa standar; multi-shot premium quote |
| Illustration/2D | Aset tersedia atau ilustrasi custom | Template bisa standar; ilustrasi/karakter custom dinilai per aset/scene |
| Whiteboard | Template ikon/diagram atau gambar custom | Template standar; artwork custom quote |
| Animation 3D/VFX | Modeling, rigging, scene/render khusus | Quotation, tidak otomatis Rp350.000 |
| Carousel | Layout + copy + visual, per konten dengan batas slide | Matriks tarif sendiri; tidak pernah menagih VO/musik pada carousel statis |

Untuk carousel, total awal pengguna tetap Rp350.000 / Rp1.250.000 / Rp2.000.000 sebagai acuan fullset. Namun alokasi komponennya harus berbeda: desain/layout, copy/struktur slide, visual dan optional ilustrasi; jumlah slide menjadi unit kompleksitas. Jangan menerapkan breakdown video secara langsung. Breakdown carousel dan batas 8 slide untuk pilot kini diusulkan dalam [FULLSET-SPEC](FULLSET-SPEC.md); tariff tetap belum final sebelum biaya/kualitas diuji.

## 9. Biaya API dan harga jual

Halaman [Higgsfield API](https://higgsfield.ai/higgsfield-api) yang diperiksa 11 Oktober 2026 menampilkan tarif promosi berbeda: Kling 3.0 sekitar $0,042/detik dan Seedance 2.5 sekitar $0,144/detik. Ini angka tampilan publik, bukan quote untuk semua mode/model/resolusi atau jaminan harga akun. Pakai harga nyata endpoint dan jangan mengunci bisnis pada diskon sementara.

Simulasi jika seluruh 30 detik dibuat dengan model itu dan tiga kandidat berbayar dibuat:

| Tarif tampilan | 1 kandidat 30 detik | 3 kandidat 30 detik | 10 video × 3 kandidat |
|---|---:|---:|---:|
| $0,042/detik | $1,26 | $3,78 | $37,80 |
| $0,144/detik | $4,32 | $12,96 | $129,60 |

Asumsi kandidat semuanya billable, bukan pernyataan bahwa semua request gagal ditagih. Angka belum mencakup LLM, TTS, gambar, render, storage, QC, fee dan lisensi. Tiga kandidat berdurasi total 90 detik dapat memerlukan beberapa request karena batas durasi per model. Biaya mengikuti request/segmen sebenarnya. Saldo $20 bukan kapasitas tetap untuk satu paket 10.

HPP konten: API aktual + render + penyediaan/lisensi aset + penyimpanan/transfer + QC/operator + cadangan koreksi yang wajar + alokasi overhead. Catat failure/retry dan versi tanpa menagihkan otomatis ke klien.

Uji margin: harga jual sebelum pajak/fee pass-through dikurangi HPP. Untuk ilustrasi target margin kontribusi 50%, fullset paket 10 Rp200.000 memberi batas HPP Rp100.000 per konten; produksi dasar paket 10 Rp90.000 memberi batas Rp45.000. Target 50% adalah contoh analisis, belum keputusan bisnis. Jika biaya tidak memenuhi ambang yang ditetapkan, kurangi cakupan standar atau pindahkan job premium ke quote; jangan diam-diam menurunkan kualitas yang dijanjikan.

## 10. Checkout dan metering

Klien memilih format/gaya → durasi/slide → kuantitas 1/5/10 → sumber aset → naskah dari klien/layanan → VO dan musik → versi/output → review biaya. Sumber script dan VO independen: script klien boleh memakai VO layanan.

Harga dihitung server, terversi, dan disimpan sebagai snapshot bersama komponen, allowance, jenis produksi, tier, currency, dan expiry quote. UI menampilkan total dan daftar yang termasuk. Ubah konfigurasi sebelum payment menghitung ulang; setelah paid lewat change request.

Ledger internal mencatat detik/gambar/token/audio/render dan biaya estimasi/aktual per provider serta item. Nama model/token tidak perlu tampil pada alur pelanggan; bila ada biaya extra, tampilkan 'tambahan footage AI 10 detik' dan hasil yang mereka beli. Budget dan limit enforcement wajib berjalan pada worker, bukan hanya form UI.

## 11. Keputusan berikutnya

Setujui atau ubah envelope standar; tentukan apa yang dimaksud footage included (stock atau AI dengan kuota); tentukan mixing paket; tetapkan jumlah naskah/varian; putaran revisi; caption/subtitle/source file/posting included; lalu lakukan pilot HPP per jenis. Setelah itu baru finalisasi angka komponen dan aktifkan tariff di CMS.

## Pembaruan pilot v0.3

Baseline lebih konkret ada di [FULLSET-SPEC](FULLSET-SPEC.md). PILOT-COST-REPORT berisi simulasi memakai tarif publik sebelum diskon dan tiga quote MCP langsung. Promo historis pada bagian 9 bukan dasar tariff production. Quality/end-to-end belum diuji; ikuti PILOT-PROTOCOL.
