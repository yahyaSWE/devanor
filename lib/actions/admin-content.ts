"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
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

// ─────────── License catalog (modules, name only, not tied to a company) ───────────

export async function addLicenseModule(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  try {
    await prisma.licenseModule.create({ data: { name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A module with that name already exists." };
    }
    return { error: "Could not add the module. Please try again." };
  }

  revalidatePath("/admin/licenses");
  return { ok: true };
}

export async function updateLicenseModule(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Name is required." };

  try {
    await prisma.licenseModule.update({ where: { id }, data: { name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A module with that name already exists." };
    }
    return { error: "Could not rename the module. Please try again." };
  }

  revalidatePath("/admin/licenses");
  return { ok: true };
}

export async function deleteLicenseModule(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.licenseModule.delete({ where: { id } });
    revalidatePath("/admin/licenses");
  }
}

// ─────────── License assignment (catalog modules → company) ───────────

const licenseFieldsSchema = z.object({
  contractType: z.enum(["PERPETUAL", "SUBSCRIPTION", "MAINTENANCE"]),
  lockType: z.enum(["SUPER_FLOATING", "NODE_LOCKED"]).optional(),
  version: z.string().optional(),
  seats: z.coerce.number().int().positive().optional(),
  status: z.enum(["ACTIVE", "TRIAL", "EXPIRED"]),
  expiresAt: z.string().optional(),
});

type LicenseKeyFields = {
  keyFileName?: string;
  keyStoredName?: string;
  keyMimeType?: string;
  keySize?: number;
};

// Parse the shared license fields from FormData. Maintenance contracts ignore
// lockType / version / MAC IDs / key file.
function parseLicenseFields(formData: FormData) {
  const parsed = licenseFieldsSchema.safeParse({
    contractType: formData.get("contractType") || "PERPETUAL",
    lockType: formData.get("lockType") || undefined,
    version: formData.get("version") || undefined,
    seats: formData.get("seats") || undefined,
    status: formData.get("status") || "ACTIVE",
    expiresAt: formData.get("expiresAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." } as const;
  }

  const isMaint = parsed.data.contractType === "MAINTENANCE";
  const permanent = formData.get("permanent") === "on";
  const macIds = isMaint
    ? []
    : formData
        .getAll("macId")
        .map((m) => String(m).trim())
        .filter(Boolean);

  return {
    data: {
      contractType: parsed.data.contractType,
      lockType: isMaint ? null : parsed.data.lockType ?? null,
      version: isMaint ? null : parsed.data.version || null,
      macIds,
      seats: parsed.data.seats ?? null,
      status: parsed.data.status,
      permanent,
      expiresAt:
        permanent || !parsed.data.expiresAt
          ? null
          : new Date(parsed.data.expiresAt),
    },
    isMaint,
  } as const;
}

async function saveKeyFile(
  formData: FormData,
  isMaint: boolean,
): Promise<LicenseKeyFields | { error: string }> {
  const file = formData.get("keyFile");
  if (isMaint || !(file instanceof File) || file.size === 0) return {};
  if (file.size > MAX_FILE) {
    return { error: "License key file must be smaller than 25 MB." };
  }
  const saved = await saveUpload(file);
  return {
    keyFileName: saved.fileName,
    keyStoredName: saved.storedName,
    keyMimeType: saved.mimeType,
    keySize: saved.size,
  };
}

export async function assignLicense(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) return { error: "Missing company." };

  const moduleIds = formData
    .getAll("moduleId")
    .map((m) => String(m))
    .filter(Boolean);
  if (moduleIds.length === 0) return { error: "Select at least one module." };

  const fields = parseLicenseFields(formData);
  if ("error" in fields) return { error: fields.error };

  const key = await saveKeyFile(formData, fields.isMaint);
  if ("error" in key) return { error: key.error };

  await prisma.license.create({
    data: {
      clientId,
      modules: { connect: moduleIds.map((id) => ({ id })) },
      ...fields.data,
      ...key,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/licenses");
  revalidatePath("/portal/licenses");
  return { ok: true };
}

export async function updateLicense(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing license." };

  const existing = await prisma.license.findUnique({
    where: { id },
    select: { clientId: true, keyStoredName: true },
  });
  if (!existing) return { error: "License not found." };

  const moduleIds = formData
    .getAll("moduleId")
    .map((m) => String(m))
    .filter(Boolean);
  if (moduleIds.length === 0) return { error: "Select at least one module." };

  const fields = parseLicenseFields(formData);
  if ("error" in fields) return { error: fields.error };

  const key = await saveKeyFile(formData, fields.isMaint);
  if ("error" in key) return { error: key.error };
  // Replace the old key file if a new one was uploaded.
  if ("keyStoredName" in key && key.keyStoredName && existing.keyStoredName) {
    await deleteUpload(existing.keyStoredName);
  }

  await prisma.license.update({
    where: { id },
    data: {
      modules: { set: moduleIds.map((mid) => ({ id: mid })) },
      ...fields.data,
      ...key,
    },
  });

  revalidatePath(`/admin/clients/${existing.clientId}`);
  revalidatePath("/admin/licenses");
  revalidatePath("/portal/licenses");
  return { ok: true };
}

export async function deleteLicense(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const lic = await prisma.license.findUnique({
    where: { id },
    select: { clientId: true, keyStoredName: true },
  });
  if (lic?.keyStoredName) await deleteUpload(lic.keyStoredName);
  await prisma.license.delete({ where: { id } });
  revalidatePath("/admin/licenses");
  revalidatePath("/portal/licenses");
  if (lic?.clientId) revalidatePath(`/admin/clients/${lic.clientId}`);
}
