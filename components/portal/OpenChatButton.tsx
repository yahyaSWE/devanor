"use client";

import { Button } from "@/components/Button";

export function OpenChatButton({ enabled }: { enabled: boolean }) {
  function openChat() {
    const zE = window.zE;
    if (!zE) return;
    // Works for both Classic and Messaging widgets.
    try {
      zE("messenger", "open");
    } catch {
      try {
        zE("webWidget", "open");
      } catch {
        // widget not ready
      }
    }
  }

  if (!enabled) return null;
  return <Button onClick={openChat}>Open live chat</Button>;
}
