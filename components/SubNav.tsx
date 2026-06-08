"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SubNavItem = { label: string; href: string };

export function SubNav({ items, base }: { items: SubNavItem[]; base: string }) {
  const path = usePathname();

  return (
    <div className="border-b border-border bg-surface/30">
      <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-6">
        {items.map((item) => {
          const active =
            path === item.href ||
            (item.href !== base && path.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
                active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
