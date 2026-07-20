"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  addDownload,
  updateDownload,
  type ActionState,
} from "@/lib/actions/admin-content";
import { uploadFileToStorage } from "@/lib/upload-client";
import { Button } from "@/components/Button";
import { AudiencePicker, type AudienceCompany } from "./AudiencePicker";

const initial: ActionState = {};
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export type DownloadFormData = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  clientIds: string[];
  userIds: string[];
};

export function AddDownloadForm({
  companies,
  download,
  onSuccess,
}: {
  companies: AudienceCompany[];
  download?: DownloadFormData;
  onSuccess?: () => void;
}) {
  const isEdit = !!download;
  const [state, formAction, pending] = useActionState(
    isEdit ? updateDownload : addDownload,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      if (!isEdit) formRef.current?.reset();
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Editing only changes metadata — the stored file stays as it is.
    if (isEdit) {
      formAction(fd);
      return;
    }

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
      {isEdit && <input type="hidden" name="id" value={download!.id} />}
      <div>
        <label className="mb-1 block text-xs text-muted">Title *</label>
        <input
          name="title"
          required
          defaultValue={download?.title ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <input
          name="description"
          defaultValue={download?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Category</label>
        <input
          name="category"
          defaultValue={download?.category ?? ""}
          placeholder="e.g. License, Script, Document"
          className={inputClass}
        />
      </div>
      {!isEdit && (
        <div>
          <label className="mb-1 block text-xs text-muted">
            File * (up to 25 MB)
          </label>
          <input
            name="file"
            type="file"
            required
            className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground"
          />
        </div>
      )}
      <AudiencePicker
        companies={companies}
        defaultClientIds={download?.clientIds}
        defaultUserIds={download?.userIds}
      />

      {err && <p className="text-sm text-red-400">{err}</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && !isEdit && <p className="text-sm text-accent">File uploaded.</p>}

      <Button type="submit" disabled={busy || pending} className="w-full">
        {busy
          ? "Uploading…"
          : pending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Upload file"}
      </Button>
    </form>
  );
}
