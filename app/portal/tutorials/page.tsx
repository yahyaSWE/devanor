import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, visibilityFilter } from "@/lib/portal";
import { getSeenMap, isUnread } from "@/lib/portal-reads";
import { getEmbedUrl, getVideoThumbnail, getLoomThumbnail } from "@/lib/video";
import {
  PortalTutorialsList,
  type PortalTutorialRow,
} from "@/components/portal/PortalTutorialsList";

export const metadata = { title: "Tutorials" };

export default async function PortalTutorialsPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const [tutorials, seen] = await Promise.all([
    prisma.tutorial.findMany({
      where: { AND: [{ active: true }, visibilityFilter(user?.clientId ?? null)] },
      orderBy: { createdAt: "desc" },
    }),
    getSeenMap(session.user.id, "TUTORIAL"),
  ]);

  const rows: PortalTutorialRow[] = await Promise.all(
    tutorials.map(async (t) => {
      const embedUrl = getEmbedUrl(t.url);
      const thumb = getVideoThumbnail(t.url) ?? (await getLoomThumbnail(t.url));
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        level: t.level,
        url: t.url,
        isVideo: Boolean(embedUrl),
        embedUrl,
        thumb,
        isNew: isUnread(t, seen),
      };
    }),
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Tutorials &amp; training</h1>
        <p className="mt-2 text-muted">
          Training material curated for E3.Series users.
        </p>
      </div>

      <PortalTutorialsList tutorials={rows} />
    </div>
  );
}
