import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "./Button";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      {/* Mini CTA row */}
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Ready to streamline your design workflow?
            </h2>
            <p className="mt-2 text-muted">
              Book a tailored demo of E3.Series with our team.
            </p>
          </div>
          <ButtonLink href="/book-demo" className="shrink-0 px-8">
            Book a Demo
          </ButtonLink>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Official Zuken Partner · Dubai, UAE</span>
        </div>
      </div>
    </footer>
  );
}
