import { requireUser } from "@/lib/auth-helpers";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  return (
    <div className="flex min-h-full flex-col">
      <DashboardHeader label="Support Portal" email={session.user.email ?? ""} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
