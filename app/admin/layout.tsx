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
      {role === "SUPPORT" && (
        <div className="border-b border-border bg-accent/10">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div>
              <p className="font-semibold">Customer support chat</p>
              <p className="text-sm text-muted">
                Open Chatwoot to view and reply to customer conversations.
              </p>
            </div>
            <a
              href="https://chatwoot-rswkm-u77951.vm.elestio.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:brightness-110"
            >
              Open Chatwoot ↗
            </a>
          </div>
        </div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
