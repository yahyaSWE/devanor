import { prisma } from "@/lib/db";
import { RegisterCompanyModal } from "@/components/admin/RegisterCompanyModal";
import { CompaniesManager, type CompanyRow } from "@/components/admin/CompaniesManager";

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
  const [clients, customerCount] = await Promise.all([
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { users: true } },
        users: { select: { name: true, email: true } },
      },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
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
