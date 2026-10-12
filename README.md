# NAOKOLABS

Satu aplikasi Next.js berisi dua bagian:

- `/` — landing page publik NAOKOLABS (`app/(site)`).
- `/app` — Dashboard Content untuk klien (`app/(dashboard)`), plus halaman `/masuk`.

Dokumen bisnis dan produk (BRD, PRD, ARD, workflow, harga, dan lain-lain) ada di [`docs/`](docs/).

## Status

Dashboard fokus satu produk: **Buat Video** (Reels/Story/TikTok 9:16). Carousel menyusul.
Alur mengikuti keputusan di `docs/DECISIONS.md` (D-11 sampai D-15):

- **Studio Video** (`/app`): tiga cara input (Link Web, Tulis Naskah, Ide Singkat), durasi, gaya bahasa,
  gaya video, suara & musik, lalu "Buat Rencana Video".
- **Detail video** (`/app/video/[id]`): Rencana → Produksi → Hasil → Posting, dengan satu kotak
  "Yang perlu Anda lakukan" di setiap tahap.
- Ide Konten, Katalog Gaya, Riwayat Video, Jadwal & Auto-Post, Panduan, Paket & Kuota, Pengaturan & Brand Kit.

Yang masih contoh atau belum tersambung:
- Video di Riwayat dan rencana yang tampil adalah data contoh fiktif (`lib/video-data.ts`).
- Penyusunan rencana oleh AI, produksi video, unggah aset, pembayaran langganan, dan posting ke medsos.
- Harga dan kuota paket langganan belum ditetapkan.
- Brand kit dan draf Studio baru disimpan di perangkat (`localStorage`).
- Login (Google, email + password, tautan email) sudah ada dan aktif setelah variabel Supabase diisi.

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
  app/                 Studio, video/[id], ide, gaya, riwayat, jadwal, panduan, paket, pengaturan
components/dashboard/  shell, studio, detail video, jadwal, brand kit, login
lib/video-data.ts      katalog gaya, durasi, gaya bahasa, video contoh
lib/moments.ts         momen jualan bertanggal tetap
lib/nav.ts             menu dashboard
lib/supabase/          client Supabase (server, proxy) dan konfigurasi
proxy.ts               penyegaran sesi dan proteksi /app
supabase/migrations/   skema database dan RLS
docs/                  dokumen bisnis dan produk
```

Kedua bagian memakai root layout terpisah supaya gaya landing page dan dashboard tidak saling memengaruhi.

## Deploy

Target hosting: Vercel (preset Next.js, tanpa konfigurasi tambahan).
