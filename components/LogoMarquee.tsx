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
    clients = await prisma.client.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    clients = [];
  }

  if (clients.length < 3) return null;

  // The track holds the list twice; the keyframe slides -50% for a seamless loop.
  const loop = [...clients, ...clients];

  return (
    <div className="border-y border-border bg-surface/30 py-10">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        Trusted by engineering teams
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track items-center gap-16 px-8">
          {loop.map((c, i) => (
            <a
              key={`${c.id}-${i}`}
              href={c.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={c.name}
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <Image
                src={c.logoUrl}
                alt={c.name}
                width={140}
                height={56}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
