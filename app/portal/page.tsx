import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, downloadAudience, tutorialAudience } from "@/lib/portal";
import { formatBytes, formatDate } from "@/lib/format";

export const metadata = { title: "Support Portal" };

export default async function PortalOverview() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const clientId = user?.clientId ?? null;

  const soon = new Date();
  soon.setDate(soon.getDate() + 30);

  const [activeLicenses, downloads, tutorialCount, expiring] = await Promise.all([
    clientId
      ? prisma.license.count({
          where: { clientId, status: "ACTIVE", active: true },
        })
      : Promise.resolve(0),
    prisma.download.findMany({
      where: {
        AND: [{ active: true }, downloadAudience(clientId, session.user.id)],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.tutorial.count({
      where: {
        AND: [{ active: true }, tutorialAudience(clientId, session.user.id)],
      },
    }),
    // Real expiries only — the admin-only reminderAt is never surfaced to the
    // customer.
    clientId
      ? prisma.license.findMany({
          where: {
            clientId,
            active: true,
            status: { not: "EXPIRED" },
            permanent: false,
            expiresAt: { not: null, gte: new Date(), lte: soon },
          },
          orderBy: { expiresAt: "asc" },
          include: { modules: true },
        })
      : Promise.resolve([]),
  ]);

  const name = user?.name || session.user.email;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, {name}</h1>
        <p className="mt-2 text-muted">
          {user?.client
            ? `${user.client.name} · Devanor support portal`
            : "Devanor support portal"}
        </p>
      </div>

      {expiring.length > 0 && (
        <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-amber-300">
            ⚠️ Expiring within 30 days ({expiring.length})
          </h2>
          <ul className="mt-3 divide-y divide-amber-500/20">
            {expiring.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm"
              >
                <span className="font-medium">
                  {l.modules.map((m) => m.name).join(", ") || "License"}
                </span>
                <span className="text-amber-300">
                  expires {formatDate(l.expiresAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/portal/licenses"
          className="rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/50 hover:bg-surface/60 hover:shadow-[0_0_24px_-10px_var(--color-accent)]"
        >
          <p className="text-2xl font-semibold">{activeLicenses}</p>
          <p className="text-sm text-muted">Active licenses</p>
        </Link>
        <Link
          href="/portal/downloads"
          className="rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/50 hover:bg-surface/60 hover:shadow-[0_0_24px_-10px_var(--color-accent)]"
        >
          <p className="text-2xl font-semibold">{downloads.length}</p>
          <p className="text-sm text-muted">Recent downloads</p>
        </Link>
        <Link
          href="/portal/tutorials"
          className="rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/50 hover:bg-surface/60 hover:shadow-[0_0_24px_-10px_var(--color-accent)]"
        >
          <p className="text-2xl font-semibold">{tutorialCount}</p>
          <p className="text-sm text-muted">Tutorials available</p>
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Latest downloads</h2>
          <Link href="/portal/downloads" className="text-sm text-accent transition-all hover:brightness-125 hover:underline">
            View all
          </Link>
        </div>
        {downloads.length === 0 ? (
          <p className="text-sm text-muted">No files available yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {downloads.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{d.title}</p>
                  <p className="truncate text-sm text-muted">
                    {d.fileName} · {formatBytes(d.size)}
                  </p>
                </div>
                <a
                  href={`/api/downloads/${d.id}`}
                  className="shrink-0 text-sm text-accent transition-all hover:brightness-125 hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <h2 className="font-semibold">Need help?</h2>
        <p className="mt-1 text-sm text-muted">
          Start a live chat with our support team or browse the resources.
        </p>
        <Link
          href="/portal/support"
          className="mt-4 inline-block text-sm text-accent transition-all hover:brightness-125 hover:underline"
        >
          Go to support →
        </Link>
      </section>
    </div>
  );
}
