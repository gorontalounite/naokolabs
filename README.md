# NAOKOLABS

Satu aplikasi Next.js berisi dua bagian:

- `/` — landing page publik NAOKOLABS (`app/(site)`).
- `/app` — Dashboard Content untuk klien (`app/(dashboard)`), plus halaman `/masuk`.

Dokumen bisnis dan produk (BRD, PRD, ARD, workflow, harga, dan lain-lain) ada di [`docs/`](docs/).

## Status

Dashboard masih **wireframe yang bisa diklik**, dibangun dari Figma
"NaokoLabs — Dashboard Content — UI-UX Draft" (BUILD-PLAN tahap 1–2).

- Semua isi memakai data contoh fiktif dari `lib/fixtures.ts`.
- Login, database, upload ke server, pembayaran, AI, dan posting sosial **belum tersambung**.
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

## Struktur

```
app/(site)/            landing page, gaya di site.css
app/(dashboard)/       root layout dashboard, gaya di dashboard.css
  masuk/               halaman masuk (belum aktif)
  app/                 Beranda, Buat Konten, Rencana, Hasil, Posting, menu lain
components/dashboard/  shell, wizard, storyboard, hasil, posting
lib/fixtures.ts        data contoh
lib/nav.ts             menu klien (docs/UI-UX.md)
docs/                  dokumen bisnis dan produk
```

Kedua bagian memakai root layout terpisah supaya gaya landing page dan dashboard tidak saling memengaruhi.

## Deploy

Target hosting: Vercel (preset Next.js, tanpa konfigurasi tambahan).
