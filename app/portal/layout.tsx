import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, visibilityFilter } from "@/lib/portal";
import { unreadCount } from "@/lib/portal-reads";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SubNav, type SubNavItem } from "@/components/SubNav";
import { ZendeskChat } from "@/components/portal/ZendeskChat";
import { IdleLogout } from "@/components/IdleLogout";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const clientId = user?.clientId ?? null;

  // Load the ids/updatedAt of everything this customer can see, then count how
  // many are new/edited since they last looked (drives the nav badges).
  const [downloads, tutorials, licenses] = await Promise.all([
    prisma.download.findMany({
      where: { AND: [{ active: true }, visibilityFilter(clientId)] },
      select: { id: true, updatedAt: true },
    }),
    prisma.tutorial.findMany({
      where: { AND: [{ active: true }, visibilityFilter(clientId)] },
      select: { id: true, updatedAt: true },
    }),
    clientId
      ? prisma.license.findMany({
          where: { clientId },
          select: { id: true, updatedAt: true },
        })
      : Promise.resolve([]),
  ]);

  const [downloadNew, tutorialNew, licenseNew] = await Promise.all([
    unreadCount(session.user.id, "DOWNLOAD", downloads),
    unreadCount(session.user.id, "TUTORIAL", tutorials),
    unreadCount(session.user.id, "LICENSE", licenses),
  ]);

  const portalNav: SubNavItem[] = [
    { label: "Overview", href: "/portal" },
    { label: "Support", href: "/portal/support" },
    { label: "Downloads", href: "/portal/downloads", count: downloadNew },
    { label: "Tutorials", href: "/portal/tutorials", count: tutorialNew },
    { label: "Licenses", href: "/portal/licenses", count: licenseNew },
    { label: "Account", href: "/portal/account" },
  ];

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
