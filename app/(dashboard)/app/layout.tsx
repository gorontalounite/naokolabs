import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { getViewer } from "@/lib/workspace";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts sudah mengarahkan tamu ke /masuk; pemeriksaan ini lapisan kedua di server.
  const viewer = await getViewer();
  if (!viewer) redirect("/masuk");

  const footer = viewer.mode === "preview" ? "Mode pratinjau · data contoh" : viewer.workspaces[0]?.name ?? "Dashboard Content";
  return <AppShell footer={footer}>{children}</AppShell>;
}
