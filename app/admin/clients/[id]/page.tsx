import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddEmployeeForm } from "@/components/admin/AddEmployeeForm";
import { EditCompanyForm } from "@/components/admin/EditCompanyForm";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import {
  deleteUser,
  deleteClientAndRedirect,
  toggleClientActive,
  toggleClientVisibility,
} from "@/lib/actions/admin";
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
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      users: { orderBy: { createdAt: "asc" } },
      licenses: { select: { type: true } },
    },
  });
  if (!client) notFound();

  const licenseCount = client.licenses.filter((l) => l.type === "LICENSE").length;
  const maintenanceCount = client.licenses.filter(
    (l) => l.type === "MAINTENANCE",
  ).length;

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
          <Link href="/admin/licenses" className="text-sm text-accent hover:underline">
            {licenseCount} license{licenseCount === 1 ? "" : "s"} ·{" "}
            {maintenanceCount} maintenance →
          </Link>
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
        <h2 className="mb-4 font-semibold">Employees ({client.users.length})</h2>
        {client.users.length === 0 ? (
          <p className="text-sm text-muted">
            No employees yet. Add the first one above.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {client.users.map((u) => (
              <li key={u.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{u.name ?? u.email}</p>
                    {u.title && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        {u.title}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted">
                    {u.email} · added {formatDate(u.createdAt)}
                  </p>
                </div>
                <ConfirmSubmit
                  action={deleteUser}
                  hidden={{ id: u.id }}
                  trigger="Remove"
                  confirmLabel="Remove employee"
                  title="Remove employee?"
                  message={`This removes the portal login for ${
                    u.name ?? u.email
                  }. This cannot be undone.`}
                  triggerClassName="shrink-0 text-sm text-muted hover:text-red-400"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
