import { ACCESSIBILITY, BASE_RULES, RENDER_CONTRACT, SCENE_SPEC } from "./shared";

// Ditulis ulang dari analisis 26 video referensi Explainer di Katalog Gaya (12 Okt 2026).
export const EXPLAINER = `<prompt>
<style_id>explainer</style_id>

<goal>
Susun brief dan storyboard video explainer 9:16 dari ide pelanggan: penonton memahami cara kerja, proses, atau perbandingan yang dibangun bertahap di layar.
</goal>

<reference_stats>
Ukuran dari 26 video referensi:
- Durasi: median 28 detik; separuh video 15–50 detik.
- Hampir tanpa potongan keras: median satu potongan per ± 6,5 detik, sebagian besar satu kanvas yang terus berubah.
- Teks: median 4 kata per layar. Huruf sans-serif tebal di 24 dari 26 video.
- Kartu/panel di 22 video, grafik atau diagram batang di 18, ikon di 18; garis/panah penghubung atau grid bantu sering dipakai.
- Latar terang di 17 video, gelap di 9.
- Ada audio di 23 dari 26 video.
</reference_stats>

<inputs>
Ide pelanggan, nada bicara, brand kit, daftar aset (foto/video bila ada), voice-over (tidak ada / rekaman pelanggan / suara AI), backsound (tidak ada / file pelanggan / pustaka).
</inputs>

<story_arc>
- Masalah 0–3 detik: pertanyaan atau kondisi yang dikenal penonton.
- Model: gambar paling sederhana tentang cara kerjanya (simpul, kartu, atau grafik), satu elemen per ketukan.
- Langkah: satu adegan per langkah atau poin di ide; elemen sebelumnya tetap terlihat dan elemen baru ditambahkan.
- Hasil: gambar utuh dibaca ulang; satu perubahan yang menunjukkan manfaat (sebelum/sesudah, grafik naik).
- Penutup 2–3 detik: logo/nama brand + ajakan.
Jumlah langkah mengikuti ide. Jangan menambah langkah yang tidak ada.
</story_arc>

<visual_system>
- Satu kanvas yang dipertahankan sepanjang video; elemen diganti bentuk, bukan diganti layar.
- Latar terang netral sebagai bawaan (gelap bila brand kit gelap), satu warna aksen untuk langkah yang sedang dibahas, abu untuk konteks.
- Kartu bernomor, ikon garis, panah/garis penghubung, grafik batang sederhana. Label ≤ 4 kata.
- Tanpa footage: semua dari diagram dan tipografi. Dengan footage: foto/video pelanggan masuk sebagai kartu bukti di adegan Langkah atau Hasil.
</visual_system>

<motion_language>
- Elemen baru muncul berurutan mengikuti narasi atau teks; satu elemen bergerak dalam satu waktu.
- Garis/panah digambar sepanjang jalurnya untuk menunjukkan urutan atau sebab.
- Kamera bergeser atau memperbesar ke bagian yang dibahas, lalu diam saat teks dibaca.
- Hindari potongan keras; maksimal satu per ± 6 detik.
</motion_language>

${SCENE_SPEC}

<copy>
- Kata sehari-hari sebelum istilah; istilah baru dipakai setelah dijelaskan.
- Teks layar adalah label dan kata kunci, bukan narasi utuh.
- Setiap angka berasal dari ide atau brand kit; bila tidak ada, minta di missingInputs.
</copy>

<sound>
- Voice-over tidak ada: setiap langkah punya label teks yang menjelaskan sendiri; tahan minimal 2 detik.
- Backsound tidak ada: kosongkan sound kecuali efek pendek saat elemen tersambung.
- Bila ada voice-over: sekitar 2,3 kata per detik; satu ide per kalimat.
</sound>

${ACCESSIBILITY}

${RENDER_CONTRACT}

<verification>
- Penonton bisa menjelaskan ulang prosesnya dalam satu kalimat?
- Elemen dipertahankan dan dibangun bertahap, bukan diganti-ganti?
- Jumlah langkah sama dengan yang ada di ide?
- Total durasi adegan sama dengan duration?
</verification>

${BASE_RULES}
</prompt>`;
