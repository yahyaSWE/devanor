"use client";

import { useEffect, useState } from "react";
import { LicenseForm } from "./LicenseForm";
import { deleteLicense } from "@/lib/actions/admin-content";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { ContractTypeBadge } from "@/components/ContractTypeBadge";
import { LockTypeBadge } from "@/components/LockTypeBadge";
import { LicenseStatusBadge } from "@/components/LicenseStatusBadge";

export type LicenseRowData = {
  id: string;
  moduleNames: string[];
  moduleIds: string[];
  contractType: string;
  lockType: string | null;
  version: string | null;
  macIds: string[];
  seats: number | null;
  status: string;
  permanent: boolean;
  expiresAt: string | null; // yyyy-mm-dd, for the edit form
  expiresLabel: string; // display
  hasKey: boolean;
};

export function LicenseRow({
  license,
  clientId,
  modules,
}: {
  license: LicenseRowData;
  clientId: string;
  modules: { id: string; name: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const isMaintenance = license.contractType === "MAINTENANCE";

  // Close the edit modal on Escape.
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  return (
    <li className="py-3">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">
              {license.moduleNames.join(", ") || "—"}
            </p>
            <ContractTypeBadge type={license.contractType} />
            <LockTypeBadge type={license.lockType} />
            <LicenseStatusBadge status={license.status} />
          </div>
          <p className="truncate text-sm text-muted">
            {license.seats ? `${license.seats} seats · ` : ""}
            {license.version ? `v${license.version} · ` : ""}
            {license.permanent
              ? "permanent"
              : `expires ${license.expiresLabel}`}
            {license.macIds.length ? ` · MAC: ${license.macIds.join(", ")}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          Edit
        </button>
        <ConfirmSubmit
          action={deleteLicense}
          hidden={{ id: license.id }}
          trigger="Remove"
          confirmLabel="Delete license"
          requireText="DELETE"
          title="Delete license?"
          message="Are you sure you want to delete this license? This cannot be undone."
          triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
        />
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                {isMaintenance ? "Edit maintenance" : "Edit license"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <LicenseForm
              clientId={clientId}
              modules={modules}
              license={{
                id: license.id,
                moduleIds: license.moduleIds,
                contractType: license.contractType,
                lockType: license.lockType,
                version: license.version,
                macIds: license.macIds,
                seats: license.seats,
                status: license.status,
                permanent: license.permanent,
                expiresAt: license.expiresAt,
                hasKey: license.hasKey,
              }}
              onDone={() => setEditing(false)}
            />
          </div>
        </div>
      )}
    </li>
  );
}
