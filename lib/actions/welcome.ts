"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendWelcomeEmailWithContent } from "@/lib/welcome";

export type ActionState = { ok?: boolean; error?: string };

/** Create a new named email template. */
export async function createTemplate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!name || !subject || !body)
    return { error: "Name, subject and body are required." };

  await prisma.emailTemplate.create({
    // A generated key keeps `key` unique; only the built-in one is "welcome".
    data: { key: `tpl_${crypto.randomUUID()}`, name, subject, body },
  });

  revalidatePath("/admin/account");
  return { ok: true };
}

/** Edit an existing template (name + subject + body). */
export async function updateTemplate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return { error: "Missing template id." };
  if (!name || !subject || !body)
    return { error: "Name, subject and body are required." };

  await prisma.emailTemplate.update({
    where: { id },
    data: { name, subject, body },
  });

  revalidatePath("/admin/account");
  return { ok: true };
}

/** Delete a template. The built-in "welcome" template cannot be removed. */
export async function deleteTemplate(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const tpl = await prisma.emailTemplate.findUnique({ where: { id } });
  if (tpl && tpl.key !== "welcome") {
    await prisma.emailTemplate.delete({ where: { id } });
    revalidatePath("/admin/account");
  }
}

/** Send the (possibly edited) welcome email to one employee, with optional CC. */
export async function sendWelcomeEmail(
  userId: string,
  subject: string,
  body: string,
  cc: string,
): Promise<ActionState> {
  await requireAdmin();
  if (!subject.trim() || !body.trim())
    return { error: "Subject and body are required." };

  const ccList = cc
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { clientId: true },
  });
  if (!user) return { error: "Employee not found." };

  const res = await sendWelcomeEmailWithContent(userId, subject, body, ccList);
  if (user.clientId) revalidatePath(`/admin/clients/${user.clientId}`);

  if (!res.ok) {
    return { error: "Email was not sent — check that Resend is configured." };
  }
  return { ok: true };
}
