import {
  hasAdminPermission,
  requireInternal,
} from "@/lib/auth-helpers";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SubNav } from "@/components/SubNav";
import { IdleLogout } from "@/components/IdleLogout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireInternal();
  const role = session.user.role;
  const adminNav = [
    ...(hasAdminPermission(role, "companies")
      ? [{ label: "Companies", href: "/admin" }]
      : []),
    ...(hasAdminPermission(role, "content")
      ? [
          { label: "Downloads", href: "/admin/downloads" },
          { label: "Tutorials", href: "/admin/tutorials" },
        ]
      : []),
    ...(hasAdminPermission(role, "licenses")
      ? [{ label: "Licenses", href: "/admin/licenses" }]
      : []),
    ...(hasAdminPermission(role, "users")
      ? [{ label: "Internal users", href: "/admin/internal-users" }]
      : []),
    { label: "Account", href: "/admin/account" },
  ];
  const label =
    role === "ADMIN" ? "Full Admin" : role === "SUPPORT" ? "Support" : "CRM";
  return (
    <div className="flex min-h-full flex-col">
      <IdleLogout />
      <DashboardHeader label={label} email={session.user.email ?? ""} />
      <SubNav items={adminNav} base="/admin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
