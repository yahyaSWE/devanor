"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().min(1, "Please enter your company."),
  phone: z.string().min(1, "Please enter your phone number."),
  message: z.string().optional(),
});

export type DemoFormState = {
  ok?: boolean;
  error?: string;
};

// Spam bots fill every field they find and submit instantly. Two cheap checks
// catch most of them without bothering real visitors: a hidden field no human
// ever sees, and a minimum time between the page rendering and the submit.
const MIN_FILL_MS = 3000;

function looksAutomated(formData: FormData): boolean {
  // Honeypot — visually hidden and off the tab order, so only a bot fills it.
  if (String(formData.get("website") ?? "").trim() !== "") return true;

  // Time trap. The timestamp is rendered into the page, so it survives even
  // without JavaScript; a missing or bogus value means the form wasn't rendered.
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  return Date.now() - startedAt < MIN_FILL_MS;
}

export async function submitDemo(
  _prev: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  // Report success so bots don't retry or tweak their payload, but drop it.
  if (looksAutomated(formData)) return { ok: true };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: String(formData.get("company") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }

  try {
    await prisma.demoRequest.create({ data: parsed.data });
  } catch {
    return { error: "Something went wrong. Please try again or call us directly." };
  }

  // Notify the team. Best-effort — the lead is already saved, so a mail failure
  // must not fail the submission. Reply-To is the prospect so the team can reply
  // straight back.
  const { name, email, company, phone, message } = parsed.data;
  await sendEmail({
    to: "info@devanor.com",
    replyTo: email,
    subject: `New demo request — ${name} (${company})`,
    html: `<h2>New demo request</h2>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(name)}</li>
  <li><strong>Email:</strong> ${escapeHtml(email)}</li>
  <li><strong>Company:</strong> ${escapeHtml(company)}</li>
  <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
</ul>
<p><strong>Interested in:</strong><br/>${
      message ? escapeHtml(message).replace(/\n/g, "<br/>") : "—"
    }</p>`,
  });

  return { ok: true };
}
