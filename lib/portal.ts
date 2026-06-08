import { prisma } from "@/lib/db";

/** Load the logged-in user together with their linked client. */
export async function getPortalUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { client: true },
  });
}

/**
 * Prisma `where` filter for client-scoped content: a customer sees content
 * with no client (global) plus content assigned to their own client.
 */
export function visibilityFilter(clientId: string | null) {
  return clientId
    ? { OR: [{ clientId: null }, { clientId }] }
    : { clientId: null };
}
