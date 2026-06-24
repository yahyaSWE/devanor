"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./Button";
import { products, site } from "@/lib/site";

type SessionUser = { email: string; role: "ADMIN" | "CUSTOMER" } | null;

export function Navbar({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
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
  const linkClass = (active: boolean) =>
    `text-[15px] font-medium transition-colors hover:text-accent ${
      active ? "text-accent" : "text-white"
    }`;

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
          {/* Products — dropdown (not a direct link) */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setProductsOpen((v) => !v)}
              aria-expanded={productsOpen}
              className={`flex items-center gap-1 ${linkClass(
                pathname.startsWith("/products"),
              )}`}
            >
              Products
              <span
                className={`text-[10px] transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            {productsOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-64 rounded-2xl border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      onClick={() => setProductsOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {p.name}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-border" />
                  <Link
                    href="/products"
                    onClick={() => setProductsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-surface"
                  >
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/services" className={linkClass(pathname.startsWith("/services"))}>
            Services
          </Link>
          <Link href="/about" className={linkClass(pathname.startsWith("/about"))}>
            About us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <ButtonLink href={dashboardHref} variant="whiteGhost">
              Dashboard
            </ButtonLink>
          ) : (
            <ButtonLink href="/login" variant="whiteGhost">
              Login
            </ButtonLink>
          )}
          <ButtonLink href="/book-demo" variant="white">
            Book a Demo
          </ButtonLink>
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
        <div className="max-h-[80vh] overflow-y-auto border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            <p className="px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Products
            </p>
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {p.name}
              </Link>
            ))}
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg px-2 py-2 text-muted hover:bg-surface hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-muted hover:bg-surface hover:text-foreground"
            >
              About us
            </Link>
            <div className="mt-3 flex flex-col gap-3">
              <ButtonLink
                href={user ? dashboardHref : "/login"}
                variant="white"
                onClick={() => setOpen(false)}
              >
                {user ? "Dashboard" : "Login"}
              </ButtonLink>
              <ButtonLink href="/book-demo" variant="white" onClick={() => setOpen(false)}>
                Book a Demo
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
