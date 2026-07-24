"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // NextAuth may surface our thrown error directly or wrap it in a cause.
      const code =
        (error as { code?: string }).code ??
        (error.cause as { err?: { code?: string } } | undefined)?.err?.code;
      if (code === "account_inactive") {
        return "Your account is no longer active. Please contact support.";
      }
      return "Invalid email or password.";
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
