"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SendWelcomeMail } from "@/components/admin/SendWelcomeMail";
import type { NamedTemplate } from "@/lib/welcome";
import {
  createInternalUser,
  deleteInternalUser,
  toggleInternalUserActive,
  updateInternalUser,
  type InternalUserActionState,
} from "@/lib/actions/internal-users";

export type InternalUserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPPORT" | "CRM";
  active: boolean;
  tempPassword: string | null;
  welcomeEmailSent: boolean;
  createdLabel: string;
  isCurrent: boolean;
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";
const roleLabel = (role: InternalUserRow["role"]) =>
  role === "ADMIN" ? "Full Admin" : role === "SUPPORT" ? "Support" : "CRM";

function ModalShell({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={close} aria-label="Close" className="text-muted hover:text-foreground">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function RoleSelect({ defaultValue }: { defaultValue: InternalUserRow["role"] }) {
  return (
    <select name="role" defaultValue={defaultValue} className={inputClass}>
      <option value="SUPPORT">Support</option>
      <option value="CRM">CRM</option>
      <option value="ADMIN">Full Admin</option>
    </select>
  );
}

function AddInternalUser({ close }: { close: () => void }) {
  const [state, action, pending] = useActionState<InternalUserActionState, FormData>(
    createInternalUser,
    {},
  );
  useEffect(() => {
    if (!state.ok) return;
    const id = requestAnimationFrame(close);
    return () => cancelAnimationFrame(id);
  }, [state.ok, close]);
  return (
    <form action={action} className="space-y-3">
      <input name="name" required placeholder="Full name" className={inputClass} />
      <input name="email" type="email" required placeholder="Email" className={inputClass} />
      <div>
        <label className="mb-1 block text-xs text-muted">Role</label>
        <RoleSelect defaultValue="SUPPORT" />
      </div>
      <input name="password" type="text" required minLength={8} placeholder="Temporary password (min. 8 characters)" className={inputClass} />
      <p className="text-xs text-muted">The user must choose a new password on first sign-in.</p>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create internal user"}
      </Button>
    </form>
  );
}

function EditInternalUser({ user, close }: { user: InternalUserRow; close: () => void }) {
  const [state, action, pending] = useActionState<InternalUserActionState, FormData>(
    updateInternalUser,
    {},
  );
  useEffect(() => {
    if (!state.ok) return;
    const id = requestAnimationFrame(close);
    return () => cancelAnimationFrame(id);
  }, [state.ok, close]);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={user.id} />
      <input name="name" required defaultValue={user.name} className={inputClass} />
      <input name="email" type="email" required defaultValue={user.email} className={inputClass} />
      <div>
        <label className="mb-1 block text-xs text-muted">Role</label>
        <RoleSelect defaultValue={user.role} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">New temporary password (optional)</label>
        <input name="password" type="text" minLength={8} placeholder="Leave empty to keep current password" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

export function InternalUsersManager({
  users,
  templates,
  loginUrl,
}: {
  users: InternalUserRow[];
  templates: NamedTemplate[];
  loginUrl: string;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<InternalUserRow | null>(null);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Internal users ({users.length})</h2>
        <Button type="button" onClick={() => setAdding(true)}>Add internal user</Button>
      </div>
      {users.length === 0 ? (
        <p className="text-sm text-muted">No internal users found.</p>
      ) : (
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{user.name}</p>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">{roleLabel(user.role)}</span>
                  {!user.active && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">Inactive</span>}
                  {user.welcomeEmailSent && <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">Welcome Email sent</span>}
                  {user.isCurrent && <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">You</span>}
                </div>
                <p className="truncate text-sm text-muted">{user.email} · added {user.createdLabel}</p>
              </div>
              <SendWelcomeMail
                user={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  tempPassword: user.tempPassword,
                }}
                templates={templates}
                companyName="Devanor"
                loginUrl={loginUrl}
              />
              <button type="button" onClick={() => setEditing(user)} className="text-sm text-accent hover:underline">Edit</button>
              {!user.isCurrent && (
                <>
                  <ConfirmSubmit
                    action={toggleInternalUserActive}
                    hidden={{ id: user.id }}
                    tone="primary"
                    trigger={user.active ? "Deactivate" : "Activate"}
                    confirmLabel={user.active ? "Deactivate" : "Activate"}
                    title={`${user.active ? "Deactivate" : "Activate"} internal user?`}
                    message={user.active ? `${user.name} will no longer be able to sign in.` : `${user.name} will be able to sign in again.`}
                    triggerClassName="text-sm text-muted hover:text-foreground"
                  />
                  <ConfirmSubmit
                    action={deleteInternalUser}
                    hidden={{ id: user.id }}
                    trigger="Remove"
                    confirmLabel="Remove user"
                    requireText="DELETE"
                    title="Remove internal user?"
                    message={`This permanently removes ${user.name}'s portal account.`}
                    triggerClassName="text-sm text-muted hover:text-red-400"
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {adding && <ModalShell title="Add internal user" close={() => setAdding(false)}><AddInternalUser close={() => setAdding(false)} /></ModalShell>}
      {editing && <ModalShell title="Edit internal user" close={() => setEditing(null)}><EditInternalUser user={editing} close={() => setEditing(null)} /></ModalShell>}
    </>
  );
}
