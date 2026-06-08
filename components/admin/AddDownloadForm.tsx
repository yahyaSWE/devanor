"use client";

import { useActionState, useEffect, useRef } from "react";
import { addDownload, type ActionState } from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddDownloadForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(addDownload, initial);
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
        <label className="mb-1 block text-xs text-muted">Category</label>
        <input
          name="category"
          placeholder="e.g. License, Script, Document"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">File *</label>
        <input
          name="file"
          type="file"
          required
          className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground"
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
      {state.ok && <p className="text-sm text-accent">File uploaded.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Uploading…" : "Upload file"}
      </Button>
    </form>
  );
}
