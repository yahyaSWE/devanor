import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { AddClientForm } from "@/components/admin/AddClientForm";
import {
  deleteClient,
  toggleClientActive,
  toggleClientVisibility,
} from "@/lib/actions/admin";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export const metadata = { title: "Admin" };

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function AdminPage() {
  const [clients, customerCount, demoRequests] = await Promise.all([
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { users: true } } },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.demoRequest.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="mt-1 text-muted">
          Register a company, then add its employees as portal logins.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Companies" value={clients.length} />
        <Stat label="Employee logins" value={customerCount} />
        <Stat label="Demo requests" value={demoRequests.length} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Register a company</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Also appears in “Our Clients” on the About page.
          </p>
          <AddClientForm />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Companies ({clients.length})</h2>
          {clients.length === 0 ? (
            <p className="text-sm text-muted">No companies yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {clients.map((c) => (
                <li key={c.id} className="flex items-center gap-4 py-3">
                  <div className="grid h-12 w-20 shrink-0 place-items-center rounded-lg border border-border bg-background p-2">
                    <Image
                      src={c.logoUrl}
                      alt={c.name}
                      width={80}
                      height={40}
                      className="max-h-8 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{c.name}</p>
                      {!c.active && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                          Inactive
                        </span>
                      )}
                      {!c.showOnSite && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                          Hidden from site
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted">
                      {c._count.users} employee
                      {c._count.users === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="shrink-0 text-sm text-accent hover:underline"
                  >
                    Manage
                  </Link>
                  <form action={toggleClientVisibility}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="shrink-0 text-sm text-muted hover:text-foreground">
                      {c.showOnSite ? "Hide" : "Show"}
                    </button>
                  </form>
                  <form action={toggleClientActive}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="shrink-0 text-sm text-muted hover:text-foreground">
                      {c.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                  <ConfirmSubmit
                    action={deleteClient}
                    hidden={{ id: c.id }}
                    trigger="Remove"
                    confirmLabel="Delete company"
                    title="Delete company?"
                    message={`This permanently removes "${c.name}"${
                      c._count.users > 0
                        ? ` and its ${c._count.users} employee login${
                            c._count.users === 1 ? "" : "s"
                          }`
                        : ""
                    }. This cannot be undone.`}
                    triggerClassName="shrink-0 text-sm text-muted hover:text-red-400"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <h2 className="mb-4 font-semibold">Recent demo requests</h2>
        {demoRequests.length === 0 ? (
          <p className="text-sm text-muted">No demo requests yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {demoRequests.map((d) => (
              <li key={d.id} className="py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">
                    {d.name}{" "}
                    <span className="font-normal text-muted">· {d.email}</span>
                    {d.company ? (
                      <span className="font-normal text-muted"> · {d.company}</span>
                    ) : null}
                  </p>
                  <span className="shrink-0 text-xs text-muted">
                    {d.createdAt.toLocaleString()}
                  </span>
                </div>
                {d.message && <p className="mt-1 text-sm text-muted">{d.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
