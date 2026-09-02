import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, downloadAudience, tutorialAudience } from "@/lib/portal";
import { unreadCount } from "@/lib/portal-reads";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SubNav, type SubNavItem } from "@/components/SubNav";
import { ChatwootChat } from "@/components/portal/ChatwootChat";
import { IdleLogout } from "@/components/IdleLogout";
import { chatwootIdentifierHash } from "@/lib/chatwoot";

const CHATWOOT_BASE_URL = "https://chatwoot-rswkm-u77951.vm.elestio.app";
const CHATWOOT_WEBSITE_TOKEN = "qcSCVW2p1p742iE9ECkdMWxC";

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
      where: {
        AND: [{ active: true }, downloadAudience(clientId, session.user.id)],
      },
      select: { id: true, updatedAt: true },
    }),
    prisma.tutorial.findMany({
      where: {
        AND: [{ active: true }, tutorialAudience(clientId, session.user.id)],
      },
      select: { id: true, updatedAt: true },
    }),
    clientId
      ? prisma.license.findMany({
          where: { clientId },
          select: { id: true, updatedAt: true, active: true },
        })
      : Promise.resolve([]),
  ]);

  // Deactivated licenses stay flagged (persistent red badge); newly added/edited
  // active ones count as unread until the customer opens the tab. Counting unread
  // only among active licenses avoids double-counting a just-deactivated one.
  const activeLicenses = licenses.filter((l) => l.active);
  const deactivatedCount = licenses.length - activeLicenses.length;

  const [downloadNew, tutorialNew, licenseUnread] = await Promise.all([
    unreadCount(session.user.id, "DOWNLOAD", downloads),
    unreadCount(session.user.id, "TUTORIAL", tutorials),
    unreadCount(session.user.id, "LICENSE", activeLicenses),
  ]);
  const licenseNew = licenseUnread + deactivatedCount;

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
      <DashboardHeader
        label="Support Portal"
        email={session.user.email ?? ""}
        company={user?.client ?? null}
      />
      <SubNav items={portalNav} base="/portal" />
      <main className="flex-1">{children}</main>
      {user && (
        <ChatwootChat
          baseUrl={CHATWOOT_BASE_URL}
          websiteToken={CHATWOOT_WEBSITE_TOKEN}
          user={{
            identifier: user.id,
            identifierHash: chatwootIdentifierHash(user.id),
            name: user.name ?? user.email,
            email: user.email,
            phone: user.phone ?? undefined,
            companyId: user.client?.id,
            companyName: user.client?.name,
            jobTitle: user.title ?? undefined,
          }}
        />
      )}
    </div>
  );
}
