# NAOKOLABS

Satu aplikasi Next.js berisi dua bagian:

- `/` — landing page publik NAOKOLABS (`app/(site)`).
- `/app` — Dashboard Content untuk klien (`app/(dashboard)`), plus halaman `/masuk`.

Dokumen bisnis dan produk (BRD, PRD, ARD, workflow, harga, dan lain-lain) ada di [`docs/`](docs/).

## Status

Dashboard masih **wireframe yang bisa diklik**, dibangun dari Figma
"NaokoLabs — Dashboard Content — UI-UX Draft" (BUILD-PLAN tahap 1–2).

- Semua isi memakai data contoh fiktif dari `lib/fixtures.ts`.
- Login (Google, email + password, tautan email) dan skema workspace sudah dibuat dengan Supabase,
  aktif setelah variabel environment diisi. Tanpa variabel itu, `/app` terbuka dalam mode pratinjau.
- Upload ke server, pembayaran, AI, dan posting sosial **belum tersambung**.
- Harga komponen tampil "Belum ditetapkan" sampai tarif PAYG disetujui.
- Draf "Buat Konten" disimpan di `localStorage` perangkat saja.

## Menjalankan

Butuh Node.js `>=22.13.0`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Supabase

Project: `dashboard-app` (ref `gcsnfqakkrorchfaemeg`, Singapore) di organisasi Supabase NaokoLabs.
Jangan memakai project atau organisasi Gorontalo Unite.

1. Jalankan migrasi di `supabase/migrations/` (Supabase CLI `supabase db push`, atau tempel isinya di SQL Editor).
2. Isi environment (lokal: `.env.local`, Vercel: Project Settings → Environment Variables) sesuai `.env.example`.
3. Authentication → URL Configuration: Site URL = domain aplikasi; Redirect URLs tambahkan
   `https://<domain>/auth/callback`, `http://localhost:3000/auth/callback`, dan untuk preview Vercel
   `https://naokolabs-*-gorontalounitemediahub-5403s-projects.vercel.app/**`.
4. Authentication → Providers → Google: isi Client ID/Secret dari Google Cloud (akun Google NaokoLabs).
   Authorized redirect URI di Google: `https://gcsnfqakkrorchfaemeg.supabase.co/auth/v1/callback`.
5. Email bawaan Supabase dibatasi jumlahnya; ganti ke SMTP (kandidat: Resend) sebelum dipakai klien.

Akses: `proxy.ts` mengarahkan tamu dari `/app` ke `/masuk`, layout `/app` memeriksa ulang di server,
dan RLS di database membatasi data per workspace. Setiap pengguna baru otomatis mendapat profil dan workspace
pribadi dengan peran owner.

## Struktur

```
app/(site)/            landing page, gaya di site.css
app/(dashboard)/       root layout dashboard, gaya di dashboard.css
  masuk/               halaman masuk (belum aktif)
  app/                 Beranda, Buat Konten, Rencana, Hasil, Posting, menu lain
components/dashboard/  shell, wizard, storyboard, hasil, posting
lib/fixtures.ts        data contoh
lib/nav.ts             menu klien (docs/UI-UX.md)
lib/supabase/          client Supabase (server, proxy) dan konfigurasi
proxy.ts               penyegaran sesi dan proteksi /app
supabase/migrations/   skema database dan RLS
docs/                  dokumen bisnis dan produk
```

Kedua bagian memakai root layout terpisah supaya gaya landing page dan dashboard tidak saling memengaruhi.

## Deploy

Target hosting: Vercel (preset Next.js, tanpa konfigurasi tambahan).
