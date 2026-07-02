"use client";

import { useState, useTransition } from "react";
import { sendWelcomeEmails } from "@/lib/actions/welcome";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function SendWelcomeMail({
  clientId,
  employees,
  template,
  companyName,
  loginUrl,
}: {
  clientId: string;
  employees: { id: string; name: string | null; email: string }[];
  template: { subject: string; body: string };
  companyName: string;
  loginUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cc, setCc] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, start] = useTransition();

  const render = (t: string) =>
    t
      .replace(/\{\{name\}\}/g, "[employee name]")
      .replace(/\{\{company\}\}/g, companyName)
      .replace(/\{\{loginUrl\}\}/g, loginUrl);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const send = () =>
    start(async () => {
      setMsg(null);
      const r = await sendWelcomeEmails(clientId, Array.from(selected), cc);
      setMsg(r);
    });

  if (employees.length === 0) return null;

  return (
    <div>
      <Button type="button" variant="outline" onClick={() => setOpen((v) => !v)}>
        Send Welcome Mail
      </Button>

      {open && (
        <div className="mt-4 space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Recipients</p>
            <div className="space-y-1">
              {employees.map((e) => (
                <label key={e.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.has(e.id)}
                    onChange={() => toggle(e.id)}
                  />
                  {e.name ?? e.email}{" "}
                  <span className="text-muted">· {e.email}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              CC (comma-separated emails)
            </label>
            <input
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="someone@example.com, other@example.com"
              className={inputClass}
            />
          </div>

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
                Subject: {render(template.subject)}
              </p>
              <div
                className="prose-sm text-sm text-muted [&_a]:text-accent"
                dangerouslySetInnerHTML={{ __html: render(template.body) }}
              />
            </div>
          )}

          {msg?.ok && <p className="text-sm text-accent">Email sent.</p>}
          {msg?.error && <p className="text-sm text-red-400">{msg.error}</p>}

          <Button
            type="button"
            onClick={send}
            disabled={pending || selected.size === 0}
          >
            {pending ? "Sending…" : `Send to ${selected.size} selected`}
          </Button>
        </div>
      )}
    </div>
  );
}
