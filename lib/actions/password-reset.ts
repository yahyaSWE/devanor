"use server";

import crypto from "node:crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";

export type ActionState = { ok?: boolean; error?: string };

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const emailSchema = z.object({ email: z.string().email() });

/**
 * Create a reset token and email a link. Always returns ok (never reveals
 * whether an account exists).
 */
export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Enter a valid email address." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Only issue tokens for active accounts, but don't disclose either way.
  if (user && user.active) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const link = `${appUrl()}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your Devanor password",
      html: `
        <p>We received a request to reset your Devanor password.</p>
        <p><a href="${link}">Click here to choose a new password</a>. This link expires in 1 hour.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });
  }

  return { ok: true };
}

const resetSchema = z.object({
  token: z.string().min(1),
  next: z.string().min(8, "Password must be at least 8 characters."),
  confirm: z.string().min(1),
});

export async function resetPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (parsed.data.next !== parsed.data.confirm) {
    return { error: "Passwords do not match." };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });
  if (!record || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.next, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash, mustChangePassword: false },
    }),
    // Invalidate all outstanding tokens for this user.
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { ok: true };
}
