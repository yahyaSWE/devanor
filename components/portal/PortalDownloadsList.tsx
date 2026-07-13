"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { markItemsRead } from "@/lib/actions/portal";

export type DownloadRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  fileName: string;
  sizeLabel: string;
  dateLabel: string;
  isNew: boolean;
};

type FilterKey = "new" | "read";

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

export function PortalDownloadsList({ downloads }: { downloads: DownloadRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [read, setRead] = useState<Set<string>>(new Set());

  const toggleFilter = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const isNew = (d: DownloadRow) => d.isNew && !read.has(d.id);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const wantNew = filters.has("new");
    const wantRead = filters.has("read");
    return downloads.filter((d) => {
      if (wantNew || wantRead) {
        const n = isNew(d);
        if (!((wantNew && n) || (wantRead && !n))) return false;
      }
      if (q) {
        const cat = d.category ?? "";
        if (
          !d.title.toLowerCase().includes(q) &&
          !cat.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloads, search, filters, read]);

  const onDownload = (id: string) => {
    setRead((prev) => new Set(prev).add(id));
    markItemsRead("DOWNLOAD", [id]).then(() => router.refresh());
    // Content-Disposition: attachment → downloads without leaving the page.
    window.location.assign(`/api/downloads/${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="space-y-3 rounded-2xl border border-border bg-surface/40 p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent/60"
        />
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={filters.has("new")}
            label="New"
            onClick={() => toggleFilter("new")}
          />
          <FilterChip
            active={filters.has("read")}
            label="Read"
            onClick={() => toggleFilter("read")}
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

      {downloads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
          No files are available to you yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center text-sm text-muted">
          No files match your search.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/40 p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{d.title}</p>
                  {d.category && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                      {d.category}
                    </span>
                  )}
                  {isNew(d) && (
                    <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                      NEW
                    </span>
                  )}
                </div>
                {d.description && (
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                )}
                <p className="mt-1 text-xs text-muted">
                  {d.fileName} · {d.sizeLabel} · {d.dateLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDownload(d.id)}
                className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-110"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
