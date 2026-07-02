"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendWelcomeEmailToUser } from "@/lib/welcome";

export type ActionState = { ok?: boolean; error?: string };

/** Save the editable welcome-email template (subject + body). */
export async function updateWelcomeTemplate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) return { error: "Subject and body are required." };

  await prisma.emailTemplate.upsert({
    where: { key: "welcome" },
    update: { subject, body },
    create: { key: "welcome", subject, body },
  });

  revalidatePath("/admin/account");
  return { ok: true };
}

/** Manually send the welcome email to selected employees, with optional CC. */
export async function sendWelcomeEmails(
  clientId: string,
  userIds: string[],
  cc: string,
): Promise<ActionState> {
  await requireAdmin();
  if (!userIds.length) return { error: "Select at least one recipient." };

  const ccList = cc
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Only send to users actually belonging to this company.
  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, clientId },
    select: { id: true },
  });

  let sent = 0;
  for (const u of users) {
    const r = await sendWelcomeEmailToUser(u.id, ccList);
    if (r.ok) sent++;
  }

  revalidatePath(`/admin/clients/${clientId}`);
  if (sent === 0) {
    return {
      error: "No emails were sent — check that Resend is configured.",
    };
  }
  return { ok: true };
}
