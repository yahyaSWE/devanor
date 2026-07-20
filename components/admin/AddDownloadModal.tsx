"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddDownloadForm } from "./AddDownloadForm";
import type { AudienceCompany } from "./AudiencePicker";
import { Button } from "@/components/Button";

export function AddDownloadModal({
  companies,
}: {
  companies: AudienceCompany[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add a download
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Add a download</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-muted">
              Files are private and only served to signed-in users with access.
            </p>
            <AddDownloadForm
              companies={companies}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
