"use client";

import { useEffect } from "react";

type FdWidget = {
  init: (opts: {
    token: string;
    host: string;
    widgetId: string;
    jwtAuthToken?: string;
  }) => void;
  open?: () => void;
  close?: () => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    fdWidget?: FdWidget;
  }
}

const SCRIPT_ID = "Freshdesk-js-sdk";

/**
 * Loads the Freshdesk web chat widget for logged-in customers. When JWT auth is
 * configured, the visitor is identified server-side (name, email, company) so
 * agents see who they're talking to. Rendered in the portal layout, so the chat
 * is available on every portal page and nowhere else. Renders nothing (and
 * loads nothing) when the widget isn't configured.
 */
export function FreshdeskChat({
  token,
  host,
  widgetId,
  authEnabled = false,
}: {
  token?: string;
  host?: string;
  widgetId?: string;
  /** When the signing secret is configured, authenticate the visitor. */
  authEnabled?: boolean;
}) {
  useEffect(() => {
    if (!token || !host || !widgetId) return;
    let cancelled = false;

    const start = async () => {
      // Identify the logged-in customer when auth is configured. Best-effort:
      // a failure here just means an anonymous chat instead of no chat.
      let jwtAuthToken: string | undefined;
      if (authEnabled) {
        try {
          const res = await fetch("/api/freshdesk/token");
          if (res.ok) {
            const data = await res.json();
            jwtAuthToken = data?.jwt;
          }
        } catch {
          // ignore — fall through to an unauthenticated widget
        }
      }
      if (cancelled) return;

      const init = () => {
        if (cancelled) return;
        try {
          window.fdWidget?.init({ token, host, widgetId, jwtAuthToken });
        } catch {
          // widget unavailable — nothing else to do
        }
      };

      if (document.getElementById(SCRIPT_ID)) {
        init();
        return;
      }
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `${host.replace(/\/$/, "")}/webchat/js/widget.js`;
      script.onload = init;
      document.head.appendChild(script);
    };

    start();
    return () => {
      cancelled = true;
    };
  }, [token, host, widgetId, authEnabled]);

  return null;
}
