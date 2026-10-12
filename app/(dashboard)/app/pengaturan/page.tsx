import { Settings } from "lucide-react";
import Link from "next/link";
import { BrandKitForm } from "@/components/dashboard/BrandKitForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getViewer } from "@/lib/workspace";

export const metadata = { title: "Pengaturan & Brand Kit" };

const tabs = [
  { id: "brand", label: "Brand Kit" },
  { id: "profil", label: "Profil & Keamanan" },
] as const;

const roleLabel: Record<string, string> = { owner: "Pemilik", member: "Anggota" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: raw } = await searchParams;
  const tab = tabs.find((t) => t.id === raw)?.id ?? "brand";
  const viewer = tab === "profil" ? await getViewer() : null;

  return (
    <>
      <PageHeader icon={Settings} title="Pengaturan & Brand Kit" />
      <nav className="segment segment-scroll" aria-label="Bagian pengaturan" style={{ marginBottom: 20 }}>
        {tabs.map((t) => (
          <Link key={t.id} href={`/app/pengaturan?tab=${t.id}`} aria-current={tab === t.id ? "page" : undefined}>{t.label}</Link>
        ))}
      </nav>

      {tab === "brand" && <BrandKitForm />}

      {tab === "profil" && (
        <div className="narrow stack">
          {!viewer || viewer.mode === "preview" ? (
            <p className="notice">Mode pratinjau: login belum aktif, jadi belum ada profil.</p>
          ) : (
            <>
              <section className="panel stack-s">
                <p className="eyebrow">Profil</p>
                <p className="section-title">{viewer.fullName ?? "Nama belum diisi"}</p>
                <p className="hint">{viewer.email}</p>
              </section>
              <section className="panel stack-s">
                <p className="eyebrow">Workspace</p>
                {viewer.workspaces.map((w) => <p key={w.id}><strong>{w.name}</strong> <span className="badge">{roleLabel[w.role] ?? w.role}</span></p>)}
              </section>
              <Link href="/app/pengaturan/password" className="btn btn-block btn-center">Ubah password</Link>
              <form action="/auth/keluar" method="post"><button type="submit" className="btn btn-dark btn-block btn-center">Keluar</button></form>
            </>
          )}
        </div>
      )}

    </>
  );
}
