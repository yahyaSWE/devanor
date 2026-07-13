import type { ItemType } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Map of itemId -> when the user last saw it, for one item type. */
export async function getSeenMap(
  userId: string,
  itemType: ItemType,
): Promise<Map<string, Date>> {
  const rows = await prisma.itemView.findMany({
    where: { userId, itemType },
    select: { itemId: true, seenAt: true },
  });
  return new Map(rows.map((r) => [r.itemId, r.seenAt]));
}

/** An item is unread if never seen, or edited since the user last saw it. */
export function isUnread(
  item: { id: string; updatedAt: Date },
  seen: Map<string, Date>,
): boolean {
  const s = seen.get(item.id);
  return !s || item.updatedAt > s;
}

/** Count unread items of a type for a user (used for the nav badge). */
export async function unreadCount(
  userId: string,
  itemType: ItemType,
  items: { id: string; updatedAt: Date }[],
): Promise<number> {
  if (items.length === 0) return 0;
  const seen = await getSeenMap(userId, itemType);
  return items.reduce((n, it) => n + (isUnread(it, seen) ? 1 : 0), 0);
}
