"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * "Official Zuken Partner" badge that sits in line with the hero content and
 * fades/slides in as the visitor starts scrolling down the hero.
 */
export function HeroBadge() {
  const { scrollY } = useScroll();
  // Reveal across the first ~180px of scroll.
  const opacity = useTransform(scrollY, [0, 60, 180], [0, 0.4, 1]);
  const y = useTransform(scrollY, [0, 180], [16, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Official Zuken Partner · E3.series Experts
    </motion.span>
  );
}
