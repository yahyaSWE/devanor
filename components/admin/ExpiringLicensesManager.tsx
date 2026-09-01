"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ContractTypeBadge } from "@/components/ContractTypeBadge";
import { LicenseStatusBadge } from "@/components/LicenseStatusBadge";
import { LicenseModulesCell } from "@/components/portal/LicenseModulesCell";

export type ExpiringRow = {
  id: string;
  companyId: string;
  companyName: string;
  moduleNames: string[];
  contractType: string; // PERPETUAL | SUBSCRIPTION | MAINTENANCE
  dateLabel: string;
  kind: "expired" | "expiring" | "reminder" | "trial";
  active: boolean;
  status: string;
};

type FilterKey =
  | "MAINTENANCE"
  | "SUBSCRIPTION"
  | "PERPETUAL"
  | "expired"
  | "expiring"
  | "reminder"
  | "TRIAL";

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-border text-muted hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

const kindStyles: Record<ExpiringRow["kind"], string> = {
  expired: "border-red-500/30 bg-red-500/10 text-red-400",
  expiring: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  reminder: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  trial: "border-accent/40 bg-accent/10 text-accent",
};

export function ExpiringLicensesManager({ rows }: { rows: ExpiringRow[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());

  const toggle = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const contractFilters = ["MAINTENANCE", "SUBSCRIPTION", "PERPETUAL"] as const;
  const statusFilters = ["expired", "expiring", "reminder"] as const;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const wantContract = contractFilters.filter((c) => filters.has(c));
    const wantStatus = statusFilters.filter((s) => filters.has(s));
    const wantTrial = filters.has("TRIAL");
    return rows.filter((r) => {
      if (wantContract.length && !wantContract.includes(r.contractType as never))
        return false;
      if (wantStatus.length && !wantStatus.includes(r.kind as never))
        return false;
      if (wantTrial && r.status !== "TRIAL") return false;
      if (q) {
        if (
          !r.companyName.toLowerCase().includes(q) &&
          !r.moduleNames.join(" ").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, filters]);

  return (
    <div>
      <div className="mb-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or module…"
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent/60"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={filters.has("expired")} label="Expired" onClick={() => toggle("expired")} />
          <Chip active={filters.has("expiring")} label="Expiring" onClick={() => toggle("expiring")} />
          <Chip active={filters.has("reminder")} label="Reminder" onClick={() => toggle("reminder")} />
          <Chip active={filters.has("TRIAL")} label="Trial" onClick={() => toggle("TRIAL")} />
          <span className="mx-1 h-4 w-px bg-border" />
          <Chip active={filters.has("MAINTENANCE")} label="Maintenance" onClick={() => toggle("MAINTENANCE")} />
          <Chip active={filters.has("SUBSCRIPTION")} label="Subscription" onClick={() => toggle("SUBSCRIPTION")} />
          <Chip active={filters.has("PERPETUAL")} label="Perpetual" onClick={() => toggle("PERPETUAL")} />
          {(filters.size > 0 || search) && (
            <button
              type="button"
              onClick={() => {
                setFilters(new Set());
                setSearch("");
              }}
              className="text-xs text-muted underline transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted">
          No licenses are expiring or need a reminder.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">No licenses match your filters.</p>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((r) => (
            <li key={r.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{r.companyName}</p>
                  <ContractTypeBadge type={r.contractType} />
                  {r.kind !== "trial" && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${kindStyles[r.kind]}`}
                    >
                      {r.kind}
                    </span>
                  )}
                  {r.status === "TRIAL" && <LicenseStatusBadge status="TRIAL" />}
                  {!r.active && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                      Deactivated
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1 text-sm text-muted">
                  <LicenseModulesCell modules={r.moduleNames} isNew={false} />
                  <span>
                    ·{" "}
                    {r.kind === "reminder"
                      ? `reminder ${r.dateLabel}`
                      : r.kind === "trial" && r.dateLabel === "—"
                        ? "trial period"
                        : `expires ${r.dateLabel}`}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/clients/${r.companyId}#licenses`}
                className="shrink-0 text-sm text-accent transition-all hover:brightness-125 hover:underline"
              >
                Manage →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
