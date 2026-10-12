import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { getViewer } from "@/lib/workspace";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts sudah mengarahkan tamu ke /masuk; pemeriksaan ini lapisan kedua di server.
  const viewer = await getViewer();
  if (!viewer) redirect("/masuk");

  const account =
    viewer.mode === "preview"
      ? { name: "Tamu", workspace: "Pratinjau", preview: true }
      : { name: viewer.fullName ?? viewer.email, workspace: viewer.workspaces[0]?.name ?? "Workspace", preview: false };

  return <AppShell account={account}>{children}</AppShell>;
}
