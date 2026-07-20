import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, visibilityFilter } from "@/lib/portal";
import { getSeenMap, isUnread } from "@/lib/portal-reads";
import { formatBytes, formatDate } from "@/lib/format";
import {
  PortalDownloadsList,
  type DownloadRow,
} from "@/components/portal/PortalDownloadsList";

export const metadata = { title: "Downloads" };

export default async function PortalDownloadsPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const [downloads, seen] = await Promise.all([
    prisma.download.findMany({
      where: {
        AND: [{ active: true }, visibilityFilter(user?.clientId ?? null)],
      },
      orderBy: { createdAt: "desc" },
    }),
    getSeenMap(session.user.id, "DOWNLOAD"),
  ]);

  const rows: DownloadRow[] = downloads.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    category: d.category,
    fileName: d.fileName,
    sizeLabel: formatBytes(d.size),
    dateLabel: formatDate(d.createdAt),
    isNew: isUnread(d, seen),
  }));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Downloads</h1>
        <p className="mt-2 text-muted">
          License files, scripts and documentation shared with you.
        </p>
      </div>

      <PortalDownloadsList downloads={rows} />
    </div>
  );
}
