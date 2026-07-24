import { prisma } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";

export type WelcomeTemplate = { subject: string; body: string };
export type NamedTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

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

/** The built-in default template (key "welcome"), or the hard-coded fallback. */
export async function getWelcomeTemplate(): Promise<WelcomeTemplate> {
  const row = await prisma.emailTemplate.findUnique({
    where: { key: "welcome" },
  });
  return row ? { subject: row.subject, body: row.body } : DEFAULT_WELCOME;
}

/** Make sure the built-in "welcome" template row exists, then return all. */
export async function listTemplates(): Promise<NamedTemplate[]> {
  const existing = await prisma.emailTemplate.findUnique({
    where: { key: "welcome" },
  });
  if (!existing) {
    await prisma.emailTemplate.create({
      data: {
        key: "welcome",
        name: "Welcome",
        subject: DEFAULT_WELCOME.subject,
        body: DEFAULT_WELCOME.body,
      },
    });
  }
  const rows = await prisma.emailTemplate.findMany({
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    subject: r.subject,
    body: r.body,
  }));
}

export function renderTemplate(
  text: string,
  vars: Record<string, string>,
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/**
 * Send a welcome email to one user with an explicit subject/body (the admin's
 * edited copy). Renders {{name}}/{{company}}/{{loginUrl}} and stamps
 * welcomeEmailSentAt on success.
 */
export async function sendWelcomeEmailWithContent(
  userId: string,
  subject: string,
  body: string,
  cc?: string[],
): Promise<{ ok: boolean; skipped?: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { client: true },
  });
  if (!user) return { ok: false };

  const vars = {
    name: user.name || user.email,
    company: user.client?.name ?? "",
    loginUrl: `${appUrl()}/login`,
  };

  const res = await sendEmail({
    to: user.email,
    subject: renderTemplate(subject, vars),
    html: renderTemplate(body, vars),
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
