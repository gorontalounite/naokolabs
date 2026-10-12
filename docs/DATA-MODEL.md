# Model data konseptual

Status: DRAF; bukan migration SQL final. Migration pertama (identitas, workspace, brand + RLS) ada di `supabase/migrations/`.

| Kelompok | Entitas | Hubungan/tanggung jawab |
|---|---|---|
| Identitas | users, organizations, memberships | User dapat menjadi anggota organisasi dengan peran tertentu |
| Klien | brands, brand_assets, client_categories | Organisasi memiliki brand; kategori industri tidak memberikan izin |
| Katalog | services, price_versions, reference_presets, template_versions | CMS menyimpan harga dan template terversi |
| Pesanan | orders, order_items | Order berisi 1..N item; item video/carousel memiliki spesifikasi dan harga snapshot |
| Brief | brief_versions, assets, asset_bindings | Aset dimiliki organisasi; binding menghubungkan aset ke scene/slide |
| Perencanaan | plan_versions, script_versions, scenes, slides, caption_versions | Rencana menghubungkan versi naskah/media/caption yang tampil saat approval |
| Persetujuan | approvals | Actor, waktu, jenis approval, versi snapshot/hash, dan lingkup |
| Payment | payments, payment_events, refunds | Event provider unik; perubahan status diverifikasi server |
| Produksi | jobs, job_steps, provider_requests, outbox_events | Checkpoint, attempt, lease, provider ID, status, deduplikasi |
| Keluaran | artifacts, artifact_versions, quality_checks | Path privat, format, durasi/dimensi, checksum, hasil QC |
| Revisi | revision_requests, revision_changes | Jenis koreksi, target scene/slide/segmen, versi sebelum/sesudah |
| Publikasi | social_connections, publications, publish_attempts | Akun provider, izin/token expiry; per akun dan versi hasil |
| Operasional | usage_ledger, budget_reservations, audit_events | Estimasi/aktual biaya, keputusan, akses operator |

## Invarian

- organization_id ada pada data milik klien. Foreign key dan pemeriksaan server mencegah relasi lintas organisasi, bukan hanya filter tampilan.
- Harga pada order tidak mengikuti perubahan katalog setelah pembayaran.
- Satu approval tidak mengizinkan versi berikutnya secara otomatis.
- Social connection milik organisasi dan memiliki actor yang berwenang. Token terenkripsi dan tidak menjadi field yang dapat dibaca klien.
- Uniqueness untuk payment event, dispatch item/version/stage, dan publication intent; aturan key mengikuti ID yang tersedia pada provider.
- Asset memiliki jenis, ukuran, checksum, metadata, status validasi, pemilik, dan kebijakan retensi.
- Simpan UTC dan IANA timezone untuk jadwal; jangan menggandakan konversi saat ditampilkan.
- Status operasi tidak menyimpan rahasia/raw credential pada error log.

## Perlu diputuskan

Hak member, brand count, retensi, penghapusan akun, audit retention, apakah caption editing setelah output acceptance memerlukan approval caption baru, dan kebijakan revisi terjadwal. Usulan: setiap perubahan yang memengaruhi publikasi harus tampil pada konfirmasi publikasi baru.

## Langganan dan kuota (D-14)

plans/plan_versions (nama, harga, kuota per periode, fitur, masa berlaku); subscriptions (organization_id, plan_version, status, periode mulai/akhir, provider_ref); quota_ledger (organization_id, subscription_id, periode, delta, alasan: grant/consume/refund/adjust, video_id, idempotency_key unik); premium_quotes untuk gaya premium. Saldo kuota = jumlah delta pada periode berjalan; pemakaian dan pengembalian hanya lewat fungsi server dalam satu transaksi dengan approval.

Tabel videos menggantikan order_items untuk produk video: input_mode (link/naskah/ide), source_url/source_text, duration, tone, style_id, voice, music, subtitles, status, plan_version aktif.

## Arsip: tambahan PAYG (digantikan D-14)

price_versions diperluas ke pricing_profiles, component_rates dan quantity_tiers (atau struktur ekuivalen): format/gaya, envelope, unit, jumlah, included allowances, harga dan masa berlaku. quotes/quote_items menyimpan konfigurasi, currency, tier, rincian harga dan expiry sebelum checkout. order_items menyimpan snapshot quote yang dibayar. change_requests menyimpan perubahan scope dan quote tambahan. usage_ledger tetap mencatat biaya aktual provider yang terpisah dari tagihan klien; batch parent mengagregasi item tanpa menduplikasi biaya bersama. Jumlah naskah baru/varian/output dan detik generated footage adalah field eksplisit.

## Entitas preview dan pustaka produksi

Tambahkan reference_assets/reference_annotations (sumber, hak, hasil analisis yang nyata), template_profiles (parameter/batas/capability/version), prompt_versions (global/tahap/profile dan status), preview_manifests/preview_artifacts (plan_version, timing_basis, placeholder, limitations), plan_comments/plan_changes (scene/slide/version/diff) dan validation_results. Relasi memakai organization_id sesuai pemilik; template global layanan tidak memberi akses pada artefak privat klien. Approval menyimpan snapshot manifest/hash dan quote version. Asset binding mencatat crop serta source in/out untuk UGC; source timecode berbeda dari timeline.
