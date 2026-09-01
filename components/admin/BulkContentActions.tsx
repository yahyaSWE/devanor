"use client";

import { useState, useTransition } from "react";

export function BulkContentActions({
  selectedCount,
  itemName,
  onSetActive,
  onRemove,
  onDone,
}: {
  selectedCount: number;
  itemName: string;
  onSetActive: (active: boolean) => Promise<void>;
  onRemove: () => Promise<void>;
  onDone: () => void;
}) {
  const [activeAction, setActiveAction] = useState<boolean | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, startTransition] = useTransition();

  if (selectedCount === 0) return null;

  const run = (action: () => Promise<void>) =>
    startTransition(async () => {
      await action();
      onDone();
    });

  const plural = selectedCount === 1 ? itemName : `${itemName}s`;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm">
        <span className="text-muted">{selectedCount} selected</span>
        <button type="button" disabled={pending} onClick={() => setActiveAction(true)} className="text-muted hover:text-foreground">Activate</button>
        <button type="button" disabled={pending} onClick={() => setActiveAction(false)} className="text-muted hover:text-foreground">Deactivate</button>
        <button type="button" disabled={pending} onClick={() => setConfirmRemove(true)} className="text-muted hover:text-red-400">Remove</button>
      </div>

      {activeAction !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveAction(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">{activeAction ? "Activate" : "Deactivate"} {selectedCount} {plural}?</h3>
            <p className="mt-2 text-sm text-muted">
              {activeAction
                ? `The selected ${plural} will become visible to customers with access.`
                : `The selected ${plural} will be hidden from customers.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setActiveAction(null)} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/30">Cancel</button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  const value = activeAction;
                  setActiveAction(null);
                  run(() => onSetActive(value));
                }}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:brightness-110 disabled:opacity-40"
              >
                {activeAction ? "Activate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRemove && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setConfirmRemove(false); setTyped(""); }} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Remove {selectedCount} {plural}?</h3>
            <p className="mt-2 text-sm text-muted">This permanently removes the selected {plural}. This cannot be undone.</p>
            <label className="mb-1 mt-4 block text-xs text-muted">Type <span className="font-semibold text-foreground">DELETE</span> to confirm</label>
            <input autoFocus value={typed} onChange={(event) => setTyped(event.target.value)} placeholder="DELETE" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500/60" />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => { setConfirmRemove(false); setTyped(""); }} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/30">Cancel</button>
              <button
                type="button"
                disabled={pending || typed.trim().toLowerCase() !== "delete"}
                onClick={() => {
                  setConfirmRemove(false);
                  setTyped("");
                  run(onRemove);
                }}
                className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
              >Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
