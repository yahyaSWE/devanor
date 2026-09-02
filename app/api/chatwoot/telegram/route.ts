import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";
import { verifyTelegramLinkCode } from "@/lib/chatwoot";

const CHATWOOT_BASE_URL = "https://chatwoot-rswkm-u77951.vm.elestio.app";

const contactAttributeDefinitions = [
  ["Company ID", "company_id"],
  ["Company name", "company_name"],
  ["Job title", "job_title"],
  ["Portal user ID", "portal_user_id"],
  ["Portal email", "portal_email"],
] as const;

async function ensureContactAttributes(accountId: number, apiToken: string) {
  const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/custom_attribute_definitions`;
  const headers = { "Content-Type": "application/json", api_access_token: apiToken };
  const currentResponse = await fetch(url, { headers, cache: "no-store" });
  if (!currentResponse.ok) return false;

  const current = (await currentResponse.json()) as Array<{
    attribute_key?: string;
    attribute_model?: string;
  }>;
  const existingKeys = new Set(
    current
      .filter((attribute) => attribute.attribute_model === "contact_attribute")
      .map((attribute) => attribute.attribute_key),
  );

  const results = await Promise.all(
    contactAttributeDefinitions
      .filter(([, key]) => !existingKeys.has(key))
      .map(([displayName, key]) =>
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            attribute_display_name: displayName,
            attribute_display_type: 0,
            attribute_description: "Set automatically from the Devanor portal.",
            attribute_key: key,
            attribute_model: 1,
          }),
        }),
      ),
  );
  return results.every((result) => result.ok);
}

type ChatwootContact = {
  id: number;
  email?: string | null;
  identifier?: string | null;
};

async function findExistingPortalContact(
  accountId: number,
  apiToken: string,
  email: string,
  portalUserId: string,
  telegramContactId: number,
) {
  const response = await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/search?q=${encodeURIComponent(email)}`,
    { headers: { api_access_token: apiToken }, cache: "no-store" },
  );
  if (!response.ok) return undefined;

  const data = (await response.json()) as { payload?: ChatwootContact[] };
  const exactMatches = (data.payload ?? []).filter(
    (contact) =>
      contact.id !== telegramContactId &&
      contact.email?.toLowerCase() === email.toLowerCase(),
  );
  return (
    exactMatches.find((contact) => contact.identifier === portalUserId) ??
    exactMatches[0]
  );
}

type WebhookPayload = {
  event?: string;
  content?: string;
  processed_message_content?: string;
  message_type?: string | number;
  account_id?: number;
  account?: { id?: number };
  channel?: string;
  inbox?: { channel_type?: string };
  contact?: {
    id?: number;
    custom_attributes?: Record<string, unknown>;
    additional_attributes?: Record<string, unknown>;
  };
  sender?: {
    id?: number;
    custom_attributes?: Record<string, unknown>;
    additional_attributes?: Record<string, unknown>;
  };
  conversation?: {
    id?: number;
    channel?: string;
    meta?: {
      channel?: string;
      sender?: {
        id?: number;
        custom_attributes?: Record<string, unknown>;
        additional_attributes?: Record<string, unknown>;
      };
    };
  };
};

type ContactContext = NonNullable<WebhookPayload["sender"]>;

