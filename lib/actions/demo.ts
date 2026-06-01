"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  message: z.string().optional(),
});

export type DemoFormState = {
  ok?: boolean;
  error?: string;
};

export async function submitDemo(
  _prev: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
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

  return { ok: true };
}
