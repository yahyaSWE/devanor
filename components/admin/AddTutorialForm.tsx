"use client";

import { useActionState, useEffect, useRef } from "react";
import { addTutorial, type ActionState } from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddTutorialForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(addTutorial, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Title *</label>
        <input name="title" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <input name="description" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Level</label>
        <select name="level" className={inputClass} defaultValue="Beginner">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">URL *</label>
        <input
          name="url"
          required
          placeholder="https://…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Visible to</label>
        <select name="clientId" className={inputClass}>
          <option value="">All customers</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} only
            </option>
          ))}
        </select>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Tutorial added.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Adding…" : "Add tutorial"}
      </Button>
    </form>
  );
}
