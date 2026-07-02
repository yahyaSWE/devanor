"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  updateLicenseModule,
  deleteLicenseModule,
  type ActionState,
} from "@/lib/actions/admin-content";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { Button } from "@/components/Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60";

export type CatalogModule = {
  id: string;
  name: string;
  companies: { id: string; name: string }[];
};

function ModuleRow({
  module,
  selected,
  onSelect,
}: {
  module: CatalogModule;
  selected: boolean;
  onSelect: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateLicenseModule,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    const id = requestAnimationFrame(() => setEditing(false));
    return () => cancelAnimationFrame(id);
  }, [state.ok]);

  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSelect}
          className={`min-w-0 flex-1 truncate text-left font-medium ${
            selected ? "text-accent" : "hover:text-accent"
          }`}
        >
          {module.name}
        </button>
        <span className="shrink-0 text-xs text-muted">
          {module.companies.length} compan
          {module.companies.length === 1 ? "y" : "ies"}
        </span>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="shrink-0 text-sm text-accent hover:underline"
        >
          {editing ? "Close" : "Edit"}
        </button>
        <ConfirmSubmit
          action={deleteLicenseModule}
          hidden={{ id: module.id }}
          trigger="Remove"
          confirmLabel="Delete module"
          title="Delete module?"
          message={`Delete "${module.name}" from the catalog? Existing assignments keep working.`}
          triggerClassName="shrink-0 text-sm text-muted hover:text-red-400"
        />
      </div>
      {editing && (
        <form ref={formRef} action={action} className="mt-2 flex items-center gap-2">
          <input type="hidden" name="id" value={module.id} />
          <input
            name="name"
            defaultValue={module.name}
            required
            className={inputClass}
          />
          <Button type="submit" disabled={pending} variant="outline">
            {pending ? "…" : "Save"}
          </Button>
        </form>
      )}
      {state.error && <p className="mt-1 text-sm text-red-400">{state.error}</p>}
    </li>
  );
}

export function LicenseCatalogManager({
  modules,
}: {
  modules: CatalogModule[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    modules[0]?.id ?? null,
  );
  const selected = modules.find((m) => m.id === selectedId) ?? null;

  if (modules.length === 0) {
    return <p className="text-sm text-muted">No license modules yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Modules ({modules.length})
        </h3>
        <ul className="divide-y divide-border">
          {modules.map((m) => (
            <ModuleRow
              key={m.id}
              module={m}
              selected={m.id === selectedId}
              onSelect={() => setSelectedId(m.id)}
            />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          {selected ? `Companies using ${selected.name}` : "Companies"}
        </h3>
        {!selected || selected.companies.length === 0 ? (
          <p className="text-sm text-muted">
            No companies are using this module yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {selected.companies.map((c) => (
              <li key={c.id} className="py-2">
                <Link
                  href={`/admin/clients/${c.id}#licenses`}
                  className="text-sm text-accent hover:underline"
                >
                  {c.name} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
