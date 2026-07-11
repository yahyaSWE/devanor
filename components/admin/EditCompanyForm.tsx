"use client";

import { useActionState, useEffect } from "react";
import { updateClient, type ActionState } from "@/lib/actions/admin";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function EditCompanyForm({
  client,
  onSuccess,
}: {
  client: { id: string; name: string; websiteUrl: string; address: string | null };
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(updateClient, initial);

  useEffect(() => {
    if (state.ok) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={client.id} />
      <div>
        <label className="mb-1 block text-xs text-muted">Company name *</label>
        <input
          name="name"
          required
          defaultValue={client.name}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Website URL *</label>
        <input
          name="websiteUrl"
          required
          defaultValue={client.websiteUrl}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Address</label>
        <input
          name="address"
          defaultValue={client.address ?? ""}
          placeholder="Street, city, country"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Replace logo (file)</label>
        <input
          name="logoFile"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">…or new logo URL</label>
        <input
          name="logoUrl"
          placeholder="https://company.com/logo.svg"
          className={inputClass}
        />
      </div>
      <p className="text-xs text-muted">Leave logo fields empty to keep the current one.</p>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Company updated.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
