import { requireAdmin } from "@/lib/auth-helpers";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SubNav } from "@/components/SubNav";

const adminNav = [
  { label: "Clients & logins", href: "/admin" },
  { label: "Downloads", href: "/admin/downloads" },
  { label: "Tutorials", href: "/admin/tutorials" },
  { label: "Licenses", href: "/admin/licenses" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-full flex-col">
      <DashboardHeader label="Admin" email={session.user.email ?? ""} />
      <SubNav items={adminNav} base="/admin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
