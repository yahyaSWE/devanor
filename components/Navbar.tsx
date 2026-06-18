"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./Button";
import { nav, site } from "@/lib/site";

type SessionUser = { email: string; role: "ADMIN" | "CUSTOMER" } | null;

export function Navbar({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/portal";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        solid
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link href="/" className="flex items-center" aria-label={site.name}>
            <Image
              src="/logo.png"
              alt={site.name}
              width={1339}
              height={328}
              priority
              className="h-11 w-auto"
            />
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[15px] font-medium transition-colors hover:text-foreground ${
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
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
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
