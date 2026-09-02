import { createHmac, timingSafeEqual } from "node:crypto";

const TELEGRAM_LINK_TTL_SECONDS = 15 * 60;

/** Sign a portal user id without exposing the Chatwoot inbox secret. */
export function chatwootIdentifierHash(identifier: string) {
  const secret = process.env.CHATWOOT_IDENTITY_VALIDATION_SECRET;
  if (!secret) return undefined;

  return createHmac("sha256", secret).update(identifier).digest("hex");
}

function telegramSigningSecret() {
  return process.env.AUTH_SECRET;
}

/** Telegram limits start payloads to 64 URL-safe characters. */
export function createTelegramLinkCode(userId: string) {
  const secret = telegramSigningSecret();
  if (!secret) return undefined;

  const expires = Math.floor(Date.now() / 1000) + TELEGRAM_LINK_TTL_SECONDS;
  const payload = `${userId}_${expires.toString(36)}`;
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest()
    .subarray(0, 12)
    .toString("base64url");
  const code = `${payload}_${signature}`;

  return code.length <= 64 ? code : undefined;
}

export function verifyTelegramLinkCode(code: string) {
  const secret = telegramSigningSecret();
  const match = /^([a-zA-Z0-9-]+)_([a-z0-9]+)_([a-zA-Z0-9_-]+)$/.exec(code);
  if (!secret || !match) return undefined;

  const [, userId, expiresText, suppliedSignature] = match;
  const expires = Number.parseInt(expiresText, 36);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) {
    return undefined;
  }

  const payload = `${userId}_${expiresText}`;
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest()
    .subarray(0, 12);
  let supplied: Buffer;
  try {
    supplied = Buffer.from(suppliedSignature, "base64url");
  } catch {
    return undefined;
  }

  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return undefined;
  }
  return userId;
}
