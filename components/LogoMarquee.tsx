import Image from "next/image";
import { prisma } from "@/lib/db";

/**
 * Infinite scrolling strip of client logos for the homepage.
 * Renders nothing until at least 3 clients exist (a sparse marquee looks broken).
 */
export async function LogoMarquee() {
  let clients: { id: string; name: string; logoUrl: string; websiteUrl: string }[] =
    [];
  try {
    clients = await prisma.client.findMany({
      where: { active: true, showOnSite: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    clients = [];
  }

  if (clients.length < 3) return null;

  // Build one set that is wide enough to fill the track, then duplicate it so the
  // -50% keyframe loops seamlessly. Repeating to a minimum avoids the gap/stutter
  // that appears when a single pass is narrower than the visible strip.
  const MIN_PER_SET = 8;
  const repeats = Math.max(1, Math.ceil(MIN_PER_SET / clients.length));
  const oneSet = Array.from({ length: repeats }).flatMap(() => clients);
  const loop = [...oneSet, ...oneSet];

  return (
    <div className="rounded-2xl border border-border bg-surface/30 px-6 py-10">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        Our Clients
      </p>
      <div className="marquee-mask overflow-hidden">
        {/* gap/item widths tuned so ~4 logos are visible at a time */}
        <div className="marquee-track items-center gap-24">
          {loop.map((c, i) => (
            <div
              key={`${c.id}-${i}`}
              title={c.name}
              className="flex w-24 shrink-0 items-center justify-center opacity-70"
            >
              <Image
                src={c.logoUrl}
                alt={c.name}
                width={140}
                height={56}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
