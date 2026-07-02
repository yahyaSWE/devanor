"use client";

import { useActionState, useState } from "react";
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

  return (
    <li className="py-3">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">{user.name ?? user.email}</p>
            {user.title && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                {user.title}
              </span>
            )}
            {!user.active && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                Inactive
              </span>
            )}
            {user.zgsUsername && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                ZGS
              </span>
            )}
            {user.welcomeEmailSent && (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
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
          onClick={() => setEditing((v) => !v)}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          {editing ? "Close" : "Edit"}
        </button>
        <form action={toggleUserActive}>
          <input type="hidden" name="id" value={user.id} />
          <button className="shrink-0 text-sm text-muted hover:text-foreground">
            {user.active ? "Deactivate" : "Activate"}
          </button>
        </form>
        <ConfirmSubmit
          action={deleteUser}
          hidden={{ id: user.id }}
          trigger="Remove"
          confirmLabel="Remove employee"
          title="Remove employee?"
          message={`This removes the portal login for ${
            user.name ?? user.email
          }. This cannot be undone.`}
          triggerClassName="shrink-0 text-sm text-muted hover:text-red-400"
        />
      </div>

      {editing && (
        <form action={action} className="mt-3 space-y-2 rounded-lg border border-border bg-background/40 p-3">
          <input type="hidden" name="id" value={user.id} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              name="name"
              defaultValue={user.name ?? ""}
              placeholder="Full name"
              className={inputClass}
            />
            <input
              name="title"
              defaultValue={user.title ?? ""}
              placeholder="Job title / role"
              className={inputClass}
            />
            <input
              name="email"
              type="email"
              required
              defaultValue={user.email}
              placeholder="Email"
              className={inputClass}
            />
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
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          {state.ok && <p className="text-sm text-accent">Saved.</p>}
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      )}
    </li>
  );
}
