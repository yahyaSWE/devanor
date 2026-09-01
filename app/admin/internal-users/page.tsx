import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  InternalUsersManager,
  type InternalUserRow,
} from "@/components/admin/InternalUsersManager";

export const metadata = { title: "Admin · Internal users" };

export default async function InternalUsersPage() {
  const session = await requireAdmin();
  const users = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPPORT", "CRM"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
  const rows: InternalUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role as InternalUserRow["role"],
    active: user.active,
    createdLabel: formatDate(user.createdAt),
    isCurrent: user.id === session.user.id,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Internal users</h1>
      <p className="mt-1 text-muted">
        Create and manage Full Admin, Support and CRM access to the Devanor portal.
      </p>
      <section className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
        <InternalUsersManager users={rows} />
      </section>
    </div>
  );
}
