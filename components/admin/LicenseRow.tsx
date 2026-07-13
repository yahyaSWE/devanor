"use client";

import { useState } from "react";
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
          onClick={() => setEditing((v) => !v)}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          {editing ? "Close" : "Edit"}
        </button>
        <ConfirmSubmit
          action={deleteLicense}
          hidden={{ id: license.id }}
          trigger="Remove"
          confirmLabel="Delete license"
          title="Delete license?"
          message="Are you sure you want to delete this license? This cannot be undone."
          triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
        />
      </div>

      {editing && (
        <div className="mt-3 rounded-lg border border-border bg-background/40 p-3">
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
      )}
    </li>
  );
}
