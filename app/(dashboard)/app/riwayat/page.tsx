import { History } from "lucide-react";
import { HistoryList } from "@/components/dashboard/HistoryList";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata = { title: "Riwayat Video" };

export default function HistoryPage() {
  return (
    <>
      <PageHeader icon={History} title="Riwayat Video" subtitle="Semua video yang pernah Anda buat, dari rencana sampai terbit. Data di bawah adalah contoh." />
      <HistoryList />
    </>
  );
}