async function loadConversationContext(
  accountId: number,
  apiToken: string,
  conversationId?: number,
) {
  if (!conversationId) return undefined;
  const response = await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}`,
    { headers: { api_access_token: apiToken }, cache: "no-store" },
  );
  if (!response.ok) return undefined;
  return (await response.json()) as {
    channel?: string;
    meta?: { channel?: string; sender?: ContactContext };
    inbox?: { channel_type?: string };
  };
}

function channelIsTelegram(...channels: Array<string | undefined>) {
  return channels.some((channel) => channel?.toLowerCase().includes("telegram"));
}

async function sendChatwootMessage(
  accountId: number,
  apiToken: string,
  conversationId: number | undefined,
  content: string,
) {
  if (!conversationId) return;
  await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", api_access_token: apiToken },
      body: JSON.stringify({ content, message_type: "outgoing", private: false }),
    },
  );
}

async function setContactBlocked(
  accountId: number,
  apiToken: string,
  contactId: number,
  blocked: boolean,
) {
  return fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", api_access_token: apiToken },
      body: JSON.stringify({ blocked }),
    },
  );
}

function validWebhookSignature(request: NextRequest, rawBody: string) {
  const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
  const signature = request.headers.get("x-chatwoot-signature");
  const timestamp = request.headers.get("x-chatwoot-timestamp");
  if (!secret || !signature || !timestamp) return false;

  const signedAt = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(signedAt) || Math.abs(now - signedAt) > 5 * 60) return false;

  const expected = `sha256=${createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(signature);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!validWebhookSignature(request, rawBody)) {
    return new Response("Invalid webhook signature", { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  const accountId = Number(process.env.CHATWOOT_ACCOUNT_ID ?? "1");
  const apiToken = process.env.CHATWOOT_API_ACCESS_TOKEN;
  const incoming = payload.message_type === "incoming" || payload.message_type === 0;
  const payloadAccountId = payload.account?.id ?? payload.account_id;
  if (payload.event !== "message_created" || !incoming) {
    return Response.json({ ok: true, ignored: true });
  }
  // Some Chatwoot channel payloads omit the account object. Only reject an
  // explicit mismatch; the signed webhook and API-scoped token remain trusted.
  if (payloadAccountId !== undefined && payloadAccountId !== accountId) {
    return Response.json({ ok: true, ignored: true });
  }

  const content = payload.content ?? payload.processed_message_content ?? "";
  const code = /^\/start(?:@[a-zA-Z0-9_]+)?\s+([a-zA-Z0-9_-]{20,64})\s*$/i.exec(
    content.trim(),
  )?.[1];
  const conversationId = payload.conversation?.id;
  if (!apiToken) {
    console.error("[chatwoot] API token is not configured");
    return new Response("Chatwoot API not configured", { status: 503 });
  }

  const conversationContext = await loadConversationContext(
    accountId,
    apiToken,
    conversationId,
  );
  const contact =
    payload.sender ??
    payload.contact ??
    payload.conversation?.meta?.sender ??
    conversationContext?.meta?.sender;
  const contactId = contact?.id;
  const linkedUserId =
    (contact?.custom_attributes?.portal_user_id as string | undefined) ??
    (contact?.additional_attributes?.portal_user_id as string | undefined);
  const verifiedLinkUserId = code ? verifyTelegramLinkCode(code) : undefined;
  const isTelegram =
    Boolean(code) ||
    channelIsTelegram(
      payload.channel,
      payload.inbox?.channel_type,
      payload.conversation?.channel,
      payload.conversation?.meta?.channel,
      conversationContext?.channel,
      conversationContext?.meta?.channel,
      conversationContext?.inbox?.channel_type,
    );

  if (!isTelegram) {
    return Response.json({ ok: true, ignored: true });
  }

  if (!contactId) {
    console.warn("[chatwoot] Telegram message has no contact id");
    return Response.json({ ok: true, ignored: true });
  }

  const portalUserId = verifiedLinkUserId ?? linkedUserId;
  const user = portalUserId
    ? await prisma.user.findUnique({
        where: { id: portalUserId },
        include: { client: true },
      })
    : null;
  const authorized = Boolean(
    user &&
      user.role === "CUSTOMER" &&
      user.active &&
      user.client?.active &&
      (verifiedLinkUserId || linkedUserId),
  );

  if (!authorized || !user) {
    await sendChatwootMessage(
      accountId,
      apiToken,
      conversationId,
      "This support channel is only available to verified Devanor portal users. Please sign in at https://www.devanor.com/login and open Telegram from the Support page.",
    ).catch(() => undefined);
    await setContactBlocked(accountId, apiToken, contactId, true);
    console.info("[chatwoot] Unverified Telegram contact blocked");
    return Response.json({ ok: true, blocked: true });
  }

  // Normal messages from a previously linked, active customer need no further
  // processing. Only a fresh signed /start command refreshes the profile data.
  if (!verifiedLinkUserId) {
    return Response.json({ ok: true, verified: true });
  }

  const customAttributes = {
    ...(contact?.custom_attributes ?? {}),
    company_id: user.client?.id ?? "",
    company_name: user.client?.name ?? "",
    job_title: user.title ?? "",
    portal_user_id: user.id,
    portal_email: user.email,
  };
  const additionalAttributes = {
    ...(contact?.additional_attributes ?? {}),
    identified_via: "portal_telegram_link",
    company_id: user.client?.id ?? "",
    company_name: user.client?.name ?? "",
    job_title: user.title ?? "",
    portal_user_id: user.id,
    portal_email: user.email,
  };

  await ensureContactAttributes(accountId, apiToken);
  const existingPortalContact = await findExistingPortalContact(
    accountId,
    apiToken,
    user.email,
    user.id,
    contactId,
  );

  const response = await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        api_access_token: apiToken,
      },
      body: JSON.stringify({
        name: user.name ?? user.email,
        blocked: false,
        // Set the native email only when it is not already owned by the
        // website-widget contact. Otherwise the two contacts are merged below.
        email: existingPortalContact ? undefined : user.email,
        custom_attributes: customAttributes,
        additional_attributes: additionalAttributes,
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "[chatwoot] Could not identify Telegram contact",
      response.status,
      (await response.text()).slice(0, 500),
    );
    return new Response("Chatwoot update failed", { status: 502 });
  }

  if (existingPortalContact) {
    const mergeResponse = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/actions/contact_merge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: apiToken,
        },
        body: JSON.stringify({
          base_contact_id: existingPortalContact.id,
          mergee_contact_id: contactId,
        }),
      },
    );
    if (!mergeResponse.ok) {
      console.error(
        "[chatwoot] Could not merge Telegram and website contacts",
        mergeResponse.status,
        (await mergeResponse.text()).slice(0, 500),
      );
    } else {
      await setContactBlocked(
        accountId,
        apiToken,
        existingPortalContact.id,
        false,
      );
      console.info("[chatwoot] Telegram and website contacts merged");
    }
  }

  if (conversationId) {
    await sendChatwootMessage(
      accountId,
      apiToken,
      conversationId,
      `Your Telegram account is now linked to ${user.client?.name ?? "your Devanor portal account"}. You can continue chatting here directly.`,
    ).catch(() => undefined);
  }

  console.info("[chatwoot] Telegram contact identified");
  return Response.json({ ok: true });
}
