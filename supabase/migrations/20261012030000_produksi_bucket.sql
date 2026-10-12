-- P6: hasil produksi dan antrean pekerjaan. Bucket privat; akses hanya lewat server dan worker (service role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('produksi', 'produksi', false, 104857600, array['video/mp4', 'application/json'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Footage juga menampung voice-over dan backsound milik pelanggan.
update storage.buckets
  set allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm',
                                 'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/aac']
  where id = 'footage';
