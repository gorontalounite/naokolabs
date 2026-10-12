import { PageHeader } from "@/components/dashboard/PageHeader";
import { PasswordForm } from "@/components/dashboard/PasswordForm";

export const metadata = { title: "Ubah password" };

export default function PasswordPage() {
  return (
    <div className="narrow">
      <PageHeader title="Ubah password" subtitle="Buat password baru untuk akun ini." />
      <PasswordForm />
    </div>
  );
}
