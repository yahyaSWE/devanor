import Image from "next/image";
import { prisma } from "@/lib/db";
import { AddClientForm } from "@/components/admin/AddClientForm";
import { CreateCustomerForm } from "@/components/admin/CreateCustomerForm";
import { deleteClient } from "@/lib/actions/admin";

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
  const [clients, customers, demoRequests] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.demoRequest.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Admin panel</h1>
        <p className="mt-1 text-muted">
          Manage clients and customer-portal logins.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Clients" value={clients.length} />
        <Stat label="Customer logins" value={customers.length} />
        <Stat label="Demo requests" value={demoRequests.length} />
      </div>

      {/* Clients */}
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Add a client</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Appears in the “Our Clients” section on the About page.
          </p>
          <AddClientForm />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Clients ({clients.length})</h2>
          {clients.length === 0 ? (
            <p className="text-sm text-muted">No clients yet.</p>
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
                    <p className="truncate font-medium">{c.name}</p>
                    <a
                      href={c.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-muted hover:text-accent"
                    >
                      {c.websiteUrl}
                    </a>
                  </div>
                  <form action={deleteClient}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-sm text-muted hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Customer logins */}
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Create a portal login</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Creates a customer account for the support portal.
          </p>
          <CreateCustomerForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Customer logins ({customers.length})</h2>
          {customers.length === 0 ? (
            <p className="text-sm text-muted">No customer accounts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {customers.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{u.email}</p>
                    <p className="truncate text-sm text-muted">
                      {u.name ?? "—"}
                      {u.client ? ` · ${u.client.name}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted">
                    {u.createdAt.toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Recent demo requests */}
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
