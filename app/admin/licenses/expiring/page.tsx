import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ExpiringLicensesManager,
  type ExpiringRow,
} from "@/components/admin/ExpiringLicensesManager";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Admin · Expiring licenses" };

export default async function ExpiringLicensesPage() {
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);

  // Everything expired or expiring within 30 days, plus licenses whose admin
  // reminder date has arrived. Include deactivated ones (already expired).
  const licenses = await prisma.license.findMany({
    where: {
      OR: [
        { permanent: false, expiresAt: { not: null, lte: soon } },
        { reminderAt: { not: null, lte: soon } },
      ],
    },
    orderBy: [{ expiresAt: "asc" }, { reminderAt: "asc" }],
    include: { client: { select: { id: true, name: true } }, modules: true },
  });

  const rows: ExpiringRow[] = licenses.map((l) => {
    const isReminder = l.permanent || !l.expiresAt;
    const kind: ExpiringRow["kind"] = isReminder
      ? "reminder"
      : l.expiresAt && l.expiresAt < now
        ? "expired"
        : "expiring";
    return {
      id: l.id,
      companyId: l.client.id,
      companyName: l.client.name,
      moduleNames: l.modules.map((m) => m.name).join(", "),
      contractType: l.contractType,
      dateLabel: formatDate(isReminder ? l.reminderAt : l.expiresAt),
      kind,
      active: l.active,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Expiring &amp; expired licenses</h1>
      <p className="mt-1 text-muted">
        Licenses expiring within 30 days, already expired, or with an admin
        renewal reminder due.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4">
          <h2 className="font-semibold">Licenses ({rows.length})</h2>
        </div>
        <ExpiringLicensesManager rows={rows} />
      </section>
    </div>
  );
}
