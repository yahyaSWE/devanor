"use client";

import { useRouter } from "next/navigation";

/**
 * Returns the visitor to the previous page at the exact scroll position they
 * left (App Router restores scroll on back navigation).
 */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground ${
        className ?? ""
      }`}
    >
      <span aria-hidden>←</span> Go back
    </button>
  );
}
