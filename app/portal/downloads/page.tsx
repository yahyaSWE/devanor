import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, visibilityFilter } from "@/lib/portal";
import { formatBytes, formatDate } from "@/lib/format";

export const metadata = { title: "Downloads" };

export default async function PortalDownloadsPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const downloads = await prisma.download.findMany({
    where: visibilityFilter(user?.clientId ?? null),
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Downloads</h1>
        <p className="mt-2 text-muted">
          License files, scripts and documentation shared with you.
        </p>
      </div>

      {downloads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
          No files are available to you yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {downloads.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/40 p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{d.title}</p>
                  {d.category && (
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                      {d.category}
                    </span>
                  )}
                </div>
                {d.description && (
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                )}
                <p className="mt-1 text-xs text-muted">
                  {d.fileName} · {formatBytes(d.size)} · {formatDate(d.createdAt)}
                </p>
              </div>
              <a
                href={`/api/downloads/${d.id}`}
                className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-110"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
