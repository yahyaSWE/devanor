"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateUser,
  toggleUserActive,
  deleteUser,
  type ActionState,
} from "@/lib/actions/admin";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export type EmployeeRowData = {
  id: string;
  name: string | null;
  email: string;
  title: string | null;
  active: boolean;
  zgsUsername: string | null;
  zgsTempPassword: string | null;
  welcomeEmailSent: boolean;
  addedLabel: string;
};

export function EmployeeRow({ user }: { user: EmployeeRowData }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateUser,
    {},
  );

  // Close the edit modal once the save succeeds (deferred to avoid a
  // set-state-in-effect cascade).
  useEffect(() => {
    if (!state.ok) return;
    const id = requestAnimationFrame(() => setEditing(false));
    return () => cancelAnimationFrame(id);
  }, [state.ok]);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  return (
    <li className="py-3">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">{user.name ?? user.email}</p>
            {user.title && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                {user.title}
              </span>
            )}
            {!user.active && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                Inactive
              </span>
            )}
            {user.zgsUsername && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                ZGS
              </span>
            )}
            {user.welcomeEmailSent && (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">
                Welcome Email sent
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted">
            {user.email} · added {user.addedLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          Edit
        </button>
        <ConfirmSubmit
          action={toggleUserActive}
          hidden={{ id: user.id }}
          tone="primary"
          trigger={user.active ? "Deactivate" : "Activate"}
          confirmLabel={user.active ? "Deactivate" : "Activate"}
          title={user.active ? "Deactivate employee?" : "Activate employee?"}
          message={
            user.active
              ? `${user.name ?? user.email} will no longer be able to sign in to the portal.`
              : `${user.name ?? user.email} will be able to sign in to the portal again.`
          }
          triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-foreground"
        />
        <ConfirmSubmit
          action={deleteUser}
          hidden={{ id: user.id }}
          trigger="Remove"
          confirmLabel="Remove employee"
          title="Remove employee?"
          message={`This removes the portal login for ${
            user.name ?? user.email
          }. This cannot be undone.`}
          triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
        />
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Edit employee</h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form action={action} className="space-y-3">
              <input type="hidden" name="id" value={user.id} />
              <div>
                <label className="mb-1 block text-xs text-muted">Full name</label>
                <input
                  name="name"
                  defaultValue={user.name ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  Job title / role
                </label>
                <input
                  name="title"
                  defaultValue={user.title ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={user.email}
                  className={inputClass}
                />
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="mb-2 text-xs font-medium text-muted">
                  ZGS portal (optional)
                </p>
                <div className="space-y-2">
                  <input
                    name="zgsUsername"
                    defaultValue={user.zgsUsername ?? ""}
                    placeholder="ZGS user name"
                    className={inputClass}
                  />
                  <input
                    name="zgsTempPassword"
                    defaultValue={user.zgsTempPassword ?? ""}
                    placeholder="ZGS temporary password"
                    className={inputClass}
                  />
                </div>
              </div>
              {state.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </li>
  );
}
