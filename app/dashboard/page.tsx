import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { internalHome, isInternalRole } from "@/lib/auth-helpers";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.mustChangePassword) redirect("/change-password");
  redirect(
    isInternalRole(session.user.role)
      ? internalHome(session.user.role)
      : "/portal",
  );
}
