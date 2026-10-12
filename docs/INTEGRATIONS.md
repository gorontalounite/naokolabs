# Integrasi API dan kelayakan

Status: DRAF; sumber publik dibuka 11 Oktober 2026. Belum menguji kredensial, saldo, izin, atau akses akun pemilik. Nama model/fitur publik bukan jaminan akses akun.

## Peta integrasi

| Integrasi | Fungsi | Tahap/usulan | Catatan |
|---|---|---|---|
| Anthropic | Strategi, script, storyboard, caption, komposisi (D-17; OpenAI tidak dipakai) | Inti | Model planner: claude-opus-5-5 dengan structured output |
| Anthropic | Komposisi/kode Remotion, bantuan produksi | Inti | Claude Opus 5.5, ID claude-opus-5-5; tetap memerlukan harness dan renderer |
| ElevenLabs | Voice over | Inti video | Pilih model/voice setelah uji Bahasa Indonesia dan pronunciation |
| Payment gateway | Checkout dan status transaksi | Inti | Midtrans atau Xendit sebagai kandidat, belum dipilih |
| Auth | Login/session | Inti | Supabase Auth sebagai kandidat |
| Storage | Upload/output media privat | Inti | Supabase Storage atau object storage setara; belum dipilih |
| Email transactional | Verifikasi dan pemberitahuan hasil/gagal | Usulan pendukung | Pilih satu provider |
| Instagram publishing | Reels/carousel sesuai akun/izin | Tahap publishing | Pilih jalur login, format, scope dan app review setelah proof of integration |
| Facebook Pages publishing | Posting ke Page berwenang | Tahap publishing | Tidak diasumsikan bisa ke semua profil pribadi/format |
| TikTok Content Posting | Video/foto sesuai capability | Tahap publishing | OAuth, scope, UX dan audit aplikasi |
| Canva | Template, autofill, export/editable design | Opsional | Perlu akun dan scope yang sesuai fitur |
| HeyGen | Presenter/avatar singkat | Kandidat standar video 60s | Harga mesin publik diperiksa; akses akun, suara Indonesia dan lip-sync belum diuji |
| Higgsfield API | Gambar/footage AI/presenter sesuai model | Ditambahkan; adapter media | Jalur Kling/Seedance melalui satu provider bila endpoint sesuai; MCP/preset tidak otomatis sama dengan API backend |
| Kling | Footage generatif | Opsional | Vendor resmi/aggregator dan endpoint belum dipilih |
| Seedance | Footage generatif | Opsional | Penyedia/versi model dan endpoint belum dipilih |
| Observability | Error, metrik dan job tracing | Usulan pendukung | Pilih satu provider, hapus rahasia dari telemetry |

Ini daftar koneksi logis; Auth/Storage dapat berasal dari provider yang sama. Jumlah provider, API product, dan endpoint berbeda. Lebih dari 10 bukan alasan memanggil semuanya pada satu konten. Remotion adalah library/render runtime, bukan saldo API model.

## Verifikasi publik

