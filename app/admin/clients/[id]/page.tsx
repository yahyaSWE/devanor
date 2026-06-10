import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddEmployeeForm } from "@/components/admin/AddEmployeeForm";
import { deleteUser } from "@/lib/actions/admin";
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
      _count: { select: { licenses: true } },
    },
  });
  if (!client) notFound();

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
            <h1 className="text-2xl font-semibold">{client.name}</h1>
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
        <Link
          href="/admin/licenses"
          className="text-sm text-accent hover:underline"
        >
          {client._count.licenses} license
          {client._count.licenses === 1 ? "" : "s"} →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Add an employee</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Creates a portal login under {client.name}. Each employee signs in with
            their own email, so support can tell them apart.
          </p>
          <AddEmployeeForm clientId={client.id} />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">
            Employees ({client.users.length})
          </h2>
          {client.users.length === 0 ? (
            <p className="text-sm text-muted">
              No employees yet. Add the first one on the left.
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
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="text-sm text-muted hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
