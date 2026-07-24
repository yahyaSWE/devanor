"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { sendWelcomeEmail } from "@/lib/actions/welcome";
import type { NamedTemplate } from "@/lib/welcome";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function SendWelcomeMail({
  user,
  templates,
  companyName,
  loginUrl,
}: {
  user: { id: string; name: string | null; email: string };
  templates: NamedTemplate[];
  companyName: string;
  loginUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [subject, setSubject] = useState(templates[0]?.subject ?? "");
  const [body, setBody] = useState(templates[0]?.body ?? "");
  const [cc, setCc] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, start] = useTransition();

  const render = (t: string) =>
    t
      .replace(/\{\{name\}\}/g, user.name ?? user.email)
      .replace(/\{\{company\}\}/g, companyName)
      .replace(/\{\{loginUrl\}\}/g, loginUrl);

  const previewBody = useMemo(() => render(body), [body]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape closes the fullscreen editor first, then the modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (fullscreen) setFullscreen(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, fullscreen]);

  const pickTemplate = (id: string) => {
    setTemplateId(id);
    const t = templates.find((x) => x.id === id);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
    }
  };

  const send = () =>
    start(async () => {
      setMsg(null);
      const r = await sendWelcomeEmail(user.id, subject, body, cc);
      setMsg(r);
    });

  const close = () => {
    setOpen(false);
    setFullscreen(false);
    setMsg(null);
  };

  if (templates.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 text-sm text-accent hover:underline"
      >
        Send welcome mail
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                Send welcome mail · {user.name ?? user.email}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Template</label>
                <select
                  value={templateId}
                  onChange={(e) => pickTemplate(e.target.value)}
                  className={inputClass}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-xs text-muted">Body (HTML)</label>
                  <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    className="text-xs text-accent hover:underline"
                  >
                    Edit fullscreen ⤢
                  </button>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={7}
                  className={`${inputClass} font-mono`}
                />
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
                    Subject: {render(subject)}
                  </p>
                  <div
                    className="prose-sm text-sm text-muted [&_a]:text-accent"
                    dangerouslySetInnerHTML={{ __html: previewBody }}
                  />
                </div>
              )}

              {msg?.ok && (
                <p className="text-sm text-accent">
                  Email sent to {user.email}.
                </p>
              )}
              {msg?.error && <p className="text-sm text-red-400">{msg.error}</p>}

              <Button
                type="button"
                onClick={send}
                disabled={pending}
                className="w-full"
              >
                {pending ? "Sending…" : "Send email"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen editor */}
      {open && fullscreen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="font-semibold">Edit email — {user.name ?? user.email}</h2>
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
                <label className="mb-1 block text-xs text-muted">Body (HTML)</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`${inputClass} flex-1 font-mono`}
                />
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-border bg-surface/40 p-4">
              <p className="mb-2 text-xs font-medium text-muted">Preview</p>
              <p className="mb-3 text-sm font-semibold">{render(subject)}</p>
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
