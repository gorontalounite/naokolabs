-- Penyimpanan footage pelanggan (P5). Bucket privat: tanpa policy untuk anon/authenticated.
-- Semua akses lewat server (service role): URL unggah dan URL baca bertanda tangan.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'footage', 'footage', false, 52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
