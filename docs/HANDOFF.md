# Serah terima pekerjaan — 12 Oktober 2026

Ringkasan keadaan proyek dan prompt untuk melanjutkan di sesi baru (misalnya Claude Code lokal). Baca juga `CLAUDE.md` (arahan tetap), `docs/DECISIONS.md` (D-11 sampai D-27), dan `docs/BUILD-PLAN.md`.

## Produk
NaokoLabs Studio Video: pelanggan menulis ide singkat, sistem menyusun storyboard, lalu merender video 9:16. Hanya dua gaya (Motion Graphic, Explainer), tampilan bergaya Apple (latar putih, ikon, kartu abu muda). Footage, voice-over, dan backsound opsional; default tanpa suara dan tanpa musik. Jadwal/auto-post dan Ide Konten dikeluarkan dari MVP.

## Posisi kode
- Repo `gorontalounite/naokolabs` (publik). Branch kerja: `claude` (PR #1 masih draf, isinya seluruh dashboard). PR #2 (workflow `render.yml`) sudah digabung ke `main`.
- Preview: https://naokolabs-git-claude-gorontalounitemediahub-5403s-projects.vercel.app (dilindungi login Vercel). Production `naokolabs.vercel.app` masih website lama dari `main`.
- Stack: Next.js 16 (App Router, Turbopack), React 19, Supabase (proyek NaokoLabs `gcsnfqakkrorchfaemeg`, terpisah dari Gorontalo Unite), Anthropic (`claude-opus-5-5`), ElevenLabs, Remotion 4, GitHub Actions untuk render.
- Cek kesehatan layanan: `/api/status` (planner, transcription, footage, production, dan variabel yang terbaca).

## Alur yang sudah dibangun
1. **Studio** (`components/dashboard/Studio.tsx`): ide + nada bicara, footage (foto/video, maks. 10 MB / 50 MB), voice-over (unggah dan ditranskrip ElevenLabs, atau suara AI) dan backsound (unggah). Musik pustaka dinonaktifkan (belum ada pustaka berlisensi).
2. **Planner** (`/api/rencana`, `lib/ai/`): Claude dengan structured output memilih gaya, menyusun brief, durasi 10–60 detik, storyboard, ikon per adegan; validasi di `lib/ai/validate.ts`. Tanpa `ANTHROPIC_API_KEY`: mode contoh berbasis template. `maxDuration` 300.
3. **System prompt** (`lib/ai/prompts/`): global, tahap rencana, dua gaya (`styles/`), arahan per video referensi (`reference-directions.ts`). Bacaan lengkap: `docs/STYLE-PROMPTS.md` (`npm run prompts:export`).
4. **Katalog Gaya** (`/app/gaya`): 113 video referensi dari folder Drive (87 Motion Graphic, 26 Explainer), thumbnail dari Drive, pemutar Drive, tombol Lihat prompt dan Pakai sebagai acuan. Terbuka tanpa login hanya selama `AUTH_REQUIRED=false`.
5. **Komposisi video** (`video/`): spesifikasi `VideoSpec`, komposisi Remotion dua gaya, pratinjau `@remotion/player` di halaman video.
6. **Footage** (P5): bucket privat `footage`, URL unggah/baca bertanda tangan dari server (`/api/aset/*`).
7. **Produksi** (P3, P4, P6): `/api/produksi` menyimpan pekerjaan di bucket `produksi` dan memicu `.github/workflows/render.yml`; worker (`scripts/job.ts`, `scripts/render.ts`, `scripts/audio.ts`) merender, TTS ElevenLabs per adegan, mencampur backsound dengan ducking, mengunggah MP4; dashboard memantau lewat `/api/produksi/[id]`.

## Yang sudah teruji
Render lokal MP4 1080×1920 (kedua gaya, dengan footage dan audio nada); run GitHub Actions uji berhasil (±75 detik); skrip worker terhadap Supabase tiruan; UI dengan API tiruan; `/api/status` menunjukkan `footage:true`, `production:true` di preview.

## Belum teruji / belum selesai
1. **Produksi sungguhan end-to-end** (aplikasi → GitHub → Supabase → MP4 yang bisa diputar dan diunduh). Ditunda karena kredit sesi cloud habis.
2. **Suara ElevenLabs asli** (pemilihan suara, model `eleven_multilingual_v2`, durasi adegan menyesuaikan audio) dan **transkripsi** (`scribe_v2`, mungkin perlu `ELEVENLABS_STT_MODEL=scribe_v1`).
3. **Unggahan footage ke Supabase asli** dari Studio.
4. **Backsound yang lebih pendek dari video**: pengulangan belum diverifikasi.
5. **Login** belum berfungsi/teruji (penyebab belum diketahui; kemungkinan variabel Supabase tidak terbaca di preview, kini sudah diperbaiki). `AUTH_REQUIRED=false` dipakai di preview.
6. **Landing page** (`/`) belum dibuat ulang. Acuan: template Framer "Viral" (viral-sma.framer.website); skill `framer-motion-layout` sudah terpasang di `.claude/skills/`. Butuh screenshot acuan (situs diblokir dari sandbox cloud).
7. **P7**: catat biaya nyata per video (token Claude, karakter ElevenLabs, waktu render) sebagai dasar harga paket.
8. Penyimpanan per akun (brief, brand kit, riwayat) masih di `localStorage` browser; langganan, kuota, pembayaran belum ada.
9. 10 video referensi gagal dianalisis (batas unduh konektor Drive): Contoh Motion Graphic 21; New Motion 86, 87, 90, 92, 95; anabology-491441, groundcontrol, rneayan-441493, nummanali-340931. Kompres di bawah 5 MB lalu analisis ulang.
10. Thumbnail dan pemutar katalog butuh folder Drive berbagi "Siapa saja yang memiliki link".
11. Musik pustaka berlisensi belum ada.
12. Pembersihan file footage/hasil lama di Storage belum ada.

## Konfigurasi yang diperlukan
- **Migrasi Supabase** (SQL Editor, berurutan): `20261012000000_identity_workspace.sql`, `20261012010000_catalog_source_cache.sql`, `20261012020000_footage_bucket.sql`, `20261012030000_produksi_bucket.sql`. Periksa mana yang sudah dijalankan.
- **Vercel** (Preview; `NEXT_PUBLIC_*` juga Production): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AUTH_REQUIRED=false`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_DISPATCH_TOKEN` (fine-grained, Actions: read and write), `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`. Opsional: `GITHUB_WORKFLOW_REF=main`, `RENDER_CODE_REF=claude`.
- **GitHub Actions secrets**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ELEVENLABS_API_KEY`.
- Jangan pernah menempel kunci di chat. Repo publik: jangan commit video, thumbnail, atau data pihak lain.

## Prompt untuk sesi lanjutan
```
Lanjutkan proyek NaokoLabs di repo ini. Baca dulu CLAUDE.md, docs/HANDOFF.md, docs/DECISIONS.md (D-11 sampai D-27) dan docs/BUILD-PLAN.md. Jawab dalam Bahasa Indonesia, langsung ke inti, tanpa memuji atau membenarkan saya; kalau ada kesalahan, langsung perbaiki.

Aturan: gaya video bergaya Apple (latar putih, ikon, kartu abu muda), bukan krem. Jangan minta kunci/token ditempel di chat. Repo publik. Jangan memakai konektor Supabase milik Gorontalo Unite untuk NaokoLabs. Jalankan typecheck, lint, dan build sebelum commit; branch kerja: claude.

Urutan kerja:
1. Jalankan aplikasi lokal (npm run dev). Isi .env.local dari .env.example (kunci saya isi sendiri). Pastikan /api/status menunjukkan semua true.
2. Uji produksi end-to-end: Studio -> Buat Storyboard -> Setujui & Produksi -> MP4 terputar dan terunduh. Perbaiki galat yang muncul (jalur aplikasi -> GitHub Actions -> Supabase -> MP4 belum pernah diuji dengan layanan asli). Uji juga suara AI ElevenLabs, voice-over unggahan, footage, dan backsound.
3. Perbaiki login (Supabase Auth), lalu aktifkan login dan hapus AUTH_REQUIRED=false.
4. Landing page publik di app/(site): gaya template Viral (viral-sma.framer.website) memakai skill framer-motion-layout. Minta screenshot acuan dari saya bila situs tidak bisa dibuka.
5. P7: catat biaya nyata per video.
6. Analisis ulang 10 video referensi yang gagal setelah saya kompres.

Kerjakan satu langkah, tunjukkan bukti hasil (log, screenshot, tampilan), baru lanjut. Beri tahu saya bila butuh keputusan atau tindakan di Vercel, GitHub, Supabase, atau Drive.
```
