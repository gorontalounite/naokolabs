# Roadmap yang diusulkan

Status: DRAF; urutan implementasi, bukan penghapusan layanan dari visi produk. Durasi kalender belum ditetapkan.

| Tahap | Pekerjaan | Gerbang selesai |
|---|---|---|
| 0 — spesifikasi dan validasi | Tetapkan envelope fullset, komponen/tier PAYG satuan/5/10 dan HPP, alur/roles, satu contoh Reels dan satu Carousel, uji provider/render | Kualitas, waktu, biaya dan akses API terukur; keputusan komersial cukup untuk checkout |
| 1 — fondasi | Login, workspace/brand, form, upload, CMS harga/referensi, order dan payment sandbox | Isolasi klien, snapshot harga, webhook/deduplikasi lolos |
| 2 — produksi | Rencana, approval versi, worker OpenAI/ElevenLabs/Anthropic/Remotion, hasil/caption, revisi | Alur lengkap dan recovery diuji; media benar-benar diinspeksi |
| 3 — publishing | OAuth, capability per akun, publish sekarang, scheduler, status/reconnect/reconciliation | Kanal yang dipilih lolos proof of integration dan review/audit yang diperlukan |
| 4 — perluasan | Canva, HeyGen, Kling/Seedance sesuai kebutuhan; copywriting terpisah; perluasan tipe/premium PAYG setelah pilot | Tiap tambahan punya pilot kualitas/biaya dan kontrak API |
| 5 — layanan lanjutan | Produksi website terintegrasi dan pengelolaan iklan bila pengguna mengaktifkan kembali | BRD/PRD/ARD modul terpisah dan otorisasi baru |

Prioritas pilot dapat dimulai carousel untuk menguji checkout/approval/render dengan dependensi lebih sedikit; video diuji pada tahap yang sama sebelum menjual kemampuan video. Jangan menunggu seluruh API tersedia untuk membuktikan alur inti, dan jangan menjual otomatisasi yang belum teruji.

## Rencana build terbaru

Gunakan [BUILD-PLAN](BUILD-PLAN.md) sebagai urutan pelaksanaan rinci. Pembuatan contoh saat ini dihentikan pengguna; fondasi/UI/kontrak adapter dapat dikerjakan memakai fixture berlabel, sedangkan gerbang produksi nyata harus selesai sebelum fitur dijual. Dokumen ini tidak mengotorisasi contoh atau spending baru.
