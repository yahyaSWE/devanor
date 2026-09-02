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

type WebhookPayload = {
  event?: string;
  content?: string;
  message_type?: string | number;
  account?: { id?: number };
  sender?: {
    id?: number;
    custom_attributes?: Record<string, unknown>;
    additional_attributes?: Record<string, unknown>;
  };
  conversation?: {
    channel?: string;
    meta?: { channel?: string };
  };
};

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
  if (
    payload.event !== "message_created" ||
    !incoming ||
    payload.account?.id !== accountId
  ) {
    return Response.json({ ok: true, ignored: true });
  }

  const code = /^\/start\s+([a-zA-Z0-9_-]{20,64})\s*$/.exec(
    payload.content?.trim() ?? "",
  )?.[1];
  const contactId = payload.sender?.id;
  const userId = code ? verifyTelegramLinkCode(code) : undefined;
  if (!apiToken || !contactId || !userId) {
    return Response.json({ ok: true, ignored: true });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { client: true },
  });
  if (!user || user.role !== "CUSTOMER" || !user.active) {
    return Response.json({ ok: true, ignored: true });
  }

  const customAttributes = {
    ...(payload.sender?.custom_attributes ?? {}),
    company_id: user.client?.id ?? "",
    company_name: user.client?.name ?? "",
    job_title: user.title ?? "",
    portal_user_id: user.id,
  };
  const additionalAttributes = {
    ...(payload.sender?.additional_attributes ?? {}),
    identified_via: "portal_telegram_link",
    company_id: user.client?.id ?? "",
    company_name: user.client?.name ?? "",
    job_title: user.title ?? "",
    portal_user_id: user.id,
  };

  const customAttributesReady = await ensureContactAttributes(accountId, apiToken);

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
        email: user.email,
        phone_number: user.phone ?? undefined,
        custom_attributes: customAttributesReady ? customAttributes : undefined,
        additional_attributes: additionalAttributes,
      }),
    },
  );

  if (!response.ok) {
    console.error("[chatwoot] Could not identify Telegram contact", response.status);
    return new Response("Chatwoot update failed", { status: 502 });
  }

  return Response.json({ ok: true });
}
