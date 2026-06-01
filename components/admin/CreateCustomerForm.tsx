"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCustomer, type ActionState } from "@/lib/actions/admin";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function CreateCustomerForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createCustomer, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Email *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Name</label>
        <input name="name" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">
          Temporary password *
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
      <div>
        <label className="mb-1 block text-xs text-muted">Linked client</label>
        <select name="clientId" className={inputClass}>
          <option value="">— None —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Customer account created.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create portal login"}
      </Button>
    </form>
  );
}
