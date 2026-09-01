"use client";

import { useEffect, useState } from "react";

/**
 * Module(s) cell for the portal licenses table. Shows the first module name and,
 * when a license bundles several, a "+N more" chip (matching the download-button
 * accent) that opens a popup listing every module. Keeps the per-row NEW badge.
 */
export function LicenseModulesCell({
  modules,
  isNew,
  className = "",
}: {
  modules: string[];
  isNew: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const first = modules[0] ?? "—";
  const extra = modules.length - 1;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span>{first}</span>
      {extra > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent transition-all hover:brightness-110"
        >
          +{extra} more
        </button>
      )}
      {isNew && (
        <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
          NEW
        </span>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Modules ({modules.length})</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <ul className="divide-y divide-border text-sm">
              {modules.map((m, i) => (
                <li key={`${m}-${i}`} className="py-2">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
