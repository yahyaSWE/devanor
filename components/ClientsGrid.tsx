import Image from "next/image";
import { prisma } from "@/lib/db";

export async function ClientsGrid() {
  let clients: { id: string; name: string; logoUrl: string; websiteUrl: string }[] =
    [];
  try {
    clients = await prisma.client.findMany({
      where: { active: true, showOnSite: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    clients = [];
  }

  if (clients.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
        Client logos will appear here. Add them from the admin panel.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {clients.map((c) => (
        <a
          key={c.id}
          href={c.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={c.name}
          className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/40"
        >
          <Image
            src={c.logoUrl}
            alt={c.name}
            width={160}
            height={80}
            className="max-h-12 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
