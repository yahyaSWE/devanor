import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser } from "@/lib/portal";
import { formatDate } from "@/lib/format";
import { LicenseStatusBadge } from "@/components/LicenseStatusBadge";
import { ContractTypeBadge } from "@/components/ContractTypeBadge";
import { LockTypeBadge } from "@/components/LockTypeBadge";

export const metadata = { title: "Licenses" };

export default async function PortalLicensesPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);

  const licenses = user?.clientId
    ? await prisma.license.findMany({
        where: { clientId: user.clientId },
        orderBy: { createdAt: "desc" },
        include: { modules: true },
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
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Module(s)</th>
                <th className="px-5 py-3 font-medium">Contract</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Version</th>
                <th className="px-5 py-3 font-medium">Seats</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Renews / expires</th>
                <th className="px-5 py-3 font-medium">Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {licenses.map((l) => (
                <tr key={l.id} className="bg-surface/30">
                  <td className="px-5 py-3 font-medium">
                    {l.modules.map((m) => m.name).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <ContractTypeBadge type={l.contractType} />
                  </td>
                  <td className="px-5 py-3">
                    {l.lockType ? (
                      <LockTypeBadge type={l.lockType} />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted">{l.version ?? "—"}</td>
                  <td className="px-5 py-3 text-muted">{l.seats ?? "—"}</td>
                  <td className="px-5 py-3">
                    <LicenseStatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {l.permanent ? "Permanent" : formatDate(l.expiresAt)}
                  </td>
                  <td className="px-5 py-3">
                    {l.keyStoredName ? (
                      <a
                        href={`/api/licenses/${l.id}/key`}
                        className="text-accent hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
