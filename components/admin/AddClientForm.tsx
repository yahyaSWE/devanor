"use client";

import { useActionState, useEffect, useRef } from "react";
import { addClient, type ActionState } from "@/lib/actions/admin";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddClientForm() {
  const [state, action, pending] = useActionState(addClient, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Client name *</label>
        <input name="name" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Website URL *</label>
        <input
          name="websiteUrl"
          required
          placeholder="https://client.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Address</label>
        <input
          name="address"
          placeholder="Street, city, country"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Logo file</label>
        <input
          name="logoFile"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">…or logo image URL</label>
        <input
          name="logoUrl"
          placeholder="https://client.com/logo.svg"
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Client added.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Adding…" : "Add client"}
      </Button>
    </form>
  );
}
