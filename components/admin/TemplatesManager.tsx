"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
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

// Sample values so the preview shows a realistic email without any user context.
const SAMPLE = {
  name: "John Doe",
  company: "Acme AB",
  loginUrl: "https://www.devanor.com/login",
  email: "john.doe@acme.com",
  username: "john.doe",
  password: "TempPass123",
};

const renderPreview = (t: string) =>
  t.replace(/\{\{(\w+)\}\}/g, (_, k: string) =>
    k in SAMPLE ? SAMPLE[k as keyof typeof SAMPLE] : "",
  );

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

  // Controlled so the live preview (and fullscreen editor) can mirror edits.
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [showPreview, setShowPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const previewSubject = useMemo(() => renderPreview(subject), [subject]);
  const previewBody = useMemo(() => renderPreview(body), [body]);

  useEffect(() => {
    if (state.ok) {
      onClose();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  // Escape closes the fullscreen editor first, then the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (fullscreen) setFullscreen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, onClose]);

  return (
    <>
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs text-muted">Body (HTML) *</label>
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  className="text-xs text-accent hover:underline"
                >
                  Edit fullscreen ⤢
                </button>
              </div>
              <textarea
                name="body"
                required
                rows={9}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
            <p className="text-xs text-muted">
              Placeholders: <code>{"{{name}}"}</code>,{" "}
              <code>{"{{company}}"}</code>, <code>{"{{loginUrl}}"}</code>,{" "}
              <code>{"{{email}}"}</code>, <code>{"{{username}}"}</code>,{" "}
              <code>{"{{password}}"}</code>
            </p>

            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-sm text-accent hover:underline"
            >
              {showPreview ? "Hide preview" : "Preview email"}
            </button>
            {showPreview && (
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-2 text-sm font-semibold">
                  Subject: {previewSubject}
                </p>
                <div
                  className="prose-sm text-sm text-muted [&_a]:text-accent"
                  dangerouslySetInnerHTML={{ __html: previewBody }}
                />
              </div>
            )}

            {state.error && (
              <p className="text-sm text-red-400">{state.error}</p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create template"}
            </Button>
          </form>
        </div>
      </div>

      {/* Fullscreen editor with live preview */}
      {fullscreen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="font-semibold">
              {isEdit ? "Edit template" : "New template"}
            </h2>
            <Button type="button" onClick={() => setFullscreen(false)}>
              Done
            </Button>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-auto p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-1 flex-col">
                <label className="mb-1 block text-xs text-muted">
                  Body (HTML)
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`${inputClass} flex-1 font-mono`}
                />
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-border bg-surface/40 p-4">
              <p className="mb-2 text-xs font-medium text-muted">Preview</p>
              <p className="mb-3 text-sm font-semibold">{previewSubject}</p>
              <div
                className="prose-sm text-sm text-muted [&_a]:text-accent"
                dangerouslySetInnerHTML={{ __html: previewBody }}
              />
            </div>
          </div>
        </div>
      )}
    </>
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
