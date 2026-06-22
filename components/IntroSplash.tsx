"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "devanor-intro-seen";

/**
 * Brand intro shown once when the site first starts (per browser session).
 * The logo animates in centred, then the overlay fades away to reveal the page.
 */
export function IntroSplash() {
  // Start hidden; decide on mount so SSR markup stays stable and we can read
  // sessionStorage (only available in the browser).
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    // Reveal on the next frame (keeps the state update out of the effect body)
    // then auto-dismiss after a short beat.
    const raf = requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => setShow(false), 2000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Image
              src="/logo.png"
              alt="Devanor Solutions"
              width={220}
              height={70}
              priority
              className="h-auto w-44 sm:w-56"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
