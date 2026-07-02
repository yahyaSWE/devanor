"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type ActionState } from "@/lib/actions/password-reset";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent/60";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    requestPasswordReset,
    {},
  );

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-20">
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
        <Link href="/login" className="text-sm text-muted hover:text-foreground">
          ← Back to sign in
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Forgot password</h1>

        {state.ok ? (
          <p className="mt-4 text-sm text-muted">
            If an account exists for that email, a reset link is on its way. The
            link expires in 1 hour.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
            <form action={formAction} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </div>
              {state.error && <p className="text-sm text-red-400">{state.error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
