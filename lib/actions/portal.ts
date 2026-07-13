"use server";

import type { ItemType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";

/**
 * Marks one or more items as seen by the signed-in customer, so they stop
 * showing as "new" in the portal. Called from the download/view buttons and
 * when the licenses tab is opened.
 */
export async function markItemsRead(
  itemType: ItemType,
  itemIds: string[],
): Promise<void> {
  const session = await requireUser();
  const userId = session.user.id;
  if (!userId || itemIds.length === 0) return;

  const now = new Date();
  await Promise.all(
    itemIds.map((itemId) =>
      prisma.itemView.upsert({
        where: { userId_itemType_itemId: { userId, itemType, itemId } },
        create: { userId, itemType, itemId, seenAt: now },
        update: { seenAt: now },
      }),
    ),
  );
}
