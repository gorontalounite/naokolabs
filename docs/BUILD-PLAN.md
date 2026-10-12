# Tahapan build dashboard Naoko Labs

Dibuat 11 Oktober 2026, diperbarui 12 Oktober 2026. Aplikasi dibangun di repo `gorontalounite/naokolabs` (landing page di `/`, dashboard di `/app`).

## Urutan terbaru — 12 Oktober 2026

Menggantikan urutan tahap 0–13 di bawah untuk prioritas pengerjaan. Isi tiap tahap tetap menjadi acuan teknis. Dasar: [DECISIONS](DECISIONS.md) D-11–D-15.

| Urutan | Pekerjaan | Status |
|---|---|---|
| A | Dashboard Studio Video (UI, data contoh): Studio (ide singkat → brief & storyboard, D-18), detail video, Ide Konten, Katalog Gaya, Riwayat, Panduan, Paket, Pengaturan & Brand Kit. Jadwal & Auto-Post dikeluarkan dari MVP (D-19) | Selesai sebagai pratinjau |
| B | Penyesuaian dokumen ke video-first + langganan | Dikerjakan |
| C | Planner AI sungguhan (Anthropic, D-17): link/naskah/ide → naskah, storyboard, caption tervalidasi | Belakangan, perlu otorisasi biaya API |
| D | Produksi satu video sungguhan (VO + render satu gaya, misalnya Motion Graphic) dan catat biaya nyata | Belakangan, perlu otorisasi biaya API |
| E | Uji biaya → pemilik menetapkan harga dan kuota paket langganan | Setelah D |
| F | Penyimpanan per akun (brief, brand kit, aset, video), langganan + kuota, payment | Setelah E |
| G | Login klien diaktifkan (hapus `AUTH_REQUIRED=false`), posting medsos, admin/operator | Terakhir |
| H | Landing page publik diperbarui | Paling akhir |

Login (tahap 3 lama) dipindah ke akhir atas keputusan pemilik. Kode login dan migrasi workspace sudah ada; selama pengembangan `/app` dibuka tanpa login dengan data contoh. Cabang carousel di tahap 7–10 menjadi tahap berikutnya setelah video berjalan.

## Tahapan produksi video — 13 Oktober 2026 (D-23)

Urutan D–F di atas diuraikan menjadi tahap P1–P7. Alur Studio: **tulis ide → (opsional) footage, voice-over, backsound → storyboard → setujui → produksi → unduh**. Gaya (Motion Graphic atau Explainer) dipilih planner, bukan pelanggan.

| Tahap | Pekerjaan | Hasil yang bisa diperiksa | Status |
|---|---|---|---|
| P1 | Studio tiga langkah; planner memilih gaya; storyboard sebagai panduan | Studio tanpa langkah gaya; `plan.style` terisi | Selesai |
| P2 | **Komposisi Remotion dari storyboard**: JSON adegan → komponen React (teks kinetik, bentuk, kartu, diagram, footage) per gaya; pratinjau di browser dengan `@remotion/player` | Storyboard tampil sebagai video 1080×1920 tanpa suara di halaman video | Selesai untuk teks, bentuk, kartu, diagram; slot footage ada tapi belum tersambung (P5) |
| P3 | **Render MP4** lewat GitHub Actions (D-24): workflow `render` menerima spesifikasi video (JSON), merender dengan Remotion + FFmpeg, mengunggah MP4 ke Supabase Storage | MP4 dari storyboard contoh, durasi tepat | Berikutnya |
| P4 | **Suara**: ElevenLabs TTS per adegan (durasi adegan mengikuti audio), voice-over unggahan, backsound dengan ducking | MP4 bersuara; durasi per adegan cocok dengan audio | Setelah P3 |
| P5 | **Footage**: unggah ke Supabase Storage (bucket privat `footage`, URL bertanda tangan dari server), dipakai di komposisi | Footage pelanggan tampil di pratinjau dan MP4 | Selesai di kode; perlu migrasi dan `SUPABASE_SERVICE_ROLE_KEY` |
| P6 | **Antrean dan status**: tombol Produksi membuat pekerjaan, progres nyata, hasil bisa diunduh, perbaikan | Dari klik Produksi sampai unduh MP4 | Setelah P4 dan P5 |
| P7 | Biaya nyata per video (token Claude, karakter ElevenLabs, waktu render) dicatat | Tabel biaya per video, dasar harga paket | Setelah P6 |

