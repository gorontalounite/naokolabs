import type { LucideIcon } from "lucide-react";

export function PageHeader({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: React.ReactNode; icon?: LucideIcon; action?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{Icon && <Icon size={28} aria-hidden="true" />}{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
