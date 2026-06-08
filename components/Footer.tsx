import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
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
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book-demo" className="hover:text-foreground">
                Book a Demo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{site.contact.address}</li>
            <li>
              <a href={site.contact.phoneHref} className="hover:text-foreground">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={site.contact.whatsappHref} className="hover:text-foreground">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
