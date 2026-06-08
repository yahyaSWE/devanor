"use client";

import Script from "next/script";
import { useEffect } from "react";

type ZE = (...args: unknown[]) => void;
declare global {
  interface Window {
    zE?: ZE;
  }
}

/**
 * Loads the Zendesk Web Widget for logged-in customers and prefills their
 * name/email. Rendered in the portal layout so the widget is available on
 * every portal page. Renders nothing when no key is configured.
 */
export function ZendeskChat({
  zendeskKey,
  name,
  email,
}: {
  zendeskKey?: string;
  name?: string | null;
  email?: string | null;
}) {
  useEffect(() => {
    if (!zendeskKey) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.zE) {
        clearInterval(timer);
        try {
          // Classic Web Widget prefill (no-op on Messaging widgets)
          window.zE("webWidget", "prefill", {
            name: { value: name ?? "" },
            email: { value: email ?? "" },
          });
        } catch {
          // Messaging widget — identity is handled differently; ignore.
        }
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [zendeskKey, name, email]);

  if (!zendeskKey) return null;

  return (
    <Script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
      strategy="afterInteractive"
    />
  );
}
