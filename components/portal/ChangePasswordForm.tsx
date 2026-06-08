"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword, type ActionState } from "@/lib/actions/account";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Current password</label>
        <input
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">New password</label>
        <input
          name="next"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Confirm new password</label>
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Password updated.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}
