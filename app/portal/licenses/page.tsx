import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser } from "@/lib/portal";
import { formatDate } from "@/lib/format";
import { LicenseStatusBadge } from "@/components/LicenseStatusBadge";
import { LicenseTypeBadge } from "@/components/LicenseTypeBadge";

export const metadata = { title: "Licenses" };

export default async function PortalLicensesPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);

  const licenses = user?.clientId
    ? await prisma.license.findMany({
        where: { clientId: user.clientId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Licenses</h1>
        <p className="mt-2 text-muted">
          {user?.client
            ? `Modules and subscriptions for ${user.client.name}.`
            : "Your licensed modules and subscriptions."}
        </p>
      </div>

      {licenses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
          No licenses are registered for your account yet. Contact support if this
          looks wrong.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Module / item</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Seats</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Renews / expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {licenses.map((l) => (
                <tr key={l.id} className="bg-surface/30">
                  <td className="px-5 py-3 font-medium">{l.module}</td>
                  <td className="px-5 py-3">
                    <LicenseTypeBadge type={l.type} />
                  </td>
                  <td className="px-5 py-3 text-muted">{l.seats ?? "—"}</td>
                  <td className="px-5 py-3">
                    <LicenseStatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-3 text-muted">{formatDate(l.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
