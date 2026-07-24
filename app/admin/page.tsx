import Link from "next/link";
import { prisma } from "@/lib/db";
import { RegisterCompanyModal } from "@/components/admin/RegisterCompanyModal";
import { CompaniesManager, type CompanyRow } from "@/components/admin/CompaniesManager";
import { formatDate } from "@/lib/format";

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
  // Licenses expiring within the next 30 days (active, non-permanent, dated).
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);

  const [clients, customerCount, expiring] = await Promise.all([
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { users: true } },
        users: { select: { name: true, email: true } },
      },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.license.findMany({
      where: {
        active: true,
        permanent: false,
        expiresAt: { not: null, gte: new Date(), lte: soon },
      },
      orderBy: { expiresAt: "asc" },
      include: { client: { select: { id: true, name: true } }, modules: true },
    }),
  ]);

  const rows: CompanyRow[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    active: c.active,
    showOnSite: c.showOnSite,
    employeeCount: c._count.users,
    employeeNames: c.users.map((u) => u.name ?? u.email),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="mt-1 text-muted">
          Register a company, then add its employees as portal logins.
        </p>
      </div>

      {expiring.length > 0 && (
        <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-amber-300">
            ⚠️ Licenses expiring within 30 days ({expiring.length})
          </h2>
          <ul className="mt-3 divide-y divide-amber-500/20">
            {expiring.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-medium">{l.client.name}</span>
                  <span className="text-muted">
                    {" "}
                    · {l.modules.map((m) => m.name).join(", ") || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-300">
                    expires {formatDate(l.expiresAt)}
                  </span>
                  <Link
                    href={`/admin/clients/${l.client.id}#licenses`}
                    className="text-accent transition-all hover:brightness-125 hover:underline"
                  >
                    Manage →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Companies" value={clients.length} />
        <Stat label="Employee logins" value={customerCount} />
      </div>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Companies ({clients.length})</h2>
          <RegisterCompanyModal />
        </div>
        <CompaniesManager clients={rows} />
      </section>
    </div>
  );
}
