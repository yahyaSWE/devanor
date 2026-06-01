import { requireAdmin } from "@/lib/auth-helpers";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-full flex-col">
      <DashboardHeader label="Admin" email={session.user.email ?? ""} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
