"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleTutorialActive,
  deleteTutorial,
} from "@/lib/actions/admin-content";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { AddTutorialForm, type TutorialFormData } from "./AddTutorialForm";

export type TutorialRow = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  url: string;
  clientId: string | null;
  clientName: string | null;
  active: boolean;
  isVideo: boolean;
  embedUrl: string | null;
  thumb: string | null;
};

type FilterKey = "active" | "inactive" | "video" | "link";

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

export function TutorialsManager({
  tutorials,
  clients,
}: {
  tutorials: TutorialRow[];
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [preview, setPreview] = useState<TutorialRow | null>(null);
  const [editing, setEditing] = useState<TutorialRow | null>(null);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());

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
    const wantVideo = filters.has("video");
    const wantLink = filters.has("link");

    return tutorials.filter((t) => {
      if (wantActive || wantInactive) {
        if (!((wantActive && t.active) || (wantInactive && !t.active)))
          return false;
      }
      if (wantVideo || wantLink) {
        if (!((wantVideo && t.isVideo) || (wantLink && !t.isVideo)))
          return false;
      }
      if (q) {
        const company = t.clientName ?? "all customers";
        if (
          !t.title.toLowerCase().includes(q) &&
          !company.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tutorials, search, filters]);

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

  const view = (t: TutorialRow) => {
    if (t.isVideo && t.embedUrl) setPreview(t);
    else window.open(t.url, "_blank", "noopener,noreferrer");
  };

  const actionClass = "shrink-0 text-sm text-muted transition-colors hover:text-foreground";

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or company…"
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
            active={filters.has("video")}
            label="Videos"
            onClick={() => toggleFilter("video")}
          />
          <FilterChip
            active={filters.has("link")}
            label="Links"
            onClick={() => toggleFilter("link")}
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

      {/* List */}
      {tutorials.length === 0 ? (
        <p className="text-sm text-muted">No tutorials yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">No tutorials match your filters.</p>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((t) => (
            <li key={t.id} className="flex items-center gap-4 py-3">
              {/* Mini preview poster */}
              <button
                type="button"
                onClick={() => view(t)}
                title={t.isVideo ? "Preview video" : "Open link"}
                className="group relative grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background"
              >
                {t.thumb && !failedThumbs.has(t.id) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.thumb}
                    alt=""
                    onError={() =>
                      setFailedThumbs((prev) => new Set(prev).add(t.id))
                    }
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-wide text-muted">
                    {t.isVideo ? "Video" : "Link"}
                  </span>
                )}
                {t.isVideo && (
                  <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-black">
                      ▶
                    </span>
                  </span>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{t.title}</p>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                    {t.level}
                  </span>
                  {t.isVideo && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                      Video
                    </span>
                  )}
                  {!t.active && (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted">
                  {t.clientName ? t.clientName : "All customers"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => view(t)}
                className="shrink-0 text-sm text-accent hover:underline"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => setEditing(t)}
                className={actionClass}
              >
                Edit
              </button>
              <ConfirmSubmit
                action={toggleTutorialActive}
                hidden={{ id: t.id }}
                tone="primary"
                trigger={t.active ? "Deactivate" : "Activate"}
                confirmLabel={t.active ? "Deactivate" : "Activate"}
                title={t.active ? "Deactivate tutorial?" : "Activate tutorial?"}
                message={
                  t.active
                    ? `“${t.title}” will be hidden from customers in the portal.`
                    : `“${t.title}” will be shown to customers in the portal again.`
                }
                triggerTitle={
                  t.active
                    ? "Deactivate — hides this tutorial from customers in the portal"
                    : "Activate — show this tutorial to customers again"
                }
                triggerClassName={actionClass}
              />
              <ConfirmSubmit
                action={deleteTutorial}
                hidden={{ id: t.id }}
                trigger="Remove"
                confirmLabel="Delete tutorial"
                title="Delete tutorial?"
                message={`This permanently removes "${t.title}". This cannot be undone.`}
                triggerClassName="shrink-0 text-sm text-muted hover:text-red-400"
              />
            </li>
          ))}
        </ul>
      )}

      {/* Preview modal */}
      {preview && preview.embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
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
            <div className="aspect-video w-full bg-black">
              <iframe
                src={preview.embedUrl}
                title={preview.title}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
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
              <h2 className="font-semibold">Edit tutorial</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <AddTutorialForm
              clients={clients}
              tutorial={
                {
                  id: editing.id,
                  title: editing.title,
                  description: editing.description,
                  level: editing.level,
                  url: editing.url,
                  clientId: editing.clientId,
                } satisfies TutorialFormData
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
