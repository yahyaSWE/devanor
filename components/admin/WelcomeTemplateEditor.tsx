"use client";

import { useActionState, useState } from "react";
import { updateWelcomeTemplate, type ActionState } from "@/lib/actions/welcome";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function WelcomeTemplateEditor({
  initial,
}: {
  initial: { subject: string; body: string };
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateWelcomeTemplate,
    {},
  );
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);

  const render = (t: string) =>
    t
      .replace(/\{\{name\}\}/g, "[name]")
      .replace(/\{\{company\}\}/g, "[company]")
      .replace(/\{\{loginUrl\}\}/g, "https://devanor.com/login");

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Subject</label>
        <input
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Body (HTML)</label>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={8}
          className={`${inputClass} font-mono`}
        />
      </div>
      <p className="text-xs text-muted">
        Placeholders: <code>{"{{name}}"}</code>, <code>{"{{company}}"}</code>,{" "}
        <code>{"{{loginUrl}}"}</code>
      </p>

      <div className="rounded-lg border border-border bg-background p-4">
        <p className="mb-2 text-xs font-medium text-muted">Preview</p>
        <p className="mb-2 text-sm font-semibold">{render(subject)}</p>
        <div
          className="text-sm text-muted [&_a]:text-accent"
          dangerouslySetInnerHTML={{ __html: render(body) }}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">Template saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save template"}
      </Button>
    </form>
  );
}
