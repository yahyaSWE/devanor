"use client";

import { Button } from "@/components/Button";

export function OpenChatButton({ enabled }: { enabled: boolean }) {
  function openChat() {
    try {
      window.$chatwoot?.toggle("open");
    } catch {
      // widget not ready
    }
  }

  if (!enabled) return null;
  return <Button onClick={openChat}>Open live chat</Button>;
}
