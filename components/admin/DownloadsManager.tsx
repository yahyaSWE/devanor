"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleDownloadActive,
  deleteDownload,
  bulkSetDownloadsActive,
  bulkDeleteDownloads,
} from "@/lib/actions/admin-content";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { AddDownloadForm, type DownloadFormData } from "./AddDownloadForm";
import type { AudienceCompany } from "./AudiencePicker";
import { BulkContentActions } from "./BulkContentActions";

export type AdminDownloadRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  fileName: string;
  sizeLabel: string;
  clientIds: string[];
  userIds: string[];
  audience: string;
  active: boolean;
  /** PDFs, images and Word documents can be shown inline. */
  previewable: boolean;
  isImage: boolean;
};

type FilterKey = "active" | "inactive";

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
          : "border-border text-muted hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function DownloadsManager({
  downloads,
  companies,
}: {
  downloads: AdminDownloadRow[];
  companies: AudienceCompany[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [preview, setPreview] = useState<AdminDownloadRow | null>(null);
  const [editing, setEditing] = useState<AdminDownloadRow | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    const company = companies.find((item) => item.id === companyId);
    const companyUserIds = new Set(company?.users.map((user) => user.id) ?? []);
    return downloads.filter((d) => {
      if (company) {
        const global = d.clientIds.length === 0 && d.userIds.length === 0;
        const forCompany = d.clientIds.includes(company.id);
        const forEmployee = d.userIds.some((id) => companyUserIds.has(id));
        if (!global && !forCompany && !forEmployee) return false;
      }
      if (wantActive || wantInactive) {
        if (!((wantActive && d.active) || (wantInactive && !d.active)))
          return false;
      }
      if (q) {
        const cat = d.category ?? "";
        if (
          !d.title.toLowerCase().includes(q) &&
          !d.audience.toLowerCase().includes(q) &&
          !cat.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [downloads, companies, companyId, search, filters]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const toggleSelectAll = () =>
    setSelected(
      allFilteredSelected
        ? new Set()
        : new Set(filtered.map((item) => item.id)),
    );
  const toggleOne = (id: string) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const selectedIds = () => Array.from(selected);

  // Close modals on Escape.
  useEffect(() => {
    if (!preview && !editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreview(null);
        setEditing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, editing]);

  const actionClass =
    "shrink-0 text-sm text-muted transition-colors hover:text-foreground";

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, category or company…"
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent/60"
          />
          <select
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            aria-label="Filter downloads by company"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
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
          {(filters.size > 0 || search || companyId) && (
            <button
              type="button"
              onClick={() => {
                setFilters(new Set());
                setSearch("");
                setCompanyId("");
              }}
              className="text-xs text-muted underline transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <BulkContentActions
        selectedCount={selected.size}
        itemName="document"
        onSetActive={(active) => bulkSetDownloadsActive(selectedIds(), active)}
        onRemove={() => bulkDeleteDownloads(selectedIds())}
        onDone={() => {
          setSelected(new Set());
          router.refresh();
        }}
      />

      {/* List */}
      {downloads.length === 0 ? (
        <p className="text-sm text-muted">No files yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">No files match your filters.</p>
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
          {filtered.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={selected.has(d.id)}
                onChange={() => toggleOne(d.id)}
                aria-label={`Select ${d.title}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{d.title}</p>
                  {d.category && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                      {d.category}
                    </span>
                  )}
                  {!d.active && (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted">
                  {d.fileName} · {d.sizeLabel} · {d.audience}
                </p>
              </div>

              {d.previewable ? (
                <button
                  type="button"
                  onClick={() => setPreview(d)}
                  className="shrink-0 text-sm text-accent hover:underline"
                >
                  Preview
                </button>
              ) : (
                <a
                  href={`/api/downloads/${d.id}`}
                  className="shrink-0 text-sm text-accent hover:underline"
                >
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={() => setEditing(d)}
                className={actionClass}
              >
                Edit
              </button>
              <ConfirmSubmit
                action={toggleDownloadActive}
                hidden={{ id: d.id }}
                tone="primary"
                trigger={d.active ? "Deactivate" : "Activate"}
                confirmLabel={d.active ? "Deactivate" : "Activate"}
                title={d.active ? "Deactivate document?" : "Activate document?"}
                message={
                  d.active
                    ? `“${d.title}” will be hidden from customers in the portal.`
                    : `“${d.title}” will be available to customers again.`
                }
                triggerTitle={
                  d.active
                    ? "Deactivate — hides this document from customers in the portal"
                    : "Activate — show this document to customers again"
                }
                triggerClassName={actionClass}
              />
              <ConfirmSubmit
                action={deleteDownload}
                hidden={{ id: d.id }}
                trigger="Remove"
                confirmLabel="Delete file"
                requireText="DELETE"
                title="Delete file?"
                message={`This permanently removes “${d.title}”. This cannot be undone.`}
                triggerClassName="shrink-0 text-sm text-muted transition-colors hover:text-red-400"
              />
            </li>
          ))}
          </ul>
        </>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          />
          <div className="relative z-10 flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between gap-3 p-4">
              <h2 className="truncate font-semibold">{preview.title}</h2>
              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="grid flex-1 place-items-center overflow-auto bg-black/40">
              {preview.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/downloads/${preview.id}?inline=1`}
                  alt={preview.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <iframe
                  src={`/api/downloads/${preview.id}?inline=1`}
                  title={preview.title}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Edit document</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <AddDownloadForm
              companies={companies}
              download={
                {
                  id: editing.id,
                  title: editing.title,
                  description: editing.description,
                  category: editing.category,
                  clientIds: editing.clientIds,
                  userIds: editing.userIds,
                } satisfies DownloadFormData
              }
              onSuccess={() => {
                setEditing(null);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
