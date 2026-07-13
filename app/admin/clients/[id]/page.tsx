import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CompanyManageMenu } from "@/components/admin/CompanyManageMenu";
import { EmployeeRow } from "@/components/admin/EmployeeRow";
import { LicenseRow, type LicenseRowData } from "@/components/admin/LicenseRow";
import { getWelcomeTemplate } from "@/lib/welcome";
import { appUrl } from "@/lib/email";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  return { title: client ? `Admin · ${client.name}` : "Admin · Company" };
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, modules] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      include: {
        users: { orderBy: { createdAt: "asc" } },
        licenses: { orderBy: { createdAt: "desc" }, include: { modules: true } },
      },
    }),
    prisma.licenseModule.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!client) notFound();

  const welcomeTemplate = await getWelcomeTemplate();

  const licenseCount = client.licenses.filter(
    (l) => l.contractType !== "MAINTENANCE",
  ).length;
  const maintenanceCount = client.licenses.filter(
    (l) => l.contractType === "MAINTENANCE",
  ).length;

  const moduleOptions = modules.map((m) => ({ id: m.id, name: m.name }));
  const licenseRows: LicenseRowData[] = client.licenses.map((l) => ({
    id: l.id,
    moduleNames: l.modules.map((m) => m.name),
    moduleIds: l.modules.map((m) => m.id),
    contractType: l.contractType,
    lockType: l.lockType,
    version: l.version,
    macIds: l.macIds,
    seats: l.seats,
    status: l.status,
    permanent: l.permanent,
    expiresAt: l.expiresAt ? l.expiresAt.toISOString().slice(0, 10) : null,
    expiresLabel: formatDate(l.expiresAt),
    hasKey: !!l.keyStoredName,
  }));
  const licenseGroups = [
    { key: "PERPETUAL", label: "Perpetual licenses" },
    { key: "SUBSCRIPTION", label: "Subscriptions" },
    { key: "MAINTENANCE", label: "Maintenance" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        ← All companies
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-24 shrink-0 place-items-center rounded-lg border border-border bg-background p-2">
            <Image
              src={client.logoUrl}
              alt={client.name}
              width={96}
              height={48}
              className="max-h-10 w-auto object-contain"
              unoptimized
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{client.name}</h1>
              {client.active ? (
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">
                  Active
                </span>
              ) : (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                  Inactive
                </span>
              )}
              {!client.showOnSite && (
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                  Hidden from site
                </span>
              )}
            </div>
            <a
              href={client.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent"
            >
              {client.websiteUrl}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="#licenses" className="text-sm text-accent hover:underline">
            {licenseCount} license{licenseCount === 1 ? "" : "s"} ·{" "}
            {maintenanceCount} maintenance
          </a>
          <CompanyManageMenu
            client={{
              id: client.id,
              name: client.name,
              websiteUrl: client.websiteUrl,
              address: client.address,
              active: client.active,
              showOnSite: client.showOnSite,
            }}
            modules={moduleOptions}
            employees={client.users.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
            }))}
            welcomeTemplate={welcomeTemplate}
            loginUrl={`${appUrl()}/login`}
          />
        </div>
      </div>

      {!client.active && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          This company is deactivated — it&apos;s hidden from “Our Clients” and its
          employees cannot sign in.
        </p>
      )}

      {/* Employees */}
      <div className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Employees ({client.users.length})</h2>
        </div>
        {client.users.length === 0 ? (
          <p className="text-sm text-muted">
            No employees yet. Use the menu (top right) to add one.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {client.users.map((u) => (
              <EmployeeRow
                key={u.id}
                user={{
                  id: u.id,
                  name: u.name,
                  email: u.email,
                  title: u.title,
                  active: u.active,
                  zgsUsername: u.zgsUsername,
                  zgsTempPassword: u.zgsTempPassword,
                  welcomeEmailSent: !!u.welcomeEmailSentAt,
                  addedLabel: formatDate(u.createdAt),
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Licenses */}
      <div id="licenses" className="mt-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">
            Licenses ({licenseRows.length})
          </h2>
          {licenseRows.length === 0 ? (
            <p className="text-sm text-muted">No licenses assigned yet.</p>
          ) : (
            <div className="space-y-6">
              {licenseGroups.map((g) => {
                const rows = licenseRows.filter(
                  (l) => l.contractType === g.key,
                );
                if (rows.length === 0) return null;
                return (
                  <div key={g.key}>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                      {g.label}
                    </h3>
                    <ul className="divide-y divide-border">
                      {rows.map((l) => (
                        <LicenseRow
                          key={l.id}
                          license={l}
                          clientId={client.id}
                          modules={moduleOptions}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
