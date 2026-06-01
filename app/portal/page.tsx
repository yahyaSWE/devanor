import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { site } from "@/lib/site";

export const metadata = { title: "Support Portal" };

const resources = [
  {
    title: "E3 Tutorials",
    description: "Step-by-step guides from first project to advanced automation.",
    href: "/products/e3-series#tutorials",
  },
  {
    title: "Products",
    description: "Browse the E3.Series modules and what each one does.",
    href: "/products/e3-series",
  },
  {
    title: "Services",
    description: "Helpdesk, automation, training and consulting.",
    href: "/services",
  },
];

export default async function PortalPage() {
  const session = await requireUser();
  const name = session.user.name || session.user.email;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, {name}</h1>
        <p className="mt-2 text-muted">
          This is your Devanor support portal. Reach our team and find resources below.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <h2 className="font-semibold">Need help?</h2>
        <p className="mt-1 text-sm text-muted">
          Our helpdesk is here for any E3.Series question.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-muted">Email</p>
            <a href={site.contact.emailHref} className="hover:text-accent">
              {site.contact.email}
            </a>
          </div>
          <div>
            <p className="text-muted">Phone</p>
            <a href={site.contact.phoneHref} className="hover:text-accent">
              {site.contact.phone}
            </a>
          </div>
          <div>
            <p className="text-muted">WhatsApp</p>
            <a href={site.contact.whatsappHref} className="hover:text-accent">
              {site.contact.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold">Resources</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {resources.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className="rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted">{r.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
