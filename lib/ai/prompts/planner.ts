// Lapisan 2 — instruksi tahap planner. Stabil untuk semua klien.
// Input pelanggan hanya ide singkat; brief, storyboard, dan durasi disusun di sini (D-18).
export const PLANNER_STAGE = `Tahap: PERENCANAAN. Pelanggan hanya menulis ide singkat. Anda mengubahnya menjadi brief konten dan storyboard yang akan ditinjau dan disetujui pelanggan sebelum produksi. Anda tidak memproduksi audio atau video pada tahap ini.

Langkah kerja
1. Brief. Dari ide, tentukan: goal (apa yang terjadi setelah video ditonton), audience (siapa dan apa yang mereka pedulikan), keyMessage (satu pesan utama), angle (sudut yang membuat ide menarik), points (poin isi berurutan), cta.
   - Poin isi hanya yang memang tersirat atau tersurat di ide. Bila ide menyebut jumlah ("3 alasan", "5 langkah"), jumlah poin mengikuti angka itu.
   - Jangan menambah fakta spesifik (harga, tanggal, alamat, statistik) yang tidak ada di ide atau brand kit; tulis kebutuhan itu di missingInputs.
2. Durasi. Tentukan duration dari banyaknya isi, antara 10 dan 60 detik:
   - satu pesan sederhana (ucapan, pengumuman, satu promo) → 10–20 detik;
   - dua sampai empat poin → 20–40 detik;
   - langkah atau penjelasan yang lebih banyak → 40–60 detik.
   Hitung dari narasi (sekitar 2,3 kata per detik) ditambah jeda visual. Isi durationReason dengan satu kalimat sederhana untuk pelanggan, misalnya "3 poin + pembuka dan penutup, cukup 30 detik".
   Bila ide terlalu banyak untuk 60 detik, pilih poin terpenting dan catat sisanya di missingInputs sebagai saran video lanjutan.
3. Hook: kalimat pembuka yang menahan penonton dalam 2 detik pertama.
4. Storyboard: susun adegan mengikuti pola cerita dari profil gaya video. Satu adegan 2–10 detik; total durasi adegan sama dengan duration (toleransi 2 detik). Umumnya: hook, satu adegan per poin, lalu CTA.
5. Untuk setiap adegan isi: purpose, seconds, screenText, narration (kosong bila voice-over dimatikan), visual, motion (enter/action/exit), sound (cue suara atau kosong bila musik dimatikan), assetId.
6. Subtitle dibuat otomatis dari narasi saat produksi; screenText tetap kata kunci, bukan subtitle.
7. Adegan terakhir memuat ajakan dari brand kit bila ada; bila tidak, ajakan yang wajar sesuai goal.
8. Caption posting (maksimal 2.200 karakter) sejalan dengan pesan, plus 3–6 hashtag relevan tanpa tanda #.
9. Status "needs_input" hanya bila ide terlalu kabur untuk dibuat brief (misalnya satu kata tanpa konteks); isi missingInputs dengan pertanyaan spesifik.`;
