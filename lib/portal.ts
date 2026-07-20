import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Load the logged-in user together with their linked client. */
export async function getPortalUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { client: true },
  });
}

/**
 * Audience rule for downloads and tutorials (union): an item is visible when it
 * targets nobody (= all customers), the user's company, or the user personally.
 */
function audienceOr(clientId: string | null, userId: string) {
  return [
    { AND: [{ clients: { none: {} } }, { users: { none: {} } }] },
    ...(clientId ? [{ clients: { some: { id: clientId } } }] : []),
    { users: { some: { id: userId } } },
  ];
}

export function downloadAudience(
  clientId: string | null,
  userId: string,
): Prisma.DownloadWhereInput {
  return { OR: audienceOr(clientId, userId) };
}

export function tutorialAudience(
  clientId: string | null,
  userId: string,
): Prisma.TutorialWhereInput {
  return { OR: audienceOr(clientId, userId) };
}

/** Same union rule, applied to an already-loaded item (e.g. in a route). */
export function canSee(
  item: { clients: { id: string }[]; users: { id: string }[] },
  clientId: string | null,
  userId: string,
): boolean {
  if (item.clients.length === 0 && item.users.length === 0) return true;
  if (clientId && item.clients.some((c) => c.id === clientId)) return true;
  return item.users.some((u) => u.id === userId);
}

/** Human-readable audience for admin lists. */
export function audienceLabel(item: {
  clients: { name: string }[];
  users: { name: string | null; email: string }[];
}): string {
  if (item.clients.length === 0 && item.users.length === 0) {
    return "All customers";
  }
  const parts: string[] = [];
  if (item.clients.length > 0) {
    parts.push(item.clients.map((c) => c.name).join(", "));
  }
  if (item.users.length > 0) {
    parts.push(
      item.users.length === 1
        ? (item.users[0].name ?? item.users[0].email)
        : `${item.users.length} employees`,
    );
  }
  return parts.join(" · ");
}
