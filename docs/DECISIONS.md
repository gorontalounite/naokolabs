# Keputusan dan pertanyaan terbuka

Status: DRAF. 11 Oktober 2026.

## Dari pengguna

- D-01: Dashboard dengan login, database, form/CMS dan kemampuan lebih dari 10 integrasi.
- D-02: Motion Graphic Reels/Story, Carousel, copywriting, layanan website.
- D-03: Pembayaran → rencana/strategi/storyboard → persetujuan → produksi → hasil/caption → revisi terbatas → posting/jadwal.
- D-04: Revisi hasil hanya media salah tempat, typo, pengucapan VO salah.
- D-05: Jawaban terbaru: posting/penjadwalan dahulu, bukan pengelolaan iklan.
- D-06 (digantikan D-07): Rancangan sebelumnya menunda paket dan memakai harga satuan tetap.
- D-07: Arahan terbaru memakai PAYG berdasarkan komponen. Acuan fullset Rp350.000 satuan; paket 5 Rp1.250.000; paket 10 Rp2.000.000. Komponen yang tidak dipakai mengubah total. Breakdown harga masih analisis.
- D-08: Skill dipasang pada aplikasi kemudian, tidak pada tahap ini.
- D-09: UI dashboard wajib responsive di mobile untuk seluruh alur inti.
- D-10: Katalog video mencakup UGC, Explainer, Motion Graphic, Cinematic, Illustration, Animation, Whiteboard; workflow lain dari referensi Higgsfield dievaluasi capability/biayanya sebelum dipasarkan.

## Usulan, belum diputuskan

- Aplikasi modular + worker produksi terpisah, queue/workflow persisten.
- Next.js/TypeScript, Postgres/Supabase, render Remotion dalam container/sandbox.
- Katalog layanan website dahulu; otomasi pembuatan website kemudian.
- Persetujuan rencana mencakup naskah lengkap dan caption untuk mengurangi koreksi konsep setelah produksi.
- Template produksi terbatas untuk pilot, kode AI bebas hanya jika dibutuhkan.
- Provider AI/media dipanggil sesuai kebutuhan, tidak semua untuk setiap item.

## Perlu keputusan sebelum checkout produksi

1. Unit video: batas durasi, rasio/resolusi, VO termasuk atau opsional, backsound dan jumlah versi.
2. Unit carousel: batas jumlah slide, ukuran, file output, editable source termasuk atau tidak.
3. Harga: breakdown komponen/tier PAYG, arti footage included (stock/AI/custom), mixing paket, tax/fee, caption/posting, media premium/add-on dan batas HPP. Analisis ada di [PAYG](PAYG-PRICING.md).
4. Revisi: jumlah putaran, tenggat, pihak yang memutuskan koreksi dalam cakupan, perubahan brief pra-approval.
5. Payment: vendor, refund/cancel saat gagal atau sebelum approval.

## Perlu keputusan sebelum fondasi

Nama produk/domain; aplikasi baru atau reuse repo lama (tidak diasumsikan); roles/membership; metode login; brand per workspace; storage/upload limits; retensi; stack/hosting; siapa operator QC; model/voice yang tersedia pada akun.

## Perlu keputusan sebelum publishing

Jenis akun IG/FB/TikTok; format Reels/Story/carousel yang didukung tiap jalur; app ownership; scope/review/audit; caption/privasi; default timezone; batas editing jadwal; proses reconnect dan publish unknown.

## Layanan website

Jumlah halaman untuk multiple page, hosting/maintenance, ekstensi dan kepemilikan domain, renewal, CMS untuk website klien, alur approval dan delivery. Harga dari pengguna tetap dicatat; jangan otomatis menganggap semua detail termasuk.

Setiap keputusan baru mencatat tanggal, alasan, dampak ke PRD/ARD/harga, dan keputusan lama yang digantikan.

## Hasil penyusunan baseline pilot

Pengguna meminta menetapkan cakupan dan menguji biaya. Cakupan video 30 detik/6 scene dan carousel 8 slide kini menjadi baseline uji di FULLSET-SPEC, bukan persetujuan syarat layanan publik. Subtitle video sederhana included pada baseline sebagai usulan; source editable/thumbnail/format tambahan di luar baseline. Dua putaran feedback/7 hari merupakan usulan operasional, bukan arahan asli pengguna.

Tiga quote shot Higgsfield sudah diperoleh tanpa spending; ledger simulasi dan protocol dibuat. Harga final/perubahan target margin belum disetujui. Produksi aktual menunggu runtime/skill, aset uji dan billing budget yang sesuai. Definisi layanan standar/premium diperbarui lewat hasil actual pilot, bukan nama style saja.

## Keputusan 12 Oktober 2026 — arah dashboard

