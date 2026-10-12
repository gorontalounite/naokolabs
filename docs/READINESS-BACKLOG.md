# Kelengkapan sebelum implementasi dan peluncuran

Status: BACKLOG DAN OUTLINE v0.3 — 11 Oktober 2026. Tidak semua bagian membutuhkan file baru; perluas dokumen yang sudah menjadi sumber utama agar tidak duplikatif.

| Prioritas | Yang disusun/dilengkapi | Lokasi utama | Bukti selesai |
|---|---|---|---|
| P0 | Service catalog dan definisi fullset/premium | FULLSET-SPEC + BRD | Unit, batas, output dan komponen jelas untuk setiap SKU |
| P0 | Matriks PAYG, quantity tiers, add-on dan quote | PAYG-PRICING | Kalkulasi server, contoh kombinasi dan harga snapshot disepakati |
| P0 | Pilot HPP dan quality gate | PILOT-PROTOCOL + PILOT-COST-REPORT | Hasil nyata, usage/receipt, menit operator, margin dan defect |
| P0 | Peran dan matriks hak akses | DATA-MODEL + PRD | Siapa boleh bayar/approve/koneksi akun/post/support terdefinisi dan dapat diuji |
| P0 | Business rules payment/revisi/cancel/refund | BUSINESS-RULES | Kasus sebelum/sesudah payment/approval, biaya dan tanggung jawab jelas |
| P0 | Kontrak brief/script/storyboard/slide/caption | PRD + WORKFLOW | Field, schema, versi, approval dan validasi sumber/output tersedia |
| P0 | Flow dan wireframe mobile | UI-UX | Seluruh alur ponsel dapat diperiksa dengan data contoh |
| P0 | Data dictionary dan status transitions | DATA-MODEL + WORKFLOW | Field/relasi/constraint/event dan permissions dapat diimplementasi |
| P0 | Kontrak API dan webhook per provider | INTEGRATIONS | Request/response/timeout/retry/idempotency/reconciliation + proof akun |
| P1 | Template/prompt/skill registry | SKILLS + ARD | Version, trigger, input/output, tool permissions, eval dan rollback |
| P1 | Brand/assets governance | PRD + BUSINESS-RULES | Hak penggunaan, allowed uploads, metadata, retensi dan penghapusan |
| P1 | Operasional produksi/QC/support | WORKFLOW + DEPLOYMENT | Eskalasi job gagal, budget stop, SLA terukur dan operator ownership |
| P1 | Publikasi sosial | INTEGRATIONS + TESTING | Akun/capability/izin/review, consent UI, token lifecycle dan status nyata |
| P1 | Legal/customer policy | BUSINESS-RULES dan halaman kebijakan kelak | Terms, privacy, hak aset dan cancellation disetujui pemilik; kajian hukum bila diperlukan |
| P1 | Observability dan cost alerts | ARD + DEPLOYMENT | Log aman, tracing, spend per item/provider, stuck jobs dan alert |
| P1 | Test plan dan release gates | TESTING + DEPLOYMENT | Browser/mobile, payment, tenant, media, restore, rollout/rollback |
| P2 | Layanan website/iklan | BRD modul terpisah | Scope/price/flow baru, tidak mengganggu layanan konten |

## Matriks peran awal — usulan

Client owner: kelola brand/anggota sesuai batas; buat/bayar order; approve rencana/hasil; koneksi akun; konfirmasi posting/schedule. Client member: buat draft/unggah/feedback; approval/payment/publishing hanya bila diberi hak. Operator: produksi/QC/support atas assignment; tidak otomatis boleh belanja atau publikasi akun klien. Admin: konfigurasi tarif/template/provider, kelola operasional; akses lintas klien dibatasi dan diaudit.

Login/account category tidak memberikan semua hak. Public API dan worker memeriksa organisasi serta membership untuk objek terkait. Final role matrix perlu mendefinisikan grant per action, bukan hanya nama peran.

## Kontrak konten minimum

Brief: brand/campaign, goal, audience, sources, asset IDs, format/style, duration/slides, components, pricing profile, CTA, do/don't, pronunciation, rights confirmation.

Plan: script/scene/slide IDs, copy/VO, media binding, timing/estimated timing, notes, sources, caption, output spec. Approval: actor/time, exact version/hash, scope dan status.

Production result: artifact versions/paths, actual timing/dimensions, caption, usage, QC findings dan correction history. Publish intent: artifact/caption version, account/platform, timezone/time, privacy/options dan explicit confirmation.

## Kontrak integrasi minimum

Provider adapter: auth/capabilities/model version; input/output schema; request and callback verification; poll/status; billing meter; timeout; retryable errors; idempotency key where supported; reconciliation after ambiguous result; budget cap; token/asset expiry; deletion/retention; redacted logs. Lengkapi kontrak untuk vendor yang benar-benar dipilih, bukan mengarang endpoint.

## Urutan praktis

Bekukan baseline pilot → jalankan contoh nyata → putuskan tariff/profile → selesaikan role/business rules/schema → buat wireframe mobile → proof integrasi kritis → implementasi satu alur lengkap → uji/release. Bagian yang independen bisa disusun sembari menunggu pilot; keputusan komersial final tidak ditebak dari simulasi.

## Tambahan sebelum menjual SKU presenter 60s

1. Pilih presenter/gaya dan selesaikan pilot video Ruang Sela; dengarkan semua ucapan dan inspeksi render ponsel.
2. Catat biaya setiap kandidat/gagal, biaya avatar setup, karakter VO, token, render/storage dan menit operator.
3. Uji konsistensi suara antara presenter dan VO; native Higgsfield tidak otomatis sama dengan ElevenLabs.
4. Tentukan batas aset standar, footage AI premium, durasi presenter, koreksi dan retention/download.
5. Uji batch 5/10 sebelum memperluas diskon ke SKU 60s dengan avatar.
6. Validasi akses API backend Higgsfield secara terpisah dari plugin MCP; webhook, concurrency dan expiry media.
7. Tetapkan cost cap, estimasi checkout, rekonsiliasi usage, refund/failure recovery, dan approval publikasi.

## Sebelum membangun planner dan preview

Tetapkan spesifikasi jenis prioritas, kumpulkan referensi berizin, anotasi komposisi/gerak, definisikan parameter template, kontrak manifest, preview level dan biaya praproduksi. Tetapkan allowance penyesuaian rencana dan approval snapshot. Implementasikan planner → validator → preview → revisi rencana → approval → produksi → QC terhadap manifest. Dokumentasi siap; contoh belum diotorisasi untuk dieksekusi.
