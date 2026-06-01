"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./Button";
import { nav, site } from "@/lib/site";

type SessionUser = { email: string; role: "ADMIN" | "CUSTOMER" } | null;

export function Navbar({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/portal";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[#04110d] text-sm font-bold">
            D
          </span>
          <span className="text-[15px]">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname.startsWith(item.href) ? "text-foreground" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <ButtonLink href={dashboardHref} variant="outline">
              Dashboard
            </ButtonLink>
          ) : (
            <ButtonLink href="/login" variant="ghost">
              Login
            </ButtonLink>
          )}
          <ButtonLink href="/book-demo">Book a Demo</ButtonLink>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-foreground" />
            <span className="block h-0.5 w-6 bg-foreground" />
            <span className="block h-0.5 w-6 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-muted hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3">
              <ButtonLink
                href={user ? dashboardHref : "/login"}
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {user ? "Dashboard" : "Login"}
              </ButtonLink>
              <ButtonLink href="/book-demo" onClick={() => setOpen(false)}>
                Book a Demo
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
