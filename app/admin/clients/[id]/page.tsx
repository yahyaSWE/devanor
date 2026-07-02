import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddEmployeeForm } from "@/components/admin/AddEmployeeForm";
import { EditCompanyForm } from "@/components/admin/EditCompanyForm";
import { EmployeeRow } from "@/components/admin/EmployeeRow";
import { LicenseForm } from "@/components/admin/LicenseForm";
import { LicenseRow, type LicenseRowData } from "@/components/admin/LicenseRow";
import { SendWelcomeMail } from "@/components/admin/SendWelcomeMail";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import {
  deleteClientAndRedirect,
  toggleClientActive,
  toggleClientVisibility,
} from "@/lib/actions/admin";
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
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                  Active
                </span>
              ) : (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                  Inactive
                </span>
              )}
              {!client.showOnSite && (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
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
            {maintenanceCount} maintenance · Manage license →
          </a>
          <form action={toggleClientVisibility}>
            <input type="hidden" name="id" value={client.id} />
            <button className="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-white/30">
              {client.showOnSite ? "Hide from site" : "Show on site"}
            </button>
          </form>
          <form action={toggleClientActive}>
            <input type="hidden" name="id" value={client.id} />
            <button className="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-white/30">
              {client.active ? "Deactivate" : "Activate"}
            </button>
          </form>
        </div>
      </div>

      {!client.active && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          This company is deactivated — it&apos;s hidden from “Our Clients” and its
          employees cannot sign in.
        </p>
      )}

      {/* Company settings */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Edit company</h2>
          <EditCompanyForm
            client={{
              id: client.id,
              name: client.name,
              websiteUrl: client.websiteUrl,
              address: client.address,
            }}
          />
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs text-muted">
              Removes the company and all its employee logins.
            </span>
            <ConfirmSubmit
              action={deleteClientAndRedirect}
              hidden={{ id: client.id }}
              trigger="Delete company"
              confirmLabel="Delete company"
              title="Delete company?"
              message={`This permanently removes "${client.name}"${
                client.users.length > 0
                  ? ` and its ${client.users.length} employee login${
                      client.users.length === 1 ? "" : "s"
                    }`
                  : ""
              }. This cannot be undone.`}
              triggerClassName="shrink-0 rounded-full border border-red-500/40 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold">Add an employee</h2>
          </div>
          <p className="mb-4 text-sm text-muted">
            Creates a portal login under {client.name}. Each employee signs in with
            their own email, so support can tell them apart.
          </p>
          <AddEmployeeForm clientId={client.id} />
        </div>
      </div>

      {/* Employees */}
      <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Employees ({client.users.length})</h2>
          <SendWelcomeMail
            clientId={client.id}
            employees={client.users.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
            }))}
            template={welcomeTemplate}
            companyName={client.name}
            loginUrl={`${appUrl()}/login`}
          />
        </div>
        {client.users.length === 0 ? (
          <p className="text-sm text-muted">
            No employees yet. Add the first one above.
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
      <div id="licenses" className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Assign a license</h2>
          <p className="mb-4 text-sm text-muted">
            Pick one or more modules from the catalog (created in the Licenses
            tab).
          </p>
          <LicenseForm clientId={client.id} modules={moduleOptions} />
        </div>

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
