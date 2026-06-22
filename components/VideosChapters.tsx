"use client";

import { useState } from "react";

export type VideoChapter = {
  slug: string;
  name: string;
  summary?: string;
  embed: string;
};

/**
 * Chapter-based demo video player. One chapter (video) is shown at a time;
 * visitors move between chapters by clicking a chapter or the prev/next
 * arrows — there is no scrolling between chapters.
 */
export function VideosChapters({ chapters }: { chapters: VideoChapter[] }) {
  const [active, setActive] = useState(0);
  const count = chapters.length;

  if (count === 0) {
    return (
      <p className="mt-12 text-muted">Demo videos are coming soon.</p>
    );
  }

  const go = (dir: -1 | 1) => setActive((a) => (a + dir + count) % count);
  const current = chapters[active];

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Chapter list */}
      <nav aria-label="Chapters" className="flex flex-col gap-2">
        {chapters.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.slug}
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
              <span className="text-sm font-semibold">{c.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Player */}
      <div>
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

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{current.name}</h2>
            {current.summary && (
              <p className="mt-1 max-w-xl text-sm text-muted">{current.summary}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous chapter"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-mono text-xs text-muted">
              {active + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next chapter"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