Tempat render diputuskan: **GitHub Actions** (D-24), karena rendering tidak bisa berjalan di fungsi Vercel biasa. Konsekuensi: waktu tunggu beberapa menit per video (antrean runner + install + render), batas menit gratis per bulan, dan aplikasi memicu workflow lewat GitHub API dengan token terbatas yang disimpan sebagai secret Vercel.

## Stack yang telah diusulkan

Next.js/React + TypeScript untuk web/backend aplikasi; PostgreSQL dengan Supabase sebagai kandidat Auth/Database/Storage; Remotion + FFmpeg pada worker Node/container terpisah untuk render. Workflow/queue dan hosting belum dikunci. Tidak ada keputusan pengguna sebelumnya yang menetapkan versi paket atau semua vendor final.

Baseline yang direkomendasikan untuk build: Next.js App Router + TypeScript; Supabase Auth/PostgreSQL/Storage; Remotion + FFmpeg; Trigger.dev sebagai kandidat workflow; Midtrans sandbox untuk payment; Resend untuk email. Vercel sebagai kandidat hosting web; worker render/container dipilih sesudah uji compute dan biaya. UI component/styling library dipilih saat scaffold setelah desain dasar, bukan dianggap sudah disepakati.

API produksi: Anthropic untuk planner dan komposisi (D-17), ElevenLabs untuk VO, Higgsfield untuk media generatif, HeyGen untuk presenter sesuai jalur terpilih. Canva opsional. Instagram/FB Pages/TikTok menjadi modul publishing berikutnya; Ads ditunda. Provider SDK langsung melalui adapter tervalidasi cukup untuk awal; framework multi-agent tambahan tidak wajib.

## Aturan menjalankan tahapan

Selesaikan satu alur yang bisa diperiksa sebelum menambah fitur. Catat hasil, bukti cek, keputusan terbuka dan risiko pada setiap tahap. Gunakan mock/fixture berlabel untuk UI/integrasi awal; tidak mengklaim mock sebagai produksi. Eksekusi contoh konten dan pemanggilan AI/media berbayar tetap dihentikan sesuai arahan terakhir pengguna; pengujian produksi nyata menjadi gerbang kemudian, bukan otorisasi otomatis dari roadmap ini.

Tahap tidak memiliki estimasi hari sampai kapasitas tim, akses layanan, dan scope final ditentukan. Setup berbayar, akun, deployment publik dan generasi tidak dilakukan oleh penulisan dokumen ini.

## 0 — Kontrak build dan cakupan MVP

Tugas: kunci baseline stack, roles client/operator/admin, jenis konten yang aktif (video dulu), batas upload/retensi, durasi 15/30/60 detik dan hitungan kuotanya, harga dan kuota paket langganan, serta batas perencanaan/revisi. Pisahkan tahap siap produksi dari premium/quote. Backend pricing engine tidak mengandalkan keputusan LLM.

Hasil: decision log dan backlog bernomor. Gerbang: detail belum disahkan tetap jelas TBD; UI dapat dibangun dengan harga draf, checkout pelanggan nyata belum aktif.

## 1 — Repository dan fondasi pengembangan

Selesai dengan perubahan: aplikasi dibangun di repo `naokolabs` yang sama (landing `/` + dashboard `/app`), Next.js standar di Vercel, dokumentasi di `docs/`. Sisa: AGENTS.md, aturan CI, folder worker.

