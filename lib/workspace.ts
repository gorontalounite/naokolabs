import { authRequired, isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type Viewer =
  | { mode: "preview" }
  | { mode: "signed-in"; email: string; fullName: string | null; workspaces: { id: string; name: string; role: string }[] };

// Data akun dibaca lewat RLS: pengguna hanya mendapat workspace tempat ia menjadi anggota.
export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured) return { mode: "preview" };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return authRequired ? null : { mode: "preview" };

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", auth.user.id).maybeSingle(),
    supabase.from("memberships").select("role, organizations(id, name)").eq("user_id", auth.user.id),
  ]);

  const workspaces = (memberships ?? []).flatMap((m) => {
    const org = m.organizations as unknown as { id: string; name: string } | null;
    return org ? [{ id: org.id, name: org.name, role: m.role as string }] : [];
  });

  return { mode: "signed-in", email: auth.user.email ?? "", fullName: profile?.full_name ?? null, workspaces };
}
