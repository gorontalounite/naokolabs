import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata = { title: "Masuk" };

const errors: Record<string, string> = {
  link: "Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru.",
  google: "Masuk dengan Google gagal. Coba lagi.",
  config: "Login belum aktif. Supabase NaokoLabs belum disambungkan.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="auth">
      <div className="auth-card stack">
        <Link href="/" className="topbar-brand">NaokoLabs</Link>
        <div>
          <h1 className="page-title">Masuk</h1>
          <p className="page-subtitle">Kelola pesanan, persetujuan dan jadwal konten.</p>
        </div>

        {params.error && errors[params.error] && <p className="field-error" role="alert">{errors[params.error]}</p>}

        {!isSupabaseConfigured && (
          <p className="notice">
            Login belum aktif karena Supabase NaokoLabs belum disambungkan. Untuk sekarang,
            dashboard dibuka dengan data contoh.
          </p>
        )}

        <LoginForm next={next} disabled={!isSupabaseConfigured} />

        {!isSupabaseConfigured && <Link href="/app" className="btn btn-primary">Buka pratinjau dashboard</Link>}
      </div>
    </main>
  );
}
