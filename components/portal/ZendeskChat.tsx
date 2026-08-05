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
  company,
  companyFieldId,
}: {
  zendeskKey?: string;
  name?: string | null;
  email?: string | null;
  /** When the messaging signing key is configured, authenticate the visitor. */
  authEnabled?: boolean;
  /** The customer's company name, attached to each conversation for agents. */
  company?: string | null;
  /** Zendesk ticket field id backing the "Company" conversation field. */
  companyFieldId?: string;
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
        if (company && companyFieldId) {
          try {
            // Attach the customer's company to every conversation so agents see
            // which company the person belongs to. Note the "messenger:set"
            // prefix — conversationFields is a setter, not an action.
            window.zE("messenger:set", "conversationFields", [
              { id: companyFieldId, value: company },
            ]);
          } catch {
            // Field not configured / not a messaging widget — ignore.
          }
        }
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [zendeskKey, name, email, authEnabled, company, companyFieldId]);

  if (!zendeskKey) return null;

  return (
    <Script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
      strategy="afterInteractive"
    />
  );
}
