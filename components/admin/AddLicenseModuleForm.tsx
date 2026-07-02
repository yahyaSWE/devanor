"use client";

import { useActionState, useEffect, useRef } from "react";
import { addLicenseModule, type ActionState } from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddLicenseModuleForm() {
  const [state, action, pending] = useActionState(addLicenseModule, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Module name *</label>
        <input
          name="name"
          required
          placeholder="e.g. E3.schematic"
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Module added.</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Adding…" : "Add module"}
      </Button>
    </form>
  );
}
