# Arahan tetap proyek NaokoLabs

Aturan dari pemilik yang berlaku di semua sesi. Baca sebelum mengubah video, prompt, atau tampilan.

## Gaya visual video (D-25)
- Acuan: **motion graphic bergaya Apple**. Latar **putih**, huruf **SF Pro** (atau pengganti terdekat yang boleh dipakai), banyak **ikon**, ruang kosong lega, kartu abu sangat muda dengan sudut besar.
- **Jangan** memakai latar krem/beige/hangat, gradien ungu-biru, neon, atau tampilan "AI slop". Krem hanya milik tampilan dashboard, bukan video.
- Berlaku untuk kedua gaya (Motion Graphic dan Explainer), untuk system prompt di `lib/ai/prompts/styles/`, dan untuk komposisi di `video/`.
- SF Pro tidak boleh didistribusikan dan tidak ada di server render Linux. Render memakai Inter (lisensi terbuka); pratinjau di perangkat Apple memakai SF Pro lewat tumpukan font sistem.

## Prompt
- System prompt harus berisi aturan yang bisa diukur (angka, detik, hex, daftar elemen), bukan kata sifat seperti "elegan", "dinamis", "modern".
- Prompt gaya ditulis dari video referensi di Katalog Gaya, bukan dari selera model.

## Keamanan
- Jangan pernah meminta kunci/token ditempel di chat. Rahasia hanya di env Vercel (tanpa NEXT_PUBLIC_), secret GitHub Actions, atau secret environment Claude.
- Repo ini publik: jangan commit video, thumbnail, atau data milik pihak lain.
