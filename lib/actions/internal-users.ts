"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export type InternalUserActionState = { ok?: boolean; error?: string };

const roleSchema = z.enum(["ADMIN", "SUPPORT", "CRM"]);
const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role: roleSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function createInternalUser(
  _prev: InternalUserActionState,
  formData: FormData,
): Promise<InternalUserActionState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        tempPassword: parsed.data.password,
        mustChangePassword: true,
        clientId: null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A user with that email already exists." };
    }
    return { error: "Could not create the account. Please try again." };
  }

  revalidatePath("/admin/internal-users");
  return { ok: true };
}

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required."),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role: roleSchema,
  password: z
    .string()
    .refine((value) => value === "" || value.length >= 8, {
      message: "A new password must be at least 8 characters.",
    }),
});

export async function updateInternalUser(
  _prev: InternalUserActionState,
  formData: FormData,
): Promise<InternalUserActionState> {
  const session = await requireAdmin();
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.user.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.role === "CUSTOMER") {
    return { error: "Internal user not found." };
  }
  if (existing.id === session.user.id && parsed.data.role !== "ADMIN") {
    return { error: "You cannot remove your own Full Admin access." };
  }
  if (existing.role === "ADMIN" && parsed.data.role !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", active: true },
    });
    if (adminCount <= 1) return { error: "The last active Full Admin cannot be changed." };
  }

  try {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        ...(parsed.data.password
          ? {
              passwordHash: await bcrypt.hash(parsed.data.password, 10),
              tempPassword: parsed.data.password,
              mustChangePassword: true,
            }
          : {}),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A user with that email already exists." };
    }
    return { error: "Could not update the account. Please try again." };
  }

  revalidatePath("/admin/internal-users");
  return { ok: true };
}

export async function toggleInternalUserActive(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === session.user.id) return;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === "CUSTOMER") return;
  if (user.role === "ADMIN" && user.active) {
    const activeAdmins = await prisma.user.count({
      where: { role: "ADMIN", active: true },
    });
    if (activeAdmins <= 1) return;
  }
  await prisma.user.update({ where: { id }, data: { active: !user.active } });
  revalidatePath("/admin/internal-users");
}

export async function deleteInternalUser(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === session.user.id) return;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === "CUSTOMER") return;
  if (user.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) return;
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/internal-users");
}
