"use client";

import { useState } from "react";
import { getEmbedUrl } from "@/lib/video";

type McadVideo = { name: string; videoUrl: string };

/**
 * Vertical, numbered MCAD-system menu + video player. Used on the routing
 * bridge & transformer product pages, where each MCAD system has its own demo.
 * Pick a system on the left; its video plays on the right.
 */
export function McadVideoMenu({ videos }: { videos: McadVideo[] }) {
  const items = videos
    .map((v) => ({ name: v.name, embed: getEmbedUrl(v.videoUrl) }))
    .filter((v): v is { name: string; embed: string } => v.embed !== null);

  const [active, setActive] = useState(0);

  if (items.length === 0) return null;
  const current = items[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* System menu */}
      <nav aria-label="MCAD systems" className="flex flex-col gap-2">
        {items.map((v, i) => {
          const isActive = i === active;
          return (
            <button
              key={v.name}
              type="button"
              onClick={() => setActive(i)}
              aria-current={isActive ? "true" : undefined}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                isActive
                  ? "border-accent/60 bg-surface text-foreground"
                  : "border-border bg-surface/30 text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold">{v.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Player */}
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          key={current.embed}
          src={current.embed}
          title={`${current.name} demo`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
