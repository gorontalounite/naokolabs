import Link from "next/link";

export const metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main className="auth">
      <div className="auth-card stack">
        <Link href="/" className="topbar-brand">NaokoLabs</Link>
        <div>
          <h1 className="page-title">Masuk</h1>
          <p className="page-subtitle">Kelola pesanan, persetujuan dan jadwal konten.</p>
        </div>
        <p className="notice">
          Login belum aktif. Metode login dan database dipilih pada tahap berikutnya
          (BUILD-PLAN tahap 3). Untuk sekarang, dashboard dibuka dengan data contoh.
        </p>
        <form className="stack" aria-describedby="login-disabled">
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" autoComplete="email" placeholder="nama@contoh.com" disabled />
          </div>
          <button type="submit" className="btn" disabled>Kirim tautan masuk</button>
          <p id="login-disabled" className="sr-only">Formulir login belum aktif.</p>
        </form>
        <Link href="/app" className="btn btn-primary">Buka pratinjau dashboard</Link>
      </div>
    </main>
  );
}
