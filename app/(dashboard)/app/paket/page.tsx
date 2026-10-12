import { Check, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata = { title: "Paket & Kuota" };

// Harga dan kuota belum ditetapkan (docs/DECISIONS.md D-14). Jangan isi angka sebelum biaya produksi nyata diukur.
const plans = [
  {
    name: "Starter",
    desc: "Untuk usaha yang baru mulai rutin posting video.",
    features: ["Kuota video per bulan", "Semua gaya standar", "Voice-over, musik & subtitle otomatis", "Brand kit (logo, warna, penutup)", "Unduh MP4 1080×1920 + caption"],
  },
  {
    name: "Bisnis",
    desc: "Untuk brand yang posting video setiap minggu.",
    featured: true,
    features: ["Kuota video lebih besar", "Semua fitur Starter", "Beberapa brand dalam satu workspace", "Prioritas antrean produksi"],
  },
  {
    name: "Agensi",
    desc: "Untuk agensi yang mengelola banyak klien.",
    features: ["Kuota video terbesar", "Semua fitur Bisnis", "Workspace terpisah per klien", "Anggota tim", "Laporan per klien"],
  },
];

export default function PlansPage() {
  return (
    <>
      <PageHeader icon={Sparkles} title="Paket & Kuota" subtitle="Langganan bulanan dengan kuota video. Rencana video selalu gratis; kuota terpakai saat produksi dimulai." />

      <div className="grid-2">
        <div className="panel stack-s">
          <p className="eyebrow">Status akun</p>
          <p className="section-title">Belum berlangganan</p>
          <div className="meter" aria-hidden="true"><span style={{ width: "0%" }} /></div>
          <p className="hint">Kuota bulan ini: 0 video.</p>
        </div>
        <div className="panel stack-s">
          <p className="eyebrow">Durasi tagihan</p>
          <div className="segment" aria-label="Durasi tagihan (belum aktif)">
            <button type="button" aria-pressed="true" disabled>Bulanan</button>
            <button type="button" disabled>3 bulan</button>
            <button type="button" disabled>Tahunan</button>
          </div>
          <p className="hint">Diskon durasi panjang ditetapkan bersama harga paket.</p>
        </div>
      </div>

      <p className="notice notice-warning" style={{ margin: "20px 0" }}>Harga dan kuota tiap paket sedang dihitung dari biaya produksi video yang sebenarnya. Pembayaran belum dibuka.</p>

      <div className="plans">
        {plans.map((p) => (
          <article key={p.name} className="plan" data-featured={p.featured ? "true" : undefined}>
            {p.featured && <span className="badge badge-accent">Direkomendasikan</span>}
            <h2>{p.name}</h2>
            <p className="card-text">{p.desc}</p>
            <p className="plan-price">Segera <small>/bulan</small></p>
            <ul>
              {p.features.map((f) => <li key={f}><Check size={16} aria-hidden="true" /> {f}</li>)}
            </ul>
            <button type="button" className="btn btn-block btn-center" disabled>Belum tersedia</button>
          </article>
        ))}
      </div>
    </>
  );
}
