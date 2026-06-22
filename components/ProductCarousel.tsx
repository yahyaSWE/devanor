"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/site";

/**
 * Coverflow-style product carousel. The centre card is enlarged and active,
 * shows the product image + a "See more" link to its page; side cards are
 * scaled down and clickable to bring them to the centre. Left/right arrows
 * rotate which product is centred.
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
      <div
        className="relative h-[420px] w-full select-none sm:h-[500px]"
        style={{ perspective: "1200px" }}
      >
        {products.map((p, i) => {
          const offset = offsetOf(i);
          const isActive = offset === 0;
          const abs = Math.abs(offset);
          // Hide cards far from the centre.
          const hidden = abs > 2;
          return (
            <div
              key={p.slug}
              aria-hidden={!isActive}
              className="absolute left-1/2 top-1/2 w-[280px] transition-all duration-500 ease-out sm:w-[400px]"
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
              <button
                type="button"
                onClick={() => !isActive && setActive(i)}
                className="block w-full cursor-pointer text-left"
                tabIndex={isActive ? -1 : 0}
              >
                <div className="card overflow-hidden p-0">
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
                    <h3 className="text-base font-semibold sm:text-lg">{p.name}</h3>
                    {isActive && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                        {p.summary}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {isActive && (
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/products/${p.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
                  >
                    See more →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <div className="mt-2 flex items-center justify-center gap-4">
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
