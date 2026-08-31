import type { ReactNode } from "react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="dashboard-shell">
      <DashboardNav />
      <div className="dashboard-route">{children}</div>
    </div>
  );
}
