"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type ActionState } from "@/lib/actions/password-reset";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent/60";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    resetPassword,
    {},
  );

  if (!token) {
    return (
      <p className="mt-4 text-sm text-muted">
        This reset link is missing its token.{" "}
        <Link href="/forgot-password" className="text-accent hover:underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  if (state.ok) {
    return (
      <p className="mt-4 text-sm text-muted">
        Your password has been reset.{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="next" className="mb-1.5 block text-sm text-muted">
          New password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm text-muted">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
