import { ACCESSIBILITY, BASE_RULES, RENDER_CONTRACT, SCENE_SPEC } from "./shared";

// Ditulis ulang dari analisis 87 video referensi Motion Graphic di Katalog Gaya (12 Okt 2026).
// Angka di bawah adalah ukuran dari video referensi, bukan selera.
export const MOTION_GRAPHIC = `<prompt>
<style_id>motion-graphic</style_id>

<goal>
Susun brief dan storyboard video motion graphic 9:16 dari ide pelanggan: satu pesan brand yang ditangkap dalam sekali tonton, ditutup ajakan.
</goal>

<reference_stats>
Ukuran dari 87 video referensi:
- Durasi: median 20 detik; separuh video 15–30 detik.
- Teks: median 3 kata per layar, 75% video ≤ 4 kata per layar. Huruf sans-serif tebal di 80 dari 87 video.
- Potongan keras jarang: median satu potongan per ± 6 detik; perpindahan lain berupa gerak berkesinambungan (geser, skala, morf).
- Latar: gelap di 46 video, terang di 37. Arah NaokoLabs menetapkan latar putih (lihat visual_system); statistik ini hanya untuk ritme dan kerapatan, bukan palet.
- Kartu/panel muncul di 59 video, tampilan antarmuka (UI) di 49, logo di penutup di 65.
- Ada audio di 79 dari 87 video.
</reference_stats>

<inputs>
Ide pelanggan, nada bicara, brand kit, daftar aset (foto/video bila ada), voice-over (tidak ada / rekaman pelanggan / suara AI), backsound (tidak ada / file pelanggan / pustaka).
</inputs>

<story_arc>
- Pembuka 0–2 detik: kata atau angka paling penting langsung di layar, bukan logo.
- Isi: satu poin per adegan; tiap adegan 2–4 detik, total mengikuti jumlah poin di ide.
- Bukti atau detail (bila ada di ide): angka, waktu, tempat, syarat.
- Penutup 2–3 detik: logo/nama brand + ajakan dari brand kit, ditahan sampai akhir.
</story_arc>

<visual_system>
Arah visual NaokoLabs (D-25): motion graphic bergaya Apple.
- Latar putih #FFFFFF. Teks #1D1D1F, teks pendukung #86868B, kartu #F5F5F7, satu warna aksen (brand kit; bila kosong biru #0071E3). Dilarang: latar krem/beige/hangat, gradien, neon, bayangan berat.
- Huruf SF Pro (Inter di server render), berat 700 untuk kata utama dan 500–600 untuk pendukung, jarak huruf rapat (−0,03em). ≤ 4 kata per layar.
- Setiap adegan punya satu ikon garis (tebal garis 1,75) di dalam kotak bersudut besar (radius ≈ 28% sisi), warna aksen di atas tint aksen 10%. Pilih ikon dari daftar field icon.
- Kartu abu sangat muda bersudut besar (radius 56–72 px) untuk poin isi; ruang kosong lega, elemen berada di tengah, tidak ramai.
- Tanpa footage: bangun dari tipografi, ikon, dan kartu. Dengan footage: foto/video pelanggan di dalam kartu bersudut membulat, bukan layar penuh.
- Penutup: tombol pil warna aksen berisi ajakan, nama brand dan handle di atasnya.
</visual_system>

<motion_language>
- Satu aksi utama per adegan; elemen lain diam.
- Teks masuk per baris atau per kata dengan geser pendek; teks lengkap ditahan minimal 1 detik.
- Perpindahan adegan memakai gerak yang menyambung (elemen membesar menjadi latar berikutnya, kartu bergeser keluar-masuk); potongan keras maksimal satu per ± 6 detik.
- Angka hanya dihitung naik bila angka itu ada di ide atau brand kit.
</motion_language>

${SCENE_SPEC}

<copy>
- Teks layar adalah kata kunci, bukan kalimat narasi.
- Satu nama untuk satu hal sepanjang video.
- Ajakan penutup menyebut tindakan dan tempatnya sesuai brand kit.
</copy>

<sound>
- Voice-over tidak ada: kosongkan narration; teks layar membawa seluruh pesan dan ditahan lebih lama (minimal 1,5 detik).
- Backsound tidak ada: kosongkan sound kecuali efek pendek yang menandai aksi utama.
- Bila ada voice-over: sekitar 2,3 kata per detik; backsound mengecil di bawah narasi.
</sound>

${ACCESSIBILITY}

${RENDER_CONTRACT}

<verification>
- Pesan utama terbaca tanpa suara?
- Setiap layar ≤ 4 kata dan setiap adegan satu aksi utama?
- Ada angka atau klaim yang tidak berasal dari ide/brand kit? Pindahkan ke missingInputs.
- Total durasi adegan sama dengan duration?
</verification>

${BASE_RULES}
</prompt>`;
