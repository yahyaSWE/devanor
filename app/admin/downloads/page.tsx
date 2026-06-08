import { prisma } from "@/lib/db";
import { AddDownloadForm } from "@/components/admin/AddDownloadForm";
import { deleteDownload } from "@/lib/actions/admin-content";
import { formatBytes } from "@/lib/format";

export const metadata = { title: "Admin · Downloads" };

export default async function AdminDownloadsPage() {
  const [clients, downloads] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.download.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Downloads</h1>
      <p className="mt-1 text-muted">
        Upload files for customers. Files are private and only served to signed-in
        users with access.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Add a download</h2>
          <AddDownloadForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Files ({downloads.length})</h2>
          {downloads.length === 0 ? (
            <p className="text-sm text-muted">No files yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {downloads.map((d) => (
                <li key={d.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{d.title}</p>
                      {d.category && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                          {d.category}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted">
                      {d.fileName} · {formatBytes(d.size)} ·{" "}
                      {d.client ? d.client.name : "All customers"}
                    </p>
                  </div>
                  <form action={deleteDownload}>
                    <input type="hidden" name="id" value={d.id} />
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
