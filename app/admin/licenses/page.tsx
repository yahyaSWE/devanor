import { prisma } from "@/lib/db";
import { AddLicenseForm } from "@/components/admin/AddLicenseForm";
import { deleteLicense } from "@/lib/actions/admin-content";
import { LicenseStatusBadge } from "@/components/LicenseStatusBadge";
import { LicenseTypeBadge } from "@/components/LicenseTypeBadge";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Admin · Licenses" };

export default async function AdminLicensesPage() {
  const [clients, licenses] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.license.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Licenses &amp; maintenance</h1>
      <p className="mt-1 text-muted">
        Assign licensed modules or maintenance entries to companies. Customers see
        their own under Licenses.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Add license or maintenance</h2>
          {clients.length === 0 ? (
            <p className="text-sm text-muted">
              Add a client first, then assign licenses.
            </p>
          ) : (
            <AddLicenseForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Entries ({licenses.length})</h2>
          {licenses.length === 0 ? (
            <p className="text-sm text-muted">No licenses or maintenance yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {licenses.map((l) => (
                <li key={l.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{l.module}</p>
                      <LicenseTypeBadge type={l.type} />
                      <LicenseStatusBadge status={l.status} />
                    </div>
                    <p className="truncate text-sm text-muted">
                      {l.client.name}
                      {l.seats ? ` · ${l.seats} seats` : ""} · expires{" "}
                      {formatDate(l.expiresAt)}
                    </p>
                  </div>
                  <form action={deleteLicense}>
                    <input type="hidden" name="id" value={l.id} />
                    <button className="text-sm text-muted hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
