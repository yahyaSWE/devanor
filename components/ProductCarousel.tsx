"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/site";

/**
 * Coverflow-style product carousel. The centre card is enlarged, active, solid
 * (non-transparent) and links to its product page with a "Learn more →" hover
 * hint; side cards are scaled/dimmed by distance and clickable to bring them to
 * the centre. Left/right arrows rotate which product is centred.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const count = products.length;

  const go = (dir: -1 | 1) => setActive((a) => (a + dir + count) % count);

  // Signed shortest distance from the active index (handles wrap-around).
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  return (
    <div className="mt-12">
      {/* overflow-hidden stops side cards creating a horizontal scrollbar */}
      <div
        className="relative h-[420px] w-full select-none overflow-hidden sm:h-[500px]"
        style={{ perspective: "1200px" }}
      >
        {products.map((p, i) => {
          const offset = offsetOf(i);
          const isActive = offset === 0;
          const abs = Math.abs(offset);
          const hidden = abs > 2;
          const number = String(i + 1).padStart(2, "0");

          const inner = (
            <div
              className={`overflow-hidden rounded-2xl border ${
                isActive
                  ? "border-border bg-surface"
                  : "card"
              }`}
            >
              <div className="relative aspect-video w-full">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 280px, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-surface-2" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold sm:text-lg">{p.name}</h3>
                  {isActive && (
                    <span className="font-mono text-xs text-muted">{number}</span>
                  )}
                </div>
                {isActive && (
                  <>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                      {p.summary}
                    </p>
                    <span className="mt-3 inline-block text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more →
                    </span>
                  </>
                )}
              </div>
            </div>
          );

          return (
            <div
              key={p.slug}
              aria-hidden={!isActive}
              className="absolute left-1/2 top-1/2 w-[260px] transition-all duration-500 ease-out sm:w-[400px]"
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 200}px) scale(${
                  isActive ? 1 : 1 - abs * 0.2
                }) rotateY(${offset * -8}deg)`,
                zIndex: 10 - abs,
                opacity: hidden ? 0 : isActive ? 1 : abs === 1 ? 0.5 : 0.3,
                pointerEvents: hidden ? "none" : "auto",
                filter: isActive ? "none" : "blur(1px)",
              }}
            >
              {isActive ? (
                <Link href={`/products/${p.slug}`} className="group block">
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="block w-full cursor-pointer text-left"
                  tabIndex={0}
                >
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows — spaced apart */}
      <div className="mt-2 flex items-center justify-center gap-10">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
