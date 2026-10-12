import Link from "next/link";
import { PageHeader } from "./PageHeader";

export function NotDesigned({ title, purpose }: { title: string; purpose: string }) {
  return (
    <div className="narrow">
      <PageHeader title={title} subtitle={purpose} />
      <div className="empty stack">
        <p>Layar ini belum ada di wireframe Figma. Isinya disusun setelah desain menu ini tersedia.</p>
        <Link href="/app" className="text-link">Kembali ke Beranda →</Link>
      </div>
    </div>
  );
}
