# Video 60 detik + presenter singkat — kelayakan Rp350.000

11 Oktober 2026. Estimasi perencanaan, bukan biaya produksi terukur. Pengguna memilih presenter pada opening/closing, total 15–20 detik; brand pilot fiktif. SKU ini berbeda dari baseline video 30 detik tanpa avatar.

## Spesifikasi yang diuji

Satu Reels 9:16 1080×1920, target 60 detik; satu konsep/naskah/caption Bahasa Indonesia; satu identitas presenter fiktif tampil total 15–20 detik; sisa gambar berupa motion typography/shape/diagram/aset standar. Narasi berjalan pada bagian motion. Durasi final mengikuti rekaman yang diukur, tanpa memotong kata atau mengubah kecepatan secara diam-diam. Musik berlisensi belum tersedia pada pilot, sehingga tidak dijanjikan pada hasil uji. Footage sinematik AI, karakter baru per scene, cloning, multi-bahasa dan 3D memerlukan quote terpisah.

## Harga sumber dan asumsi

[HeyGen API](https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained), diperiksa 11 Oktober: Avatar III Studio/Photo $0.99/menit; Avatar IV Photo $2.31/menit, Digital Twin/Studio $4.83/menit; Avatar V Digital Twin $7.20/menit. Pembuatan Photo Avatar $1.32/call adalah pos setup tambahan bila diperlukan. Tarif mesin/endpoint tidak boleh disamakan.

[Higgsfield API](https://higgsfield.ai/higgsfield-api): Seedance 2.5 menampilkan $0.144/detik promo dan $0.2057/detik harga normal. Untuk 20 detik presenter, dua percobaan seluruh segmen = 40 detik tertagih, sekitar $8.228 dengan harga normal, sebelum gambar referensi atau tambahan lain. Harga publik ini bukan quote akun MCP: kredit connector dan USD API dicatat terpisah, tanpa konversi tebakan.

Kurs Rp17.000/USD hanya asumsi sensitivitas, bukan kurs terkini. Semua angka berikut asumsi: LLM+naskah/caption Rp15.000, VO Rp5.000, render/storage Rp8.000, aset/lisensi Rp10.000, operator/QC Rp45.000, cadangan koreksi 20% subtotal produksi; payment 3% dari penjualan. Alokasi hosting/support tetap masih harus ditambahkan. Biaya pajak/FX vendor belum terukur.

## Simulasi satu video, 20 detik presenter, dua percobaan

| Jalur | Presenter | Produksi lain | Cadangan 20% | Payment pada Rp350rb | Total estimasi | Kontribusi sebelum overhead tetap/pajak |
|---|---:|---:|---:|---:|---:|---:|
| HeyGen Avatar III $0.99/min | Rp11.220 | Rp83.000 | Rp18.844 | Rp10.500 | Rp123.564 | Rp226.436 / 64.7% |
| HeyGen Avatar IV Photo $2.31/min | Rp26.180 | Rp83.000 | Rp21.836 | Rp10.500 | Rp141.516 | Rp208.484 / 59.6% |
| HeyGen Avatar IV Studio $4.83/min | Rp54.740 | Rp83.000 | Rp27.548 | Rp10.500 | Rp175.788 | Rp174.212 / 49.8% |
| Higgsfield Seedance, normal $0.2057/s | Rp139.876 | Rp83.000 | Rp44.575 | Rp10.500 | Rp277.951 | Rp72.049 / 20.6% |

Setup Photo Avatar $1.32 (Rp22.440 asumsi kurs) belum dalam tabel: bila khusus satu order, dengan cadangan menambah Rp26.928; bila digunakan ulang, alokasikan secara transparan. Jangan menggunakan biaya promo/free trial untuk menetapkan tarif permanen. Harga murah tidak menjamin kualitas Bahasa Indonesia/lip-sync.

## Keputusan sementara

Rp350.000 masuk akal untuk versi standar terkontrol dengan presenter pendek dan motion berbasis template, jika biaya total termasuk overhead yang dialokasikan tetap <=Rp175.000 untuk target kontribusi 50%. Angka 50% adalah usulan target usaha, bukan fakta margin industri. Rp350.000 adalah pendapatan pelanggan, bukan budget $20 untuk dihabiskan pada API.

Paket 5 harga Rp250.000/item dan 10 harga Rp200.000/item membutuhkan biaya total <=Rp125.000 dan <=Rp100.000/item untuk target 50%. Dengan asumsi contoh III biaya produksi sebelum payment Rp113.064, pada paket 5 total Rp120.564 dan paket 10 Rp119.064: kontribusi sekitar 51.8% dan 40.5%, sebelum overhead tetap/pajak. Batch harus menunjukkan penghematan nyata; harga lama tidak otomatis mencakup SKU avatar 60 detik. Seedance premium tidak cocok dipaksa ke Rp200.000/item dalam skenario ini.

## PAYG pelanggan dan metering internal

Quote pelanggan = produksi dasar menurut durasi/kompleksitas + penulisan naskah bila baru + aset layanan yang dipilih + VO bila dipilih + presenter menurut detik/mesin + footage AI menurut detik/kelas + lisensi tambahan. Caption standar bagian produksi dasar; naskah klien yang siap pakai tidak ditagih sebagai penulisan baru. Aset klien tidak dikenai penyediaan footage, tetapi penataan/render/QC tetap ada.

Pisahkan VO off-screen dari ucapan presenter. Audio native presenter tidak otomatis ditagih lagi sebagai ElevenLabs pada segmen yang sama. Konsistensi suara antarbagian harus diuji; bila satu suara ElevenLabs harus dipakai sepanjang video, avatar perlu menerima audio tersebut dan quote endpoint lip-sync yang sesuai. Tidak semua preset MCP tersedia sebagai API produksi aplikasi.

Biaya retry internal untuk memperbaiki cacat layanan menjadi biaya layanan, bukan biaya pelanggan mendadak. Perubahan konsep/voice/durasi setelah persetujuan diberi quote baru sebelum eksekusi. Checkout membekukan spesifikasi, harga rupiah dan batas produksi; cost cap menghentikan eskalasi biaya untuk penanganan operator. Ledger menyimpan billed seconds setiap kandidat, biaya gagal, karakter VO, token dan menit QC.

## Pilot nyata

Runtime Higgsedit/FFmpeg/transkripsi connector sudah lolos preflight; ini belum membuktikan seluruh pipeline aplikasi. Presenter dan gaya visual masih menunggu pilihan pengguna. Jalur Higgsfield AI Host memakai ucapan native, sehingga hasilnya tidak dianggap telah menguji ElevenLabs/HeyGen. Biaya aktual baru diisi setelah receipt generasi, render, pemeriksaan suara dan koreksi tersedia.
