"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  toggleClientActive,
  toggleClientVisibility,
  deleteClient,
  bulkSetClientActive,
  bulkSetClientVisibility,
  bulkDeleteClients,
} from "@/lib/actions/admin";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export type CompanyRow = {
  id: string;
  name: string;
  logoUrl: string;
  active: boolean;
  showOnSite: boolean;
  employeeCount: number;
  employeeNames: string[];
};

type FilterKey = "active" | "inactive" | "hidden" | "shown";

function FilterChip({
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
          : "border-border text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function CompaniesManager({ clients }: { clients: CompanyRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [bulkTyped, setBulkTyped] = useState("");
  const [pending, startTransition] = useTransition();

  const toggleFilter = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const wantActive = filters.has("active");
    const wantInactive = filters.has("inactive");
    const wantHidden = filters.has("hidden");
    const wantShown = filters.has("shown");

    return clients.filter((c) => {
      // Active/Inactive dimension (OR within, skip if none selected)
      if (wantActive || wantInactive) {
        if (!((wantActive && c.active) || (wantInactive && !c.active))) return false;
      }
      // Visibility dimension
      if (wantHidden || wantShown) {
        if (!((wantHidden && !c.showOnSite) || (wantShown && c.showOnSite)))
          return false;
      }
      // Search: company name or any employee name
      if (q) {
        const inName = c.name.toLowerCase().includes(q);
        const inEmp = c.employeeNames.some((n) => n.toLowerCase().includes(q));
        if (!inName && !inEmp) return false;
      }
      return true;
    });
  }, [clients, search, filters]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  const toggleSelectAll = () =>
    setSelected(() => {
      if (allFilteredSelected) return new Set();
      return new Set(filtered.map((c) => c.id));
    });

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const ids = () => Array.from(selected);
  const runBulk = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      setSelected(new Set());
      router.refresh();
    });

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or person…"
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent/60"
        />
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={filters.has("active")}
            label="Active"
            onClick={() => toggleFilter("active")}
          />
          <FilterChip
            active={filters.has("inactive")}
            label="Inactive"
            onClick={() => toggleFilter("inactive")}
          />
          <FilterChip
            active={filters.has("shown")}
            label="Shown on site"
            onClick={() => toggleFilter("shown")}
          />
          <FilterChip
            active={filters.has("hidden")}
            label="Hidden from site"
            onClick={() => toggleFilter("hidden")}
          />
          {(filters.size > 0 || search) && (
            <button
              type="button"
              onClick={() => {
                setFilters(new Set());
                setSearch("");
              }}
              className="text-xs text-muted underline hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm">
          <span className="text-muted">{selected.size} selected</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => runBulk(() => bulkSetClientVisibility(ids(), false))}
            className="text-muted transition-colors hover:text-foreground"
          >
            Hide
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => runBulk(() => bulkSetClientActive(ids(), false))}
            className="text-muted transition-colors hover:text-foreground"
          >
            Deactivate
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirmBulkDelete(true)}
            className="text-muted transition-colors hover:text-red-400"
          >
            Remove
          </button>
        </div>
      )}

      {/* List */}
      {clients.length === 0 ? (
        <p className="text-sm text-muted">No companies yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">No companies match your filters.</p>
      ) : (
        <>
          <label className="mb-2 flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
            />
            Select all ({filtered.length})
          </label>
          <ul className="max-h-[480px] divide-y divide-border overflow-y-auto pr-1">
            {filtered.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggleOne(c.id)}
                />
                <div className="grid h-12 w-20 shrink-0 place-items-center rounded-lg border border-border bg-background p-2">
                  <Image
                    src={c.logoUrl}
                    alt={c.name}
                    width={80}
                    height={40}
                    className="max-h-8 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{c.name}</p>
                    {!c.active && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                        Inactive
                      </span>
                    )}
                    {!c.showOnSite && (
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                        Hidden from site
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted">
                    {c.employeeCount} employee{c.employeeCount === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="shrink-0 text-sm text-accent hover:underline"
                >
                  Manage
                </Link>
                <form action={toggleClientVisibility}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    title={
                      c.showOnSite
                        ? "Hide this company's logo from the public website"
                        : "Show this company's logo on the public website"
                    }
                    className="shrink-0 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {c.showOnSite ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={toggleClientActive}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    title={
                      c.active
                        ? "Deactivate — blocks portal sign-in for this company's employees (its logo stays visible on the site)"
                        : "Activate — let this company's employees sign in to the portal again"
                    }
                    className="shrink-0 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {c.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <ConfirmSubmit
                  action={deleteClient}
                  hidden={{ id: c.id }}
                  trigger="Remove"
                  confirmLabel="Delete company"
                  requireText="DELETE"
                  title="Delete company?"
                  message={`This permanently removes "${c.name}"${
                    c.employeeCount > 0
                      ? ` and its ${c.employeeCount} employee login${
                          c.employeeCount === 1 ? "" : "s"
                        }`
                      : ""
                  }. This cannot be undone.`}
                  triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Bulk delete confirmation — requires typing DELETE */}
      {confirmBulkDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setConfirmBulkDelete(false);
              setBulkTyped("");
            }}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">
              Delete {selected.size} compan{selected.size === 1 ? "y" : "ies"}?
            </h3>
            <p className="mt-2 text-sm text-muted">
              This permanently removes {selected.size} compan
              {selected.size === 1 ? "y" : "ies"} and all their employee logins.
              This cannot be undone.
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-xs text-muted">
                Type{" "}
                <span className="font-semibold text-foreground">DELETE</span> to
                confirm
              </label>
              <input
                autoFocus
                value={bulkTyped}
                onChange={(e) => setBulkTyped(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500/60"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmBulkDelete(false);
                  setBulkTyped("");
                }}
                className="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-white/30"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending || bulkTyped !== "DELETE"}
                onClick={() => {
                  setConfirmBulkDelete(false);
                  setBulkTyped("");
                  runBulk(() => bulkDeleteClients(ids()));
                }}
                className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-500/90"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
