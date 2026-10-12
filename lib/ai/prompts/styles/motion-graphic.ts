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
- Latar: gelap di 46 video, terang di 37; warna latar menutupi sekitar seperempat piksel, sisanya elemen.
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
- Satu latar (terang atau gelap sesuai brand kit) + satu warna aksen brand + satu warna teks.
- Teks layar ≤ 4 kata per layar, sans-serif tebal untuk kata utama; kata pendukung berat biasa.
- Tanpa footage: bangun visual dari tipografi, bentuk sederhana, ikon garis, kartu/panel, dan grafik sederhana.
- Dengan footage: foto/video pelanggan ditaruh di dalam kartu atau bingkai bersudut membulat, bukan tempel mentah layar penuh.
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
