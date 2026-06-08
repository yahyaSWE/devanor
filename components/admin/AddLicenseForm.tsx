"use client";

import { useActionState, useEffect, useRef } from "react";
import { addLicense, type ActionState } from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddLicenseForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(addLicense, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Client *</label>
        <select name="clientId" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Select a client
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Module *</label>
        <input
          name="module"
          required
          placeholder="e.g. E3.Schematic"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Seats</label>
          <input name="seats" type="number" min={1} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Status</label>
          <select name="status" className={inputClass} defaultValue="ACTIVE">
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Renews / expires</label>
        <input name="expiresAt" type="date" className={inputClass} />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">License added.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Adding…" : "Add license"}
      </Button>
    </form>
  );
}
