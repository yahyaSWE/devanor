const labels: Record<string, string> = {
  SUPER_FLOATING: "Super Floating",
  NODE_LOCKED: "Node-Locked",
};

export function LockTypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  return (
    <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
      {labels[type] ?? type}
    </span>
  );
}
