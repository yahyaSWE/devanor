"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  assignLicense,
  updateLicense,
  type ActionState,
} from "@/lib/actions/admin-content";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60 disabled:opacity-40";

export type LicenseFormData = {
  id: string;
  moduleIds: string[];
  contractType: string;
  lockType: string | null;
  version: string | null;
  macIds: string[];
  seats: number | null;
  status: string;
  permanent: boolean;
  expiresAt: string | null; // yyyy-mm-dd
  hasKey: boolean;
};

export function LicenseForm({
  clientId,
  modules,
  license,
  onDone,
}: {
  clientId: string;
  modules: { id: string; name: string }[];
  license?: LicenseFormData;
  onDone?: () => void;
}) {
  const isEdit = !!license;
  const action = isEdit ? updateLicense : assignLicense;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [contractType, setContractType] = useState(
    license?.contractType ?? "PERPETUAL",
  );
  const [permanent, setPermanent] = useState(license?.permanent ?? false);
  const [macs, setMacs] = useState<string[]>([...(license?.macIds ?? []), ""]);

  const isMaint = contractType === "MAINTENANCE";

  useEffect(() => {
    if (state.ok) {
      if (isEdit) onDone?.();
      else formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => thisYear + 2 - i);

  const setMac = (i: number, value: string) => {
    setMacs((prev) => {
      const next = [...prev];
      next[i] = value;
      // Ensure a trailing empty box so more can be added.
      if (i === next.length - 1 && value.trim() !== "") next.push("");
      return next;
    });
  };

  if (modules.length === 0) {
    return (
      <p className="text-sm text-muted">
        No license modules yet. Create them in the Licenses tab first.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="clientId" value={clientId} />
      {isEdit && <input type="hidden" name="id" value={license!.id} />}

      {/* Modules — one or more */}
      <div>
        <label className="mb-1 block text-xs text-muted">Modules *</label>
        <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-border bg-background p-2">
          {modules.map((m) => (
            <label key={m.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="moduleId"
                value={m.id}
                defaultChecked={license?.moduleIds.includes(m.id)}
              />
              {m.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">License Type</label>
          <select
            name="lockType"
            defaultValue={license?.lockType ?? ""}
            disabled={isMaint}
            className={inputClass}
          >
            <option value="">—</option>
            <option value="SUPER_FLOATING">Super Floating</option>
            <option value="NODE_LOCKED">Node-Locked</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Contract Type *</label>
          <select
            name="contractType"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className={inputClass}
          >
            <option value="PERPETUAL">Perpetual License</option>
            <option value="SUBSCRIPTION">Subscription</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* MAC IDs — dynamic */}
      <div>
        <label className="mb-1 block text-xs text-muted">MAC ID</label>
        <div className="space-y-2">
          {macs.map((mac, i) => (
            <input
              key={i}
              name="macId"
              value={mac}
              disabled={isMaint}
              onChange={(e) => setMac(i, e.target.value)}
              placeholder="MAC ID"
              className={inputClass}
            />
          ))}
        </div>
      </div>

      {/* License key upload */}
      <div>
        <label className="mb-1 block text-xs text-muted">Upload license key</label>
        <input
          name="keyFile"
          type="file"
          disabled={isMaint}
          className="block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-foreground disabled:opacity-40"
        />
        {isEdit && license!.hasKey && (
          <a
            href={`/api/licenses/${license!.id}/key`}
            className="mt-1 inline-block text-xs text-accent hover:underline"
          >
            Download current key
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Seats</label>
          <input
            name="seats"
            type="number"
            min={1}
            defaultValue={license?.seats ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Status</label>
          <select
            name="status"
            defaultValue={license?.status ?? "ACTIVE"}
            className={inputClass}
          >
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">License version</label>
          <select
            name="version"
            defaultValue={license?.version ?? ""}
            disabled={isMaint}
            className={inputClass}
          >
            <option value="">—</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Renews / expires</label>
          <input
            name="expiresAt"
            type="date"
            defaultValue={license?.expiresAt ?? ""}
            disabled={permanent}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="permanent"
          checked={permanent}
          onChange={(e) => setPermanent(e.target.checked)}
        />
        Permanent license (no expiry date)
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && !isEdit && (
        <p className="text-sm text-accent">License assigned.</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Saving…"
          : isEdit
            ? "Save changes"
            : "Add license"}
      </Button>
    </form>
  );
}