- OpenAI tidak dipakai sejak D-17 (Anthropic saja untuk planner).
- [Anthropic models](https://platform.claude.com/docs/en/models/overview): Claude Opus 5.5 dan ID API tersedia dalam katalog. Tidak mengganti dengan model lain tanpa keputusan.
- [ElevenLabs speech with timing](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps/): menyediakan audio dan alignment; dukungan tergantung model/fitur. Perlu uji timing dan pengucapan secara nyata.
- [TikTok direct post](https://developers.tiktok.com/docs/en/content-posting-api-get-started): scope video.publish memerlukan persetujuan dan otorisasi pengguna; client unaudited dibatasi private viewing. [Sharing guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines) menentukan UX dan kelayakan. Audit bukan jaminan lolos; desain produk harus sesuai tujuan yang diperbolehkan.
- [Canva autofill](https://www.canva.dev/docs/apps/rest-apis/autofill-guide/): fitur tersedia pada plan yang mendukung, termasuk Pro/Teams/Enterprise; scope dan template diperlukan. Tidak menganggap semua akun gratis dapat autofill.
- [Remotion renderer](https://www.remotion.dev/docs/renderer) dan [license/pricing](https://www.remotion.dev/docs/license/pricing): render dan lisensi harus diperhitungkan terpisah dari token Anthropic.
- [Midtrans HTTP notifications](https://docs.midtrans.com/docs/https-notification-webhooks): contoh vendor payment dengan verifikasi notification dan penanganan idempotent; vendor final belum dipilih.

Dokumentasi Meta yang dicoba tidak berhasil dibuka melalui alat pencarian pada sesi ini. Detail akun/scope/review/format Instagram dan Facebook belum dikunci; verifikasi resmi wajib sebelum menjanjikan fitur publikasi. Harga publik HeyGen dan Higgsfield telah diperiksa untuk SKU presenter 60s; parameter, izin, suara dan biaya akun nyata belum diverifikasi. Lihat [analisis 60s](VIDEO-60S-AVATAR-ECONOMICS.md).

## Kontrak adapter setiap provider

Nama, purpose, API version, model ID, capability, scope, mode auth, secret location, input schema, output schema, biaya estimasi, rate/concurrency limit, timeout, callback atau polling, provider request ID, retryable errors, idempotency, reconciliation, dan expiry aset/token.

Hasil adapter menyertakan status internal, request ID, artefak, penggunaan, error code tanpa rahasia, dan waktu. Provider payload mentah hanya disimpan bila perlu dengan redaksi dan retensi.

## Anggaran awal

Pengguna menyebut $20 masing-masing untuk OpenAI, Anthropic, ElevenLabs, HeyGen, Kling/Seedance. Jika Kling/Seedance satu pos gabungan, total rencana saldo = $100. Jika keduanya terpisah, total = $120. Interpretasi belum final; tidak menganggap top-up minimum atau subscription tiap vendor sama.

Biaya per konten = LLM + TTS + media generatif opsional + render + storage/transfer + payment + biaya koreksi + biaya lisensi/operasional yang dialokasikan. Canva/domain/hosting belum masuk saldo tersebut. Uji beberapa contoh lengkap sebelum menilai kelayakan margin Rp350.000.

## Referensi Higgsfield dan dampak PAYG

Referensi [MCP/catalog](https://higgsfield.ai/mcp?tab=chatgpt) dibuka untuk analisis jenis produksi, bukan instalasi plugin atau skill. Halaman [API](https://higgsfield.ai/higgsfield-api) menampilkan katalog endpoint model dan harga yang bervariasi; ini calon jalur integrasi Kling/Seedance melalui Higgsfield, belum keputusan vendor. Tarif/limit nyata tiap endpoint dan akses akun perlu proof of integration. Workflow Adobe/Blender/UGC tidak otomatis seluruhnya tersedia sebagai backend API yang sama. Simulasi biaya dan pemisahan tagihan pelanggan dari metering internal ada di [PAYG](PAYG-PRICING.md).

## Kebutuhan tambahan untuk MVP

- Database tenant/client/order/approval/usage, dengan isolasi akses antar klien. Dapat satu platform dengan Auth/Storage; bukan tiga vendor wajib.
- Queue/workflow tahan gangguan: pembayaran dan pekerjaan AI berjalan asinkron, resume dari langkah terakhir, retry terbatas dan idempotent. Worker renderer terpisah dari request halaman dashboard. Tidak wajib API vendor tambahan bila runtime menyediakan.
- Transactional email untuk login/status hasil, satu provider yang dipilih.
- Payment gateway rupiah + verified webhook, satu provider yang dipilih; job hanya mulai setelah status paid benar.
- Logging/error monitoring dan cost ledger per job/provider. API key hanya di server.
- Instagram, Facebook Pages, TikTok publishing via OAuth; penjadwal internal memanggil API saat waktunya. Posting menunggu persetujuan terpisah. Tidak ada Ads API pada MVP.
- Ekstraksi PDF/CSV, scan upload, probe media dan transkripsi/alignment diperlukan sebagai kemampuan; bisa library/worker, bukan masing-masing langganan API.

Untuk satu konten, gunakan Anthropic untuk rencana/naskah dan komposisi (D-17), renderer untuk hasil, ElevenLabs untuk VO, lalu satu jalur avatar/media yang dipilih. Hindari memanggil HeyGen dan Higgsfield untuk segmen yang sama tanpa kebutuhan. Canva, HeyGen, footage premium dan platform publishing dapat diaktifkan per fitur. Skill aplikasi dipasang pada tahap implementasi, bukan dokumen ini.

[HeyGen PAYG](https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained) dan [Higgsfield API](https://higgsfield.ai/higgsfield-api) adalah sumber harga publik; bukan bukti kredensial atau akses produksi.

## Daftar konkret yang perlu disediakan — klarifikasi pengguna

Eksekusi contoh dihentikan atas permintaan pengguna. Bagian ini adalah rencana integrasi; tidak memasang layanan, tidak menambahkan kredensial, dan tidak menjalankan generasi.

| Produk/kandidat | Kebutuhan | Prioritas |
|---|---|---|
| Anthropic API | Strategi, script, storyboard, caption (D-17) | Inti produksi |
| Anthropic API | Agent penyusun kode/layout motion dalam harness aplikasi | Inti jika komposisi dinamis |
| ElevenLabs API | VO, alignment/timing | Fitur VO |
| Higgsfield API | Gambar, footage dan model media yang tersedia pada katalog API | Ditambahkan, media generatif |
| HeyGen API | Talking head dengan audio/lip-sync sesuai endpoint | Fitur presenter; alternatif jalur Higgsfield, tidak wajib keduanya per item |
| Supabase Auth | Login/session/reset password/akses | Kandidat inti |
| Supabase Database/Data API | Client, order, brief, revisi, approval, harga, ledger, jadwal | Kandidat inti |
| Supabase Storage ATAU Cloudflare R2 S3 API | Upload privat dan output | Pilih satu untuk awal; R2 alternatif ketika profil media membutuhkannya |
| Midtrans | Checkout, payment status, verified webhook | Kandidat inti; pilih satu gateway, Xendit alternatif |
| Resend | Email login/invoice/status hasil/gagal | Kandidat inti |
| Instagram publishing API | OAuth, Reels/carousel, status posting | Saat fitur publikasi diaktifkan; scope/review belum diverifikasi |
| Facebook Pages API | OAuth, post/video ke Page yang diotorisasi | Saat fitur publikasi diaktifkan; scope/review belum diverifikasi |
| TikTok Content Posting API | Otorisasi, direct post/status | Saat fitur publikasi diaktifkan; audit diperlukan untuk pembatasan publikasi |
| Canva REST APIs | Template/design/export sesuai akses fitur | Opsional bila source/edit Canva menjadi kebutuhan |

Pendukung yang harus tersedia tetapi bukan selalu API vendor: renderer Remotion + worker render; queue/workflow tahan gangguan + scheduler; error monitoring; cost ledger; ekstraksi PDF/CSV; pemeriksaan upload; transkripsi/alignment. Trigger.dev adalah kandidat workflow terkelola, bukan pengganti renderer. Sentry adalah kandidat error monitoring, bukan prasyarat penambahan API key ke setiap job. CMS/form/approval/PAYG merupakan fitur internal dashboard, tidak memerlukan CMS vendor terpisah pada MVP.

Login dashboard dan izin posting akun sosial adalah otorisasi berbeda. User login dengan Google/Facebook belum memberi izin memublikasikan konten. Jadwal disimpan dan dijalankan backend, bukan bergantung dashboard tetap terbuka di ponsel. Kalender Google tidak diperlukan untuk penjadwalan internal.

Kling/Seedance terpisah hanya jika model/fitur/harga/keandalan yang diperlukan tidak tersedia pada Higgsfield API. Katalog API Higgsfield bisa berbeda dari website/plugin MCP: jangan menjanjikan semua preset/plugin menjadi endpoint backend. API stok/musik opsional setelah vendor memberi izin penggunaan komersial yang cocok; tidak menambahkan vendor hanya dari ketersediaan pencarian gambar.

Sumber: [Higgsfield quick start](https://open.higgsfield.ai/quick-start), [perbedaan katalog API](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api), [Supabase Auth](https://supabase.com/docs/guides/auth), [Database](https://supabase.com/docs/guides/database/overview), [Storage](https://supabase.com/docs/guides/storage), [R2](https://developers.cloudflare.com/r2/get-started/s3/), [Midtrans webhook](https://docs.midtrans.com/docs/https-notification-webhooks), [Resend](https://resend.com/docs/api-reference/emails/send-email), [Trigger.dev](https://trigger.dev/docs/introduction), [Canva](https://www.canva.dev/docs/apps/rest-apis/), [TikTok](https://developers.tiktok.com/docs/en/content-posting-api-get-started). Dokumentasi Meta belum berhasil dibaca; kemampuan final akun/format/scope harus diverifikasi sebelum implementasi.
