"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markItemsRead } from "@/lib/actions/portal";

/**
 * Marks the customer's visible licenses as seen when the Licenses tab opens and
 * refreshes so the nav "NEW" badge clears immediately. Only runs when there is
 * something unread (avoids a needless refresh on every visit).
 */
export function MarkLicensesRead({
  ids,
  hasUnread,
}: {
  ids: string[];
  hasUnread: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!hasUnread || ids.length === 0) return;
    markItemsRead("LICENSE", ids).then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
