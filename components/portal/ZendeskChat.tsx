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
  authEnabled = false,
}: {
  zendeskKey?: string;
  name?: string | null;
  email?: string | null;
  /** When the messaging signing key is configured, authenticate the visitor. */
  authEnabled?: boolean;
}) {
  useEffect(() => {
    if (!zendeskKey) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.zE) {
        clearInterval(timer);
        try {
          // Classic Web Widget prefill (no-op / throws on Messaging widgets).
          window.zE("webWidget", "prefill", {
            name: { value: name ?? "" },
            email: { value: email ?? "" },
          });
        } catch {
          // Messaging widget — prefill isn't supported; identity via JWT below.
        }
        if (authEnabled) {
          try {
            // Messaging end-user authentication: Zendesk calls us back asking
            // for a fresh JWT, which we mint server-side for the logged-in user.
            window.zE("messenger", "loginUser", (cb: (jwt: string) => void) => {
              fetch("/api/zendesk/token")
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => {
                  if (data?.jwt) cb(data.jwt);
                })
                .catch(() => {});
            });
          } catch {
            // Not a messaging widget / API unavailable — ignore.
          }
        }
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [zendeskKey, name, email, authEnabled]);

  if (!zendeskKey) return null;

  return (
    <Script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
      strategy="afterInteractive"
    />
  );
}
