"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export type ActionState = { ok?: boolean; error?: string };

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  websiteUrl: z.string().url("Enter a valid website URL (including https://)."),
  logoUrl: z.string().url().optional(),
});

const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

async function saveLogoFile(file: File): Promise<string> {
  const ext = path.extname(file.name) || ".png";
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function addClient(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl"),
    logoUrl: formData.get("logoUrl") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let logoUrl = parsed.data.logoUrl;
  const file = formData.get("logoFile");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      return { error: "Logo must be a PNG, JPG, SVG or WebP image." };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { error: "Logo must be smaller than 2 MB." };
    }
    logoUrl = await saveLogoFile(file);
  }

  if (!logoUrl) {
    return { error: "Provide a logo file or a logo image URL." };
  }

  await prisma.client.create({
    data: { name: parsed.data.name, websiteUrl: parsed.data.websiteUrl, logoUrl },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteClient(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id === "string") {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/about");
    revalidatePath("/admin");
  }
}

const customerSchema = z.object({
  email: z.string().email("Enter a valid email."),
  name: z.string().optional(),
  title: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  clientId: z.string().optional(),
});

export async function createCustomer(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = customerSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    title: formData.get("title") || undefined,
    password: formData.get("password"),
    clientId: formData.get("clientId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        title: parsed.data.title || null,
        passwordHash,
        role: "CUSTOMER",
        clientId: parsed.data.clientId || null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A user with that email already exists." };
    }
    return { error: "Could not create the account. Please try again." };
  }

  revalidatePath("/admin");
  if (parsed.data.clientId) revalidatePath(`/admin/clients/${parsed.data.clientId}`);
  return { ok: true };
}

export async function deleteUser(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true, clientId: true },
  });
  // Never allow deleting admin accounts from here.
  if (!user || user.role === "ADMIN") return;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
  if (user.clientId) revalidatePath(`/admin/clients/${user.clientId}`);
}
