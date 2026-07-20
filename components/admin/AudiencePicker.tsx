"use client";

import { useMemo, useState } from "react";

export type AudienceCompany = {
  id: string;
  name: string;
  users: { id: string; label: string }[];
};

/**
 * Picks who sees a document/tutorial: any number of companies and/or single
 * employees (union). Nothing checked = visible to all customers.
 *
 * Selections are kept in state and mirrored into hidden inputs, so filtering the
 * list with the search box never drops a checked item from the submitted form.
 */
export function AudiencePicker({
  companies,
  defaultClientIds = [],
  defaultUserIds = [],
}: {
  companies: AudienceCompany[];
  defaultClientIds?: string[];
  defaultUserIds?: string[];
}) {
  const [search, setSearch] = useState("");
  const [clientIds, setClientIds] = useState<Set<string>>(
    () => new Set(defaultClientIds),
  );
  const [userIds, setUserIds] = useState<Set<string>>(
    () => new Set(defaultUserIds),
  );

  const toggle = (
    set: Set<string>,
    setter: (s: Set<string>) => void,
    id: string,
  ) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies
      .map((c) => {
        const companyMatches = c.name.toLowerCase().includes(q);
        const users = companyMatches
          ? c.users
          : c.users.filter((u) => u.label.toLowerCase().includes(q));
        return companyMatches || users.length > 0 ? { ...c, users } : null;
      })
      .filter((c): c is AudienceCompany => c !== null);
  }, [companies, search]);

  const everyone = clientIds.size === 0 && userIds.size === 0;

  return (
    <div>
      <label className="mb-1 block text-xs text-muted">Visible to</label>

      {/* Selections travel with the form even when filtered out of view. */}
      {[...clientIds].map((id) => (
        <input key={id} type="hidden" name="clientIds" value={id} />
      ))}
      {[...userIds].map((id) => (
        <input key={id} type="hidden" name="userIds" value={id} />
      ))}

      <p className="mb-2 text-xs text-muted">
        {everyone
          ? "Nothing selected — visible to all customers."
          : `${clientIds.size} compan${clientIds.size === 1 ? "y" : "ies"} · ${userIds.size} employee${userIds.size === 1 ? "" : "s"}`}
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search company or employee…"
        className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
      />

      <div className="max-h-56 space-y-3 overflow-y-auto rounded-lg border border-border bg-background p-3">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted">No matches.</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id}>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={clientIds.has(c.id)}
                  onChange={() => toggle(clientIds, setClientIds, c.id)}
                />
                {c.name}
                <span className="text-xs font-normal text-muted">
                  (whole company)
                </span>
              </label>
              {c.users.length > 0 && (
                <div className="mt-1 space-y-1 pl-6">
                  {c.users.map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center gap-2 text-sm text-muted"
                    >
                      <input
                        type="checkbox"
                        checked={userIds.has(u.id)}
                        onChange={() => toggle(userIds, setUserIds, u.id)}
                        disabled={clientIds.has(c.id)}
                      />
                      <span className={clientIds.has(c.id) ? "opacity-40" : ""}>
                        {u.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {(clientIds.size > 0 || userIds.size > 0) && (
        <button
          type="button"
          onClick={() => {
            setClientIds(new Set());
            setUserIds(new Set());
          }}
          className="mt-2 text-xs text-muted underline transition-colors hover:text-foreground"
        >
          Clear — show to all customers
        </button>
      )}
    </div>
  );
}
