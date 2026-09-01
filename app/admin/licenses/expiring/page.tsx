import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ExpiringLicensesManager,
  type ExpiringRow,
} from "@/components/admin/ExpiringLicensesManager";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/lib/auth-helpers";

export const metadata = { title: "Admin · Expiring licenses" };

export default async function ExpiringLicensesPage() {
  await requirePermission("licenses");
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
        { status: "TRIAL" },
      ],
    },
    orderBy: [{ expiresAt: "asc" }, { reminderAt: "asc" }],
    include: { client: { select: { id: true, name: true } }, modules: true },
  });

  const rows: ExpiringRow[] = licenses.map((l) => {
    const isStandaloneTrial =
      l.status === "TRIAL" && (!l.expiresAt || l.expiresAt > soon);
    const isReminder = !isStandaloneTrial && (l.permanent || !l.expiresAt);
    const kind: ExpiringRow["kind"] = isReminder
      ? "reminder"
      : isStandaloneTrial
        ? "trial"
      : l.expiresAt && l.expiresAt < now
        ? "expired"
        : "expiring";
    return {
      id: l.id,
      companyId: l.client.id,
      companyName: l.client.name,
      moduleNames: l.modules.map((m) => m.name),
      contractType: l.contractType,
      dateLabel: formatDate(isReminder ? l.reminderAt : l.expiresAt),
      kind,
      active: l.active,
      status: l.status,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Expiring &amp; expired licenses</h1>
      <p className="mt-1 text-muted">
        Trials, licenses expiring within 30 days, already expired licenses, and
        admin renewal reminders.
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
