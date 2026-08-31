import type { ReactNode } from "react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { PublicOnboarding } from "@/components/account/public-onboarding";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/dashboard");

  return (
    <div className="dashboard-shell">
      <DashboardNav />
      <div className="dashboard-route"><PublicOnboarding userId={user.id} />{children}</div>
    </div>
  );
}
