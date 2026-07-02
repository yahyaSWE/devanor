import { requireUser } from "@/lib/auth-helpers";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SubNav } from "@/components/SubNav";
import { ZendeskChat } from "@/components/portal/ZendeskChat";
import { IdleLogout } from "@/components/IdleLogout";

const portalNav = [
  { label: "Overview", href: "/portal" },
  { label: "Support", href: "/portal/support" },
  { label: "Downloads", href: "/portal/downloads" },
  { label: "Tutorials", href: "/portal/tutorials" },
  { label: "Licenses", href: "/portal/licenses" },
  { label: "Account", href: "/portal/account" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="flex min-h-full flex-col">
      <IdleLogout />
      <DashboardHeader label="Support Portal" email={session.user.email ?? ""} />
      <SubNav items={portalNav} base="/portal" />
      <main className="flex-1">{children}</main>
      <ZendeskChat
        zendeskKey={process.env.NEXT_PUBLIC_ZENDESK_KEY}
        name={session.user.name}
        email={session.user.email}
      />
    </div>
  );
}
