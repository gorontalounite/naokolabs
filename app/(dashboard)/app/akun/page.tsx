import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getViewer } from "@/lib/workspace";

export const metadata = { title: "Akun" };

const roleLabel: Record<string, string> = { owner: "Pemilik", member: "Anggota" };

export default async function AccountPage() {
  const viewer = await getViewer();

  if (!viewer || viewer.mode === "preview") {
    return (
      <div className="narrow">
        <PageHeader title="Akun" subtitle="Mode pratinjau dengan data contoh." />
        <p className="notice">Login belum aktif karena Supabase NaokoLabs belum disambungkan.</p>
      </div>
    );
  }

  return (
    <div className="narrow stack">
      <PageHeader title="Akun" subtitle={viewer.email} />
      <section className="card">
        <h2 className="card-title">{viewer.fullName ?? "Nama belum diisi"}</h2>
        <p className="card-text">{viewer.email}</p>
      </section>
      <section aria-labelledby="workspace-title">
        <h2 id="workspace-title" className="section-title">Workspace</h2>
        <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {viewer.workspaces.map((w) => (
            <li key={w.id} className="card">
              <p className="card-title" style={{ fontSize: 16 }}>{w.name}</p>
              <p className="card-text">{roleLabel[w.role] ?? w.role}</p>
            </li>
          ))}
        </ul>
      </section>
      <Link href="/app/akun/password" className="btn">Ubah password</Link>
      <form action="/auth/keluar" method="post">
        <button type="submit" className="btn btn-primary">Keluar</button>
      </form>
    </div>
  );
}
