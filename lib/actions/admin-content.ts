"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { saveUpload, deleteUpload } from "@/lib/storage";

export type ActionState = { ok?: boolean; error?: string };

const MAX_FILE = 25 * 1024 * 1024; // 25 MB

// ─────────────────────────── Downloads ───────────────────────────

export async function addDownload(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > MAX_FILE) return { error: "File must be smaller than 25 MB." };

  const saved = await saveUpload(file);
  await prisma.download.create({
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      category: String(formData.get("category") ?? "").trim() || null,
      clientId: String(formData.get("clientId") ?? "") || null,
      ...saved,
    },
  });

  revalidatePath("/admin/downloads");
  revalidatePath("/portal/downloads");
  return { ok: true };
}

export async function deleteDownload(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const download = await prisma.download.findUnique({ where: { id } });
  if (download) {
    await deleteUpload(download.storedName);
    await prisma.download.delete({ where: { id } });
    revalidatePath("/admin/downloads");
    revalidatePath("/portal/downloads");
  }
}

// ─────────────────────────── Tutorials ───────────────────────────

const tutorialSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  level: z.string().min(1),
  url: z.string().url("Enter a valid URL (including https://)."),
  clientId: z.string().optional(),
});

export async function addTutorial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = tutorialSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    level: formData.get("level") || "Beginner",
    url: formData.get("url"),
    clientId: formData.get("clientId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.tutorial.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      level: parsed.data.level,
      url: parsed.data.url,
      clientId: parsed.data.clientId || null,
    },
  });

  revalidatePath("/admin/tutorials");
  revalidatePath("/portal/tutorials");
  return { ok: true };
}

export async function deleteTutorial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.tutorial.delete({ where: { id } });
    revalidatePath("/admin/tutorials");
    revalidatePath("/portal/tutorials");
  }
}

// ─────────────────────────── Licenses ───────────────────────────

const licenseSchema = z.object({
  clientId: z.string().min(1, "Select a client."),
  type: z.enum(["LICENSE", "MAINTENANCE"]),
  module: z.string().min(1, "Module / item is required."),
  seats: z.coerce.number().int().positive().optional(),
  status: z.enum(["ACTIVE", "TRIAL", "EXPIRED"]),
  expiresAt: z.string().optional(),
});

export async function addLicense(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = licenseSchema.safeParse({
    clientId: formData.get("clientId"),
    type: formData.get("type") || "LICENSE",
    module: formData.get("module"),
    seats: formData.get("seats") || undefined,
    status: formData.get("status") || "ACTIVE",
    expiresAt: formData.get("expiresAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.license.create({
    data: {
      clientId: parsed.data.clientId,
      type: parsed.data.type,
      module: parsed.data.module,
      seats: parsed.data.seats ?? null,
      status: parsed.data.status,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  revalidatePath("/admin/licenses");
  revalidatePath("/portal/licenses");
  return { ok: true };
}

export async function deleteLicense(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.license.delete({ where: { id } });
    revalidatePath("/admin/licenses");
    revalidatePath("/portal/licenses");
  }
}
