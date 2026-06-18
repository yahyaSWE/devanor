import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:px-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Image
            src="/logo.png"
            alt={site.name}
            width={1339}
            height={328}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-muted">{site.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book-demo" className="transition-colors hover:text-accent">
                Book a Demo
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-accent">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{site.contact.address}</li>
            <li>
              <a
                href={site.contact.phoneHref}
                className="transition-colors hover:text-accent"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={site.contact.whatsappHref}
                className="transition-colors hover:text-accent"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={site.contact.emailHref}
                className="transition-colors hover:text-accent"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 lg:px-10 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2018 Devanor Solutions. All rights reserved.</span>
          <span>Official Zuken Partner · Dubai, UAE</span>
        </div>
      </div>
    </footer>
  );
}
