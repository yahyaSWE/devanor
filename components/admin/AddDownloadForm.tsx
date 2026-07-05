"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addDownload, type ActionState } from "@/lib/actions/admin-content";
import { uploadFileToStorage } from "@/lib/upload-client";
import { Button } from "@/components/Button";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export function AddDownloadForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(addDownload, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = (form.elements.namedItem("file") as HTMLInputElement)?.files?.[0];
    fd.delete("file");
    if (!file) {
      setErr("Choose a file to upload.");
      return;
    }
    setBusy(true);
    try {
      const meta = await uploadFileToStorage(file);
      fd.set("storedName", meta.storedName);
      fd.set("fileName", meta.fileName);
      fd.set("mimeType", meta.mimeType);
      fd.set("size", String(meta.size));
      formAction(fd);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted">Title *</label>
        <input name="title" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <input name="description" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Category</label>
        <input
          name="category"
          placeholder="e.g. License, Script, Document"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">File * (up to 25 MB)</label>
        <input
          name="file"
          type="file"
          required
          className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Visible to</label>
        <select name="clientId" className={inputClass}>
          <option value="">All customers</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} only
            </option>
          ))}
        </select>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-accent">File uploaded.</p>}

      <Button type="submit" disabled={busy || pending} className="w-full">
        {busy ? "Uploading…" : pending ? "Saving…" : "Upload file"}
      </Button>
    </form>
  );
}
