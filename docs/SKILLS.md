# Skill relevan dari skills.sh

Status: SELEKSI, belum dipasang. Diperiksa 11 Oktober 2026 melalui halaman skill dan repo sumber. Statistik berubah; nilai berikut perkiraan yang ditampilkan saat pemeriksaan, bukan penilaian kualitas tunggal.

## Pilihan utama

| Skill dan sumber | Dipakai untuk/kapan | Instalasi sekitar | Stars repo sekitar |
|---|---|---:|---:|
| [doc-coauthoring — Anthropic](https://www.skills.sh/anthropics/skills/doc-coauthoring) | Merapikan BRD/PRD/ARD dan menguji kejelasan spesifikasi | 89,6 ribu | 180,2 ribu |
| [frontend-design — Anthropic](https://www.skills.sh/anthropics/skills/frontend-design) | Desain dashboard, form dan identitas visual setelah brief UI jelas | 970 ribu | 180,2 ribu |
| [vercel-react-best-practices — Vercel](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) | Implementasi/review React/Next.js, fetching dan performa | 785,8 ribu | 32,1 ribu |
| [supabase-postgres-best-practices — Supabase](https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices) | Schema, index, query, RLS jika Postgres/Supabase dipilih | 439 ribu | 2,7 ribu |
| [webapp-testing — Anthropic](https://www.skills.sh/anthropics/skills/webapp-testing) | Browser testing login–brief–payment–approval–hasil–schedule | 174,1 ribu | 180,2 ribu |
| [web-design-guidelines — Vercel](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Review aksesibilitas dan interaksi form/dashboard | 718,6 ribu | 32,1 ribu |
| [remotion-best-practices — Remotion](https://www.skills.sh/remotion-dev/skills/remotion-best-practices) | Komposisi, timing, media, teks, audio dan render video/still | 597,1 ribu | 5 ribu |
| [remotion-saas — Remotion](https://www.skills.sh/remotion-dev/skills/remotion-saas) | Integrasi preview/player dan render dalam produk dashboard | 128,8 ribu | 4,9–5 ribu |

Repo diperiksa: [Anthropic](https://github.com/anthropics/skills), [Vercel](https://github.com/vercel-labs/agent-skills), [Supabase](https://github.com/supabase/agent-skills), [Remotion](https://github.com/remotion-dev/skills). Popularitas/reputasi membantu seleksi; tetap baca instruksi dan izin sebelum digunakan. Halaman beberapa skill menunjukkan audit warning; status audit bukan bukti aman/tidak aman untuk seluruh konteks.

## Contoh perintah, belum dieksekusi

```bash
npx skills add anthropics/skills --skill doc-coauthoring
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
npx skills add anthropics/skills --skill webapp-testing
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add remotion-dev/skills --skill remotion-best-practices
npx skills add remotion-dev/skills --skill remotion-saas
```

Jalankan dari repository aplikasi dan pilih target agent yang benar. Simpan versi/commit setelah memilih; jangan otomatis mengambil versi terbaru pada setiap job production. Remotion best practices mencakup/routing skill Remotion lain; muat referensi khusus sesuai pekerjaan, bukan semuanya.

## Skill coding berbeda dari skill produksi

Coding: dokumentasi, UI, React, database, testing dipakai agen pengembang.

Produksi: runtime aplikasi perlu paket skill/prompt terversi yang secara eksplisit dimuat ke harness OpenAI/Anthropic. Skill bukan API key, payment integration, queue, renderer, atau izin sosial media.

## Skill proyek yang perlu dibuat sendiri

Usulan, belum dibuat: brief-to-plan (validasi sumber, script/storyboard/caption terstruktur); brand-content-production (binding aset, template, timing, brand rules); content-quality-review (render/audio/slides); scoped-revision (tiga jenis koreksi); social-publishing-contract (capability, confirmation, scheduler/reconciliation).

Skill copywriting umum tidak dipilih otomatis: perlu menilai kemampuan Bahasa Indonesia, kesetiaan sumber, style brand, dan output schema terhadap pilot nyata. Skill Remotion membantu teknis animasi; strategi/editorial dan caption tetap perlu kontrak kualitas tersendiri.

## Arahan terbaru

Skill akan dipasang pada aplikasi di tahap implementasi. Tahap analisis ini hanya menentukan katalog, input/output, allowance dan pricing profile. Nama skill/preset tidak otomatis menjadi SKU harga; beberapa skill dapat menjalankan satu hasil produksi dan tidak ditagihkan berulang sebagai pekerjaan yang sama.
