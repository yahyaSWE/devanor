// Minimal email sender using the Resend REST API (no SDK dependency).
// Configure RESEND_API_KEY and EMAIL_FROM in the environment. When they are
// missing, sending is skipped gracefully (useful in local/dev).

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  cc?: string[];
};

export async function sendEmail({
  to,
  subject,
  html,
  cc,
}: SendArgs): Promise<{ ok: boolean; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      `[email] RESEND_API_KEY/EMAIL_FROM not configured — skipping email to ${to}`,
    );
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(cc && cc.length ? { cc } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send failed", e);
    return { ok: false };
  }
}

/** Base URL for links in emails. */
export function appUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
