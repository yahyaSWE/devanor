"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  type ActionState,
} from "@/lib/actions/welcome";
import type { NamedTemplate } from "@/lib/welcome";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

const emptyTemplate: NamedTemplate = {
  id: "",
  name: "",
  subject: "",
  body: "",
};

function TemplateFormModal({
  template,
  onClose,
}: {
  template: NamedTemplate; // id "" = create
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = !!template.id;
  const [state, action, pending] = useActionState<ActionState, FormData>(
    isEdit ? updateTemplate : createTemplate,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      onClose();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">
            {isEdit ? "Edit template" : "New template"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <form action={action} className="space-y-3">
          {isEdit && <input type="hidden" name="id" value={template.id} />}
          <div>
            <label className="mb-1 block text-xs text-muted">
              Template name *
            </label>
            <input
              name="name"
              required
              defaultValue={template.name}
              placeholder="e.g. Welcome, Onboarding, License handover"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Subject *</label>
            <input
              name="subject"
              required
              defaultValue={template.subject}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Body (HTML) *</label>
            <textarea
              name="body"
              required
              rows={9}
              defaultValue={template.body}
              className={`${inputClass} font-mono`}
            />
          </div>
          <p className="text-xs text-muted">
            Placeholders: <code>{"{{name}}"}</code>, <code>{"{{company}}"}</code>,{" "}
            <code>{"{{loginUrl}}"}</code>
          </p>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create template"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function TemplatesManager({
  templates,
}: {
  templates: NamedTemplate[];
}) {
  const [editing, setEditing] = useState<NamedTemplate | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold">Email templates</h2>
        <Button type="button" onClick={() => setEditing(emptyTemplate)}>
          New template
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted">
        Used when sending a welcome email from an employee. The built-in
        “Welcome” template can be edited but not deleted.
      </p>

      <ul className="divide-y divide-border">
        {templates.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t.name}</p>
              <p className="truncate text-sm text-muted">{t.subject}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(t)}
              className="shrink-0 text-sm text-accent hover:underline"
            >
              Edit
            </button>
            <ConfirmSubmit
              action={deleteTemplate}
              hidden={{ id: t.id }}
              trigger="Remove"
              confirmLabel="Delete template"
              requireText="DELETE"
              title="Delete template?"
              message={`Delete the “${t.name}” template? This cannot be undone.`}
              triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
            />
          </li>
        ))}
      </ul>

      {editing && (
        <TemplateFormModal
          template={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
