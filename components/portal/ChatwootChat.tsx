"use client";

import { useEffect } from "react";

type ChatwootUser = {
  identifier: string;
  identifierHash?: string;
  name: string;
  email: string;
  phone?: string;
  companyId?: string;
  companyName?: string;
  jobTitle?: string;
};

type ChatwootSdk = {
  run: (options: { websiteToken: string; baseUrl: string }) => void;
};

type ChatwootApi = {
  setUser: (identifier: string, attributes: Record<string, string | undefined>) => void;
  setCustomAttributes: (attributes: Record<string, string>) => void;
  toggle: (state?: "open" | "close") => void;
  toggleBubbleVisibility: (state: "show" | "hide") => void;
  reset: () => void;
};

declare global {
  interface Window {
    chatwootSettings?: {
      position: "left" | "right";
      type: "standard" | "expanded_bubble";
      launcherTitle: string;
    };
    chatwootSDK?: ChatwootSdk;
    $chatwoot?: ChatwootApi;
  }
}

const SCRIPT_ID = "chatwoot-sdk";

export function ChatwootChat({
  baseUrl,
  websiteToken,
  user,
}: {
  baseUrl: string;
  websiteToken: string;
  user: ChatwootUser;
}) {
  useEffect(() => {
    let cancelled = false;

    const identify = () => {
      if (cancelled || !window.$chatwoot) return;

      window.$chatwoot.toggleBubbleVisibility("show");

      window.$chatwoot.setUser(user.identifier, {
        name: user.name,
        email: user.email,
        phone_number: user.phone,
        company_name: user.companyName,
        identifier_hash: user.identifierHash,
      });

      const customAttributes = Object.fromEntries(
        Object.entries({
          company_id: user.companyId,
          company_name: user.companyName,
          job_title: user.jobTitle,
          portal_user_id: user.identifier,
        }).filter((entry): entry is [string, string] => Boolean(entry[1])),
      );
      if (Object.keys(customAttributes).length > 0) {
        window.$chatwoot.setCustomAttributes(customAttributes);
      }
    };

    const onReady = () => identify();
    window.addEventListener("chatwoot:ready", onReady);
    window.chatwootSettings = {
      position: "right",
      type: "standard",
      launcherTitle: "",
    };

    if (window.$chatwoot) {
      identify();
    } else {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!existing) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `${baseUrl.replace(/\/$/, "")}/packs/js/sdk.js`;
        script.onload = () => {
          if (!cancelled) window.chatwootSDK?.run({ websiteToken, baseUrl });
        };
        document.head.appendChild(script);
      } else if (window.chatwootSDK) {
        window.chatwootSDK.run({ websiteToken, baseUrl });
      }
    }

    return () => {
      cancelled = true;
      window.removeEventListener("chatwoot:ready", onReady);
      window.$chatwoot?.toggle("close");
      window.$chatwoot?.toggleBubbleVisibility("hide");
    };
  }, [baseUrl, websiteToken, user]);

  return null;
}
