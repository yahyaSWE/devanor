"use client";

import { useState } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  trigger: string;
  title: string;
  message: string;
  confirmLabel?: string;
  triggerClassName?: string;
  /**
   * When set, the user must type this exact word (e.g. "DELETE") into an input
   * before the confirm button is enabled — an extra guard for destructive actions.
   */
  requireText?: string;
};

/**
 * A destructive form submit guarded by an "are you sure?" modal.
 * The server action is passed in and submitted only after confirmation.
 */
export function ConfirmSubmit({
  action,
  hidden = {},
  trigger,
  title,
  message,
  confirmLabel = "Delete",
  triggerClassName,
  requireText,
}: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const close = () => {
    setOpen(false);
    setTyped("");
  };

  const confirmed = !requireText || typed === requireText;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName ?? "text-sm text-muted hover:text-red-400"}
      >
        {trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{message}</p>

            {requireText && (
              <div className="mt-4">
                <label className="mb-1 block text-xs text-muted">
                  Type <span className="font-semibold text-foreground">{requireText}</span> to confirm
                </label>
                <input
                  autoFocus
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder={requireText}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500/60"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-white/30"
              >
                Cancel
              </button>
              <form action={action}>
                {Object.entries(hidden).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
                <button
                  type="submit"
                  disabled={!confirmed}
                  className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-500/90"
                >
                  {confirmLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
