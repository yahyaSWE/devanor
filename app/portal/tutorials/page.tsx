import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getPortalUser, visibilityFilter } from "@/lib/portal";
import { getEmbedUrl } from "@/lib/video";

export const metadata = { title: "Tutorials" };

export default async function PortalTutorialsPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);
  const tutorials = await prisma.tutorial.findMany({
    where: { AND: [{ active: true }, visibilityFilter(user?.clientId ?? null)] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Tutorials &amp; training</h1>
        <p className="mt-2 text-muted">
          Training material curated for E3.Series users.
        </p>
      </div>

      {tutorials.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
          No tutorials are available to you yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {tutorials.map((t) => {
            const embed = getEmbedUrl(t.url);
            const header = (
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold">{t.title}</h2>
                <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {t.level}
                </span>
              </div>
            );

            if (embed) {
              return (
                <div
                  key={t.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/40"
                >
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={embed}
                      title={t.title}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {header}
                    {t.description && (
                      <p className="mt-2 text-sm text-muted">{t.description}</p>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/40"
              >
                {header}
                {t.description && (
                  <p className="mt-2 flex-1 text-sm text-muted">{t.description}</p>
                )}
                <span className="mt-4 text-sm text-accent">Open tutorial →</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
