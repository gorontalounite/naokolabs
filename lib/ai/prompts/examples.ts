// Lapisan 4 — system prompt per contoh video di Katalog Gaya (D-20).
// Dipakai bila pelanggan memilih contoh sebagai acuan tampilan. Isinya arahan visual dan ritme
// yang membuat hasil mendekati video contoh; fakta tetap hanya dari ide dan brand kit pelanggan.
// Prompt pengguna (ide) untuk tiap contoh ada di lib/style-examples.ts.

export const EXAMPLE_PROMPTS: Record<string, string> = {
  "mg-kopi-aren": `<example_direction id="mg-kopi-aren" style="motion-graphic">
<reference>Video contoh "Promo es kopi aren": promo singkat yang terasa hangat dan cepat.</reference>
<palette>Latar krem #F4EFE6, teks tinta #171513, aksen terakota #C43A24. Bila brand kit punya warna, warna brand menggantikan aksen; latar dan teks tetap.</palette>
<typography>Huruf sans tebal (berat 800) untuk kata pahlawan, mengisi 70% lebar layar; huruf sans biasa (berat 500) untuk pendukung. Rata kiri dengan margin 8%.</typography>
<rhythm>Ide baru setiap 1,5–2,5 detik. Hook dalam 1 detik pertama. Tahan teks lengkap 1 detik sebelum berganti.</rhythm>
<signature_move>Satu bulatan aksen yang hidup sepanjang video: muncul di hook, bergeser menjadi penanda poin, lalu membesar menjadi latar adegan ajakan.</signature_move>
<structure>Hook kata pahlawan → keinginan penonton → penawaran (angka atau syarat dari ide dibuat paling besar) → kapan/di mana → ajakan + logo.</structure>
<avoid>Foto produk ditempel tanpa bingkai, lebih dari satu warna aksen, teks berputar atau memantul.</avoid>
</example_direction>`,

  "ex-qris": `<example_direction id="ex-qris" style="explainer">
<reference>Video contoh "Cara kerja pembayaran QRIS": proses dijelaskan sebagai satu diagram yang tumbuh.</reference>
<palette>Latar putih #FBFAF7, garis dan teks abu tua #2B2A28, aksen biru #2463EB untuk langkah yang sedang dibahas, abu muda #D8D4CC untuk konteks. Warna brand menggantikan aksen bila ada.</palette>
<typography>Sans tebal untuk label simpul (maksimal 2 kata), sans biasa untuk keterangan. Label selalu di sisi kanan simpul.</typography>
<rhythm>Satu simpul atau panah baru per 2–3 detik, mengikuti narasi. Diam 1 detik setelah setiap langkah selesai.</rhythm>
<signature_move>Diagram vertikal dari atas ke bawah yang tidak pernah dihapus: setiap langkah menambah simpul; di Belokan satu simpul diganti dan panah sesudahnya berubah warna untuk menunjukkan akibat; di penutup kamera mundur memperlihatkan diagram utuh.</signature_move>
<structure>Hal yang sering disalahpahami → model sederhana (simpul pertama dan terakhir) → langkah di antaranya satu per satu → belokan (satu kondisi berubah) → diagram utuh dibaca ulang + ajakan.</structure>
<avoid>Ikon uang beterbangan, ilustrasi orang yang tidak perlu, metafora yang mengaburkan langkah.</avoid>
</example_direction>`,

  "wb-simpan-kopi": `<example_direction id="wb-simpan-kopi" style="whiteboard">
<reference>Video contoh "3 cara menyimpan biji kopi": papan putih yang terisi tiga ikon lalu dibaca utuh.</reference>
<palette>Latar putih #FFFFFF, garis hitam #1E1C1A, aksen cokelat kopi #7A4B2A untuk isian hal terpenting.</palette>
<typography>Tulisan tangan rapi, label maksimal 3 kata, judul di atas papan ditulis lebih dulu.</typography>
<rhythm>Setiap ikon digambar 1–1,5 detik lalu diam 1,5 detik untuk dibaca. Satu poin per adegan.</rhythm>
<signature_move>Papan dibagi tiga baris dari atas ke bawah; nomor poin dilingkari aksen saat dibahas; penutup memperlihatkan ketiga poin sekaligus dengan logo ditulis di pojok kanan bawah di atas area subtitle.</signature_move>
<structure>Pertanyaan bergambar → poin 1 → poin 2 → poin 3 → papan utuh + ajakan.</structure>
<avoid>Gambar detail atau berbayang, lebih dari satu warna aksen, tulisan panjang di papan.</avoid>
</example_direction>`,

  "ugc-review-sambal": `<example_direction id="ugc-review-sambal" style="ugc-edit">
<reference>Video contoh "Review jujur sambal roa": rekaman ponsel pelanggan mencoba produk, terasa spontan.</reference>
<palette>Warna asli rekaman tanpa filter berat. Pelat teks putih #FFFFFF dengan teks tinta #171513; satu pelat aksen warna brand untuk kalimat kunci.</palette>
<typography>Sans tebal ukuran besar, pelat bersudut membulat, di sepertiga atas, tidak menutupi wajah atau produk.</typography>
<rhythm>Potongan 1–3 detik. Hook = reaksi pertama setelah mencicipi. Teks muncul per frasa mengikuti ucapan.</rhythm>
<signature_move>Hook memakai momen reaksi, lalu mundur ke "sebelum mencoba", lalu kembali ke reaksi yang lebih panjang; zoom pelan 5–8% hanya pada detik reaksi.</signature_move>
<structure>Reaksi (hook) → konteks singkat (siapa/apa) → mencoba dan menjelaskan rasa → ajakan + handle di potongan terakhir.</structure>
<avoid>Musik terlalu keras di atas suara asli, efek transisi bergaya, klaim kesehatan atau "terbaik" yang tidak ada di ide.</avoid>
</example_direction>`,

  "sc-pagi-danau": `<example_direction id="sc-pagi-danau" style="stock-cinematic">
<reference>Video contoh "Pagi di tepi danau": suasana pagi yang tenang untuk penginapan.</reference>
<palette>Gradasi hangat keemasan pagi hari (matahari rendah, kabut tipis), bayangan biru lembut. Teks putih gading #FFF8EC dengan bayangan lembut.</palette>
<typography>Serif tipis atau sans ringan untuk teks, satu baris di tengah, huruf berjarak lebar.</typography>
<rhythm>Shot 3–5 detik, gerak kamera pelan di setiap shot, potongan mengikuti ketukan musik yang lambat.</rhythm>
<signature_move>Semua shot berada pada jam yang sama (pagi) dan bergerak dari jauh ke dekat: lanskap → detail (cangkir, jendela) → orang menikmati dari belakang → shot lebar penutup dengan logo.</signature_move>
<structure>Lanskap pembuka + satu baris teks → dua sampai tiga shot detail suasana → puncak (penginapan atau aset pelanggan) → shot tenang + ajakan.</structure>
<avoid>Wajah yang bisa dikenali, landmark yang bukan lokasi pelanggan, perpindahan jam (siang/malam) di tengah video.</avoid>
</example_direction>`,

  "il-laundry": `<example_direction id="il-laundry" style="ilustrasi-2d">
<reference>Video contoh "Laundry antar-jemput": cerita kecil tokoh ibu pekerja yang terbantu.</reference>
<palette>Pastel lembut: latar krem #FBF4E9, biru muda #CFE3F2, merah muda pudar #F2C9C1, kulit #F0C7A4, aksen hijau #3A7D6B (diganti warna brand bila ada).</palette>
<typography>Sans bulat tebal untuk teks layar; balon kata putih dengan garis tipis.</typography>
<rhythm>Adegan 4–6 detik, satu aksi tokoh per adegan, gerak hidup kecil terus berjalan.</rhythm>
<signature_move>Tumpukan baju menjadi benda yang dipertahankan: menggunung di adegan masalah, diambil kurir di adegan perubahan, kembali terlipat rapi di adegan penutup. Tokoh: ibu berkerudung hijau tua, kemeja biru muda, tas kerja cokelat; ciri ini sama di semua adegan.</signature_move>
<structure>Pagi sibuk (hook) → tumpukan baju (masalah) → pesan lewat ponsel, kurir datang → baju kembali rapi, tokoh lega → ajakan + logo.</structure>
<avoid>Tokoh berganti gaya atau pakaian, ekspresi berlebihan, stereotip pekerjaan.</avoid>
</example_direction>`,

  "pa-klinik": `<example_direction id="pa-klinik" style="presenter-ai">
<reference>Video contoh "Layanan cek kesehatan klinik": presenter membuka dan menutup, grafis menjelaskan isi paket.</reference>
<palette>Ruang terang putih kebiruan, aksen biru #1F5FAF, hijau lembut #2E8B6F untuk tanda selesai. Warna brand menggantikan aksen bila ada.</palette>
<typography>Sans bersih, label sepertiga bawah untuk nama presenter, daftar isi paket dengan tanda centang.</typography>
<rhythm>Presenter pembuka 8 detik, grafis satu item per 3–4 detik, presenter penutup 8 detik. Total presenter 16 detik.</rhythm>
<signature_move>Bingkai presenter mengecil menjadi kartu di pojok atas saat grafis dimulai, lalu membesar kembali untuk penutup.</signature_move>
<structure>PRESENTER sapaan + pertanyaan → grafis isi paket (dari ide) → grafis cara daftar → PRESENTER ringkasan + ajakan.</structure>
<avoid>Klaim medis, jaminan hasil, harga atau jadwal yang tidak ada di ide; presenter berpakaian dokter atau mengaku tenaga medis.</avoid>
</example_direction>`,

  "ca-kain-karawo": `<example_direction id="ca-kain-karawo" style="cinematic-ai">
<reference>Video contoh "Kain karawo": tekstur kain dan cahaya sore yang megah, dengan teks sedikit.</reference>
<palette>Cahaya sore keemasan, bayangan cokelat hangat, aksen emas #C9A44C untuk teks; latar adegan teks cokelat tua #2A1E16.</palette>
<typography>Serif tipis berjarak lebar untuk teks, satu baris di tengah.</typography>
<rhythm>Shot AI 4–5 detik dengan satu gerak kamera; adegan teks 3 detik di antaranya.</rhythm>
<signature_move>Dua AI SHOT saja: (1) jarak dekat benang dan sulaman karawo dengan kamera dorong masuk pelan, cahaya sore dari samping; (2) kain terbentang tertiup angin di beranda kayu, kamera naik pelan. Deskripsi kain, cahaya, dan palet diulang sama di kedua shot.</signature_move>
<structure>AI SHOT sulaman dekat (hook) → teks pesan → AI SHOT kain terbentang (puncak) → foto produk pelanggan bila ada → logo + ajakan di latar cokelat tua.</structure>
<avoid>Wajah orang, motif atau tulisan yang dibuat model video, lebih dari dua shot AI tanpa alasan.</avoid>
</example_direction>`,
};

export function examplePrompt(exampleId: string | undefined) {
  return exampleId ? EXAMPLE_PROMPTS[exampleId] : undefined;
}
