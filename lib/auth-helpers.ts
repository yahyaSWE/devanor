import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type InternalRole = "ADMIN" | "SUPPORT" | "CRM";
export type AdminPermission = "companies" | "content" | "licenses" | "users";

export const isInternalRole = (role: string): role is InternalRole =>
  role === "ADMIN" || role === "SUPPORT" || role === "CRM";

export function internalHome(role: string): string {
  if (role === "SUPPORT") return "/admin/downloads";
  if (role === "CRM" || role === "ADMIN") return "/admin";
  return "/portal";
}

export function hasAdminPermission(
  role: string,
  permission: AdminPermission,
): boolean {
  if (role === "ADMIN") return true;
  if (permission === "companies") return role === "CRM";
  if (permission === "content") return role === "SUPPORT";
  return false;
}

export async function requireInternal() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isInternalRole(session.user.role)) redirect("/portal");
  return session;
}

export async function requirePermission(permission: AdminPermission) {
  const session = await requireInternal();
  if (!hasAdminPermission(session.user.role, permission)) {
    redirect(internalHome(session.user.role));
  }
  return session;
}

export async function requireAdmin() {
  return requirePermission("users");
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}