- D-11: Dashboard fokus satu produk dulu: **Buat Video** (Reels/Story 9:16). Carousel dipindah ke tahap berikutnya. Menggantikan D-02 untuk urutan pembangunan, bukan untuk katalog layanan jangka panjang.
- D-12: Pola alur dashboard mengikuti referensi InstaDeck yang diberikan pengguna: Studio sebagai pusat dengan tiga cara input (Link Web, Tulis Naskah, Ide Singkat), pilihan berbentuk kartu, katalog gaya, riwayat, jadwal, panduan, paket, pengaturan & brand kit. Identitas visual tetap NaokoLabs.
- D-13: Setelah klien klik "Buat Video", AI menyusun **rencana dulu** (naskah, storyboard, caption) yang bisa diedit; produksi berbiaya berjalan hanya setelah klien klik "Produksi Video". Sejalan dengan D-03 dan FR-04.
- D-14: Model bayar klien: **langganan bulanan dengan kuota video**, menggantikan D-07 (PAYG per komponen) untuk alur dashboard. Harga paket, kuota per paket, biaya durasi 60 detik, dan sisa kuota akhir bulan **belum ditetapkan**; harus dihitung dari biaya produksi nyata (lihat PAYG-PRICING.md bagian 9 dan VIDEO-60S-AVATAR-ECONOMICS.md) sebelum checkout aktif.
- D-15: Halaman versi pertama: Studio Video, Ide Konten, Katalog Gaya Video, Riwayat Video, Jadwal & Auto-Post, Panduan, Paket & Kuota, Pengaturan & Brand Kit. Analitik dan program afiliasi tidak termasuk.
- D-16: Urutan pengerjaan: dashboard dulu; planner AI dan produksi video sungguhan dikerjakan belakangan; login klien diaktifkan paling akhir (selama pengembangan `AUTH_REQUIRED=false` membuka `/app` tanpa login); landing page publik diperbarui paling akhir. Dokumen BRD, PRD, BUILD-PLAN, ROADMAP, PAYG-PRICING, BUSINESS-RULES, WORKFLOW, DATA-MODEL, TESTING, UI-UX dan FULLSET-SPEC disesuaikan pada tanggal yang sama.
- D-17: Planner AI memakai **Anthropic (Claude) saja**; OpenAI tidak dipakai. Claude menyusun rencana (naskah, storyboard, caption) dengan structured output dan validasi server, serta membantu komposisi Remotion. ElevenLabs tetap untuk VO. Selama kunci API belum dipasang, `/api/rencana` berjalan dalam **mode contoh** (rencana template yang lolos validasi) agar alur Studio → rencana → persetujuan bisa diuji tanpa biaya. Menggantikan penyebutan OpenAI di BUILD-PLAN, PRD dan INTEGRATIONS.
- D-18: Studio Video hanya menerima **ide singkat**; Link Web dan Tulis Naskah dihapus. Ide diubah planner menjadi brief konten + storyboard. Durasi tidak dipilih klien di awal: planner menentukan 10–60 detik dari banyaknya isi ide dan menampilkan alasannya; selanjutnya durasi mengikuti adegan. Subtitle otomatis dari narasi (bukan pilihan). Gaya video tampil langsung di Studio dengan pratinjau gerak singkat per gaya. Momen jualan dan Ide Konten tidak ditampilkan di Studio.
- D-19: **Jadwal & Auto-Post dikeluarkan dari MVP.** Klien cukup menerima hasil video (unduh MP4 + salin caption) dan memposting sendiri. Menu Jadwal, tab Akun Medsos, dan status terjadwal/terbit dihapus dari dashboard. Publishing (OAuth, posting, jadwal) menjadi tahap setelah MVP.
- D-20: **Setiap gaya video punya system prompt lengkap sendiri** (`lib/ai/prompts/styles/<gaya>.ts`) dengan struktur bertag mengikuti referensi prompt motion/explainer: goal, role, principles, inputs, discovery, story_arc, duration, visual_system, motion_language, scene_spec, copy, sound, accessibility, render_contract, verification, rules. Disesuaikan untuk tahap rencana (keluaran JSON brief + storyboard) dan alur persetujuan; bagian "autonomy tanpa persetujuan" dan persona tokoh nyata tidak dipakai. **Setiap contoh video di Katalog Gaya punya system prompt sendiri** (arahan tampilan: palet, tipografi, ritme, gerakan khas, struktur; `lib/ai/prompts/examples.ts`, hanya server) **dan prompt** (ide yang ditampilkan di katalog; `lib/style-examples.ts`). Pelanggan bisa memilih contoh sebagai acuan; prompt dikirim berlapis: global + tahap → gaya → contoh → ide pelanggan. Contoh awal (satu per gaya) masih tanpa video; video dari pengguna ditaruh di `public/contoh/<id>.mp4` dan prompt contoh disesuaikan dengan video tersebut.
- D-21: Studio menerima **voice-over jadi dari pelanggan** sebagai pengganti naskah. Audio ditranskrip lewat ElevenLabs Speech-to-Text (`/api/transkrip`, model `scribe_v2`, bisa diganti lewat `ELEVENLABS_STT_MODEL`); storyboard memakai transkrip persis sebagai narasi dan waktu kalimat sebagai durasi adegan. Batas: 3–60 detik, 4 MB (batas body fungsi Vercel). `/api/status` menampilkan apakah planner AI dan transkripsi aktif tanpa membuka nilai kunci.