Hasil: aplikasi lokal dapat dibuka dan build berhasil. Gerbang: perintah dalam README benar-benar dapat dijalankan; tidak ada kredensial dalam repo. Git remote dan layanan cloud belum diasumsikan.

## 2 — Kerangka dashboard mobile

Tugas: design tokens, navigasi, daftar order, wizard brief, storyboard, preview/revisi, hasil, CMS admin, dan kalender. Gunakan data fixture yang diberi label. Rancang empty/loading/error states, keyboard dan ukuran sentuh; uji 360/390 px serta desktop.

Hasil: alur dapat ditelusuri dari ponsel. Gerbang: tidak ada scroll horizontal tak disengaja, field panjang/error terbaca, upload/preview/navigation dapat dipakai.

## 3 — Login, database dan pemisahan klien

Tugas: provisioning lingkungan development, migrations, users/organizations/memberships/brands, login/reset/session dan kebijakan akses database/storage. Tentukan pemilik brand dan hak operator. Siapkan backup/restore sesuai lingkungan.

Hasil: data persisten dan role-aware. Gerbang: dua workspace diuji dengan akses sah/tidak sah, termasuk URL langsung dan server endpoint; login bukan satu-satunya kontrol.

## 4 — Brief, upload dan brand kit

Tugas: simpan brief version, logo/warna/font, pilihan jenis/durasi/paket/VO/presenter/aset; upload privat gambar/video/audio/PDF/CSV; validasi file, probe media, ekstraksi teks dan mapping CSV dengan preview. Batas ukuran/ragam file tersedia sebelum upload.

Hasil: draft dapat ditutup/dibuka kembali. Gerbang: input hilang/tidak didukung ditangani, source/timecode tersedia, file tidak dapat dibaca klien lain.

## 5 — CMS katalog, referensi, template dan prompt

Tugas: CRUD katalog/harga, capability aktif, pustaka referensi berizin, parameter template, prompt profiles terversi, dan status draft/active/retired. Referensi dapat dicatat tanpa menjalankan contoh; contoh final hanya ditambahkan saat diotorisasi dan terverifikasi.

Hasil: planner/preview memakai registry yang jelas. Gerbang: perubahan CMS tidak mengubah snapshot order; tidak mengiklankan template belum teruji sebagai capability siap.

## 6 — Langganan, kuota dan payment sandbox

Tugas (menggantikan quote PAYG, D-14): paket langganan terversi, saldo kuota per periode, pemakaian kuota saat produksi dimulai, pengembalian kuota bila produksi gagal karena sistem, tagihan berulang atau perpanjangan manual (Midtrans/Xendit belum dipilih), verified webhook, deduplication, jalur gagal bayar/kedaluwarsa. Penawaran harga gaya premium tetap ditampilkan sebelum produksi.

Hasil: order paid sandbox tercatat sekali. Gerbang: webhook duplikat/tidak valid tidak memulai kerja ganda; nominal/order cocok; refund/failure policy disiapkan sebelum transaksi nyata.

## 7 — Planner terstruktur

Tugas: schema brief → strategy/script/caption/scenes/slides; validasi source facts, template capability, assets dan missing inputs. Mulai adapter fixture untuk menguji kontrak; aktifkan Claude (Anthropic) nyata pada fase yang diotorisasi, dengan cost cap dan usage ledger. Pisahkan instruksi sistem dari data upload.

Hasil: draft rencana persisten dan editable. Gerbang: schema tidak valid, fakta tanpa sumber dan kebutuhan aset ditangani; AI tidak mengesahkan payment/approval atau harga.

## 8 — Storyboard visual, preview dan approval

Tugas: kartu scene/slide, asset binding/crop, naskah persis, gerak/timing, keyframe/layout, animatic sesuai capability, placeholder label, komentar per scene/slide dan version diff. Approval mengikat manifest/hash dan quote version.

Hasil: pelanggan dapat memahami dan memperbaiki rencana sebelum produksi. Gerbang: perubahan berarti menginvalidasi approval; server menolak produksi versi belum approved; preview berasal dari manifest/template yang sama.

