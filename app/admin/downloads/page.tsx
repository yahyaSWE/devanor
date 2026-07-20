import { prisma } from "@/lib/db";
import { AddDownloadModal } from "@/components/admin/AddDownloadModal";
import {
  DownloadsManager,
  type AdminDownloadRow,
} from "@/components/admin/DownloadsManager";
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

  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));
  const rows: AdminDownloadRow[] = downloads.map((d) => {
    const isImage = d.mimeType.startsWith("image/");
    return {
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      fileName: d.fileName,
      sizeLabel: formatBytes(d.size),
      clientId: d.clientId,
      clientName: d.client ? d.client.name : null,
      active: d.active,
      previewable: isImage || d.mimeType === "application/pdf",
      isImage,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Downloads</h1>
      <p className="mt-1 text-muted">
        Upload files for customers. Files are private and only served to signed-in
        users with access.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Files ({downloads.length})</h2>
          <AddDownloadModal clients={clientOptions} />
        </div>
        <DownloadsManager downloads={rows} clients={clientOptions} />
      </section>
    </div>
  );
}
