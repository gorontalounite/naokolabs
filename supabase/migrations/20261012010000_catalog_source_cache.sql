-- Metadata katalog gaya video dan cache sumber link.
-- Katalog dibaca publik (hanya baris aktif); perubahan lewat SQL editor/admin, bukan dari aplikasi.

create table public.video_styles (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  tagline text not null default '',
  description text not null default '',
  best_for text not null default '',
  needs text not null default '',
  tier text not null default 'standar' check (tier in ('standar', 'quote')),
  -- Profil untuk planner (alur cerita, aturan visual) agar bisa diubah tanpa deploy.
  profile jsonb not null default '{}'::jsonb,
  sort_order int not null default 100,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.video_styles enable row level security;

create policy "video_styles_public_read" on public.video_styles
  for select to anon, authenticated using (active);

insert into public.video_styles (id, name, tagline, description, best_for, needs, tier, sort_order) values
  ('motion-graphic', 'Motion Graphic', 'Teks bergerak, bentuk & ikon', 'Tipografi dan bentuk yang bergerak mengikuti narasi. Rapi, cepat, cocok untuk pesan singkat.', 'Promo, pengumuman, tips singkat', 'Logo dan warna brand', 'standar', 10),
  ('explainer', 'Explainer', 'Masalah → cara kerja → manfaat', 'Diagram langkah demi langkah yang menjelaskan produk atau proses dengan runtut.', 'Edukasi produk, layanan, cara pakai', 'Poin yang ingin dijelaskan', 'standar', 20),
  ('whiteboard', 'Whiteboard', 'Gambar muncul seperti digambar', 'Ikon dan tulisan muncul bertahap di latar putih, ditemani narasi.', 'Materi edukasi, informasi publik', 'Topik dan poin utama', 'standar', 30),
  ('ugc-edit', 'UGC dari Video Anda', 'Footage Anda, kami edit', 'Video yang Anda rekam sendiri dipotong, diberi teks, subtitle dan musik.', 'Review produk, behind the scene, testimoni', 'Rekaman video dari ponsel', 'standar', 40),
  ('stock-cinematic', 'Cinematic Stock', 'Footage berlisensi + narasi', 'Potongan video stok berlisensi yang disusun sinematik dengan narasi dan teks.', 'Brand awareness, pariwisata, properti', 'Gambaran suasana yang diinginkan', 'standar', 50),
  ('ilustrasi-2d', 'Ilustrasi 2D', 'Karakter & ilustrasi siap pakai', 'Ilustrasi datar yang bergerak sederhana, memakai aset ilustrasi yang sudah tersedia.', 'Cerita ringan, konten anak muda', 'Alur cerita singkat', 'standar', 60),
  ('presenter-ai', 'Presenter AI', 'Pembawa acara digital', 'Presenter AI di pembuka dan penutup, sisanya motion graphic. Durasi presenter 15–20 detik.', 'Pengumuman resmi, perkenalan brand', 'Naskah yang disetujui', 'quote', 70),
  ('cinematic-ai', 'Cinematic AI', 'Adegan dibuat AI', 'Adegan sinematik yang dibuat model video AI. Biaya mengikuti jumlah detik adegan.', 'Iklan premium, konsep kreatif', 'Konsep adegan', 'quote', 80)
;

-- Cache isi halaman dari link pelanggan. Hanya server (service role) yang menulis/membaca;
-- tanpa policy, anon dan authenticated tidak punya akses.
create table public.source_cache (
  url_hash text primary key,
  url text not null,
  title text not null default '',
  content jsonb not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '6 hours'
);

create index source_cache_expires_idx on public.source_cache (expires_at);

alter table public.source_cache enable row level security;
revoke all on public.source_cache from anon, authenticated;