## 9 — Workflow dan worker produksi

Tugas: antrean durable, outbox/dispatch, lease/checkpoint, adapter provider, budget reservation dan reconciliation. Bangun rendering template terkendali, audio measurement/alignment dan hasil/caption privat. Carousel memakai still export; video memakai timing audio yang diukur. Tambahkan jalur avatar/generative media sesuai pilihan, tidak semua provider per order.

Hasil: job berjalan ketika browser ditutup dan dapat dipulihkan. Gerbang: retry hanya tahap terdampak, timeout tidak memicu spending ganda, usage tercatat. Uji provider/generasi nyata menunggu otorisasi setelah pause contoh; belum cukup hanya mock untuk menjual otomatisasi.

## 10 — QC, feedback dan delivery

Tugas: periksa output terhadap approved manifest, putar/dengar video penuh, inspect semua slide di ponsel, catat defect/timestamp; typo/media/VO correction; artefak/caption version, download dan approval hasil. Ukur menit operator dan biaya koreksi.

Hasil: konten sesuai rencana dengan bukti kualitas. Gerbang: output tidak berubah diam-diam pada versi accepted; perubahan konsep dan cacat layanan dibedakan; kualitas/HPP terukur sebelum dijual.

## 11 — Posting dan penjadwalan (setelah MVP, D-19)

Tugas: integrasikan satu platform dahulu, lalu platform berikutnya; OAuth/scope/capability per akun; app review/audit; konfirmasi versi/caption/platform/timezone; scheduler server; reconnect, cancel, status reconciliation dan fallback download/manual.

Hasil: posting sekarang dan jadwal tidak bergantung browser aktif. Gerbang: provider mengonfirmasi posting; double dispatch/timeout diuji; eligibility platform tidak diasumsikan. Approval produksi bukan izin publikasi.

## 12 — Uji end-to-end dan kelayakan tarif

Tugas: login → brief → quote/payment → plan/preview → approval → render/QC → revisi/download → publish. Uji mobile, akses tenant, budget, event berulang, job crash, token expired, restore serta observability. Ukur harga penuh versus paket 5/10 memakai biaya aktual pada pengujian yang kemudian diotorisasi.

Hasil: release checklist dengan bukti. Gerbang: tidak ada klaim margin dari simulasi saja; SKU yang belum lulus tetap nonaktif/quote. Jangan memperluas batch sebelum kualitas representatif teruji.

## 13 — Staging, peluncuran terbatas dan operasi

Tugas: staging terpisah, production secrets, migrations, storage policy, callback domain, email sender/domain, payment production, alert, backup, retention, rollback dan runbook operator. Deploy web dan worker secara terpisah sesuai kebutuhan. Jalankan kelompok klien terbatas setelah gerbang kualitas/biaya dan izin layanan lulus.

Hasil: layanan dapat dioperasikan, support/failure recovery jelas. Gerbang: preview/staging diverifikasi sebelum rilis publik; pantau biaya, failure, kualitas, waktu dan koreksi; perluas layanan hanya setelah data mendukung.

## Langkah pertama yang konkret

Pindahkan dan verifikasi dokumentasi; lalu jadikan Next.js/TypeScript + Supabase + Remotion/FFmpeg sebagai baseline yang ditinjau, buat backlog tahap 0–2 dan scaffold repo aplikasi terpisah. Jangan langsung memasang semua API atau membuat contoh produksi. Penulisan roadmap ini belum membuat scaffold; next implementation unit adalah fondasi repository dan kerangka UI.

Referensi: [Next.js](https://nextjs.org/docs), [Supabase](https://supabase.com/docs), [Remotion renderer](https://www.remotion.dev/docs/renderer), [Trigger.dev](https://trigger.dev/docs/introduction). Versi dependency diverifikasi saat scaffold, bukan dikunci dari asumsi.
