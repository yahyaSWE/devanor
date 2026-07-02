"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCustomer, type ActionState } from "@/lib/actions/admin";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddEmployeeForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(createCustomer, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="clientId" value={clientId} />
      <div>
        <label className="mb-1 block text-xs text-muted">Full name</label>
        <input name="name" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Job title / role</label>
        <input
          name="title"
          placeholder="e.g. Lead Engineer, License Admin"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Email *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">
          Login temporary password *
        </label>
        <input
          name="password"
          type="text"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      <div className="rounded-lg border border-border bg-background/40 p-3">
        <p className="mb-2 text-xs font-medium text-muted">ZGS portal (optional)</p>
        <div className="space-y-2">
          <input
            name="zgsUsername"
            placeholder="ZGS user name"
            className={inputClass}
          />
          <input
            name="zgsTempPassword"
            placeholder="ZGS temporary password"
            className={inputClass}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Employee added.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Adding…" : "Add employee"}
      </Button>
    </form>
  );
}
