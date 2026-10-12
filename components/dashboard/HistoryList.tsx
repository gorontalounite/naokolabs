"use client";

import { Film, History, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { findStyle, sampleVideos, statusInfo, type VideoStatus } from "@/lib/video-data";

const filters: { id: "semua" | "aksi" | "proses" | "selesai"; label: string; match: (s: VideoStatus) => boolean }[] = [
  { id: "semua", label: "Semua", match: () => true },
  { id: "aksi", label: "Perlu tindakan", match: (s) => s === "rencana" || s === "hasil" || s === "siap" },
  { id: "proses", label: "Diproduksi", match: (s) => s === "produksi" || s === "perbaikan" },
  { id: "selesai", label: "Terjadwal & terbit", match: (s) => s === "terjadwal" || s === "terbit" },
];

const tone: Record<VideoStatus, string> = {
  rencana: "badge-accent", produksi: "badge-warning", hasil: "badge-accent", perbaikan: "badge-warning", siap: "badge-success", terjadwal: "badge-dark", terbit: "badge-success",
};

export function HistoryList() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("semua");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const f = filters.find((x) => x.id === filter)!;
    const q = query.trim().toLowerCase();
    return sampleVideos.filter((v) => f.match(v.status) && (!q || v.title.toLowerCase().includes(q)));
  }, [filter, query]);

  return (
    <div className="stack">
      <div className="input-icon">
        <Search size={18} aria-hidden="true" />
        <input className="input" type="search" placeholder="Cari judul video…" aria-label="Cari judul video" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="chips" role="group" aria-label="Filter status">
        {filters.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <span className="empty-icon"><History size={26} aria-hidden="true" /></span>
          <h2>Belum ada video di sini</h2>
          <p>Mulai video pertama Anda dari link produk, naskah, atau satu ide.</p>
          <Link href="/app" className="btn btn-primary">Buat video sekarang →</Link>
        </div>
      ) : (
        <ul className="stack-s" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((v) => {
            const info = statusInfo[v.status];
            return (
              <li key={v.id}>
                <Link href={`/app/video/${v.id}`} className="video-row">
                  <span className="video-thumb" aria-hidden="true"><Film size={18} /></span>
                  <span>
                    <span className="video-row-title">{v.title}</span>
                    <span className="row hint">{findStyle(v.styleId)?.name} · {v.duration} detik · {new Date(v.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  </span>
                  <span className="row">
                    <span className={`badge ${tone[v.status]}`}>{info.label}</span>
                    {info.action && <span className="text-link">{info.action} →</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
