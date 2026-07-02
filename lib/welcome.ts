import { prisma } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";

export type WelcomeTemplate = { subject: string; body: string };

// Default welcome email. Placeholders: {{name}}, {{company}}, {{loginUrl}}.
export const DEFAULT_WELCOME: WelcomeTemplate = {
  subject: "Welcome to the Devanor support portal",
  body: [
    "<p>Hi {{name}},</p>",
    "<p>Your Devanor support portal account for {{company}} is ready.</p>",
    '<p>Sign in here: <a href="{{loginUrl}}">{{loginUrl}}</a></p>',
    "<p>In the portal you can access your licenses, downloads, tutorials and support.</p>",
    "<p>Best regards,<br/>The Devanor team</p>",
  ].join("\n"),
};

/** The editable welcome template from the DB, or the built-in default. */
export async function getWelcomeTemplate(): Promise<WelcomeTemplate> {
  const row = await prisma.emailTemplate.findUnique({
    where: { key: "welcome" },
  });
  return row
    ? { subject: row.subject, body: row.body }
    : DEFAULT_WELCOME;
}

export function renderTemplate(
  text: string,
  vars: Record<string, string>,
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/**
 * Send the welcome email to one user. Marks `welcomeEmailSentAt` only when the
 * email was actually sent (Resend configured).
 */
export async function sendWelcomeEmailToUser(
  userId: string,
  cc?: string[],
): Promise<{ ok: boolean; skipped?: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { client: true },
  });
  if (!user) return { ok: false };

  const tpl = await getWelcomeTemplate();
  const vars = {
    name: user.name || user.email,
    company: user.client?.name ?? "",
    loginUrl: `${appUrl()}/login`,
  };

  const res = await sendEmail({
    to: user.email,
    subject: renderTemplate(tpl.subject, vars),
    html: renderTemplate(tpl.body, vars),
    cc,
  });

  if (res.ok) {
    await prisma.user.update({
      where: { id: userId },
      data: { welcomeEmailSentAt: new Date() },
    });
  }
  return res;
}
