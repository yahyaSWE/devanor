"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  addTutorial,
  updateTutorial,
  type ActionState,
} from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export type TutorialFormData = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  url: string;
  clientId: string | null;
};

export function AddTutorialForm({
  clients,
  tutorial,
  onSuccess,
}: {
  clients: { id: string; name: string }[];
  tutorial?: TutorialFormData;
  onSuccess?: () => void;
}) {
  const isEdit = !!tutorial;
  const [state, action, pending] = useActionState(
    isEdit ? updateTutorial : addTutorial,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      if (!isEdit) formRef.current?.reset();
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      {isEdit && <input type="hidden" name="id" value={tutorial!.id} />}
      <div>
        <label className="mb-1 block text-xs text-muted">Title *</label>
        <input
          name="title"
          required
          defaultValue={tutorial?.title ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <input
          name="description"
          defaultValue={tutorial?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Level</label>
        <select
          name="level"
          className={inputClass}
          defaultValue={tutorial?.level ?? "Beginner"}
        >
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
          defaultValue={tutorial?.url ?? ""}
          placeholder="https://…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Visible to</label>
        <select
          name="clientId"
          className={inputClass}
          defaultValue={tutorial?.clientId ?? ""}
        >
          <option value="">All customers</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} only
            </option>
          ))}
        </select>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && !isEdit && (
        <p className="text-sm text-accent">Tutorial added.</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? isEdit
            ? "Saving…"
            : "Adding…"
          : isEdit
            ? "Save changes"
            : "Add tutorial"}
      </Button>
    </form>
  );
}
