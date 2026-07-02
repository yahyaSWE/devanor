"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate } from "@/lib/actions/auth";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-20">
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Go back
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Access the support portal.</p>

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
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent/60"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent/60"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-muted transition-colors hover:text-accent"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
