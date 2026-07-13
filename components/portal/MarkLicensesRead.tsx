"use client";

import { useEffect } from "react";
import { markItemsRead } from "@/lib/actions/portal";

/**
 * Marks the customer's visible licenses as seen when the Licenses tab opens, so
 * the nav badge clears on the next navigation. Fire-and-forget: the NEW badges
 * stay visible for the current visit.
 */
export function MarkLicensesRead({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length) markItemsRead("LICENSE", ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
