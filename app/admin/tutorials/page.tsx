import { prisma } from "@/lib/db";
import { AddTutorialModal } from "@/components/admin/AddTutorialModal";
import {
  TutorialsManager,
  type TutorialRow,
} from "@/components/admin/TutorialsManager";
import { getEmbedUrl, getVideoThumbnail, getLoomThumbnail } from "@/lib/video";

export const metadata = { title: "Admin · Tutorials" };

export default async function AdminTutorialsPage() {
  const [clients, tutorials] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));
  const rows: TutorialRow[] = await Promise.all(
    tutorials.map(async (t) => {
      const embedUrl = getEmbedUrl(t.url);
      const thumb =
        getVideoThumbnail(t.url) ?? (await getLoomThumbnail(t.url));
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        level: t.level,
        url: t.url,
        clientId: t.clientId,
        clientName: t.client ? t.client.name : null,
        active: t.active,
        isVideo: Boolean(embedUrl),
        embedUrl,
        thumb,
      };
    }),
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Tutorials</h1>
      <p className="mt-1 text-muted">
        Gated training material shown to signed-in customers. YouTube and Vimeo
        links play as an embedded video; other links open in a new tab.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Tutorials ({tutorials.length})</h2>
          <AddTutorialModal clients={clientOptions} />
        </div>
        <TutorialsManager tutorials={rows} clients={clientOptions} />
      </section>
    </div>
  );
}
