"use client";

import { useEffect, useRef } from "react";
import { logout } from "@/lib/actions/auth";

const IDLE_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Signs the user out after 30 minutes of inactivity. Any mouse/keyboard/scroll
 * activity resets the timer. Mounted in the admin and portal layouts.
 */
export function IdleLogout() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void logout();
      }, IDLE_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, []);

  return null;
}
