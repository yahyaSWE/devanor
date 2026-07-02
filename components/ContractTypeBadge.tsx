const styles: Record<string, string> = {
  PERPETUAL: "border-accent/40 bg-accent/10 text-accent",
  SUBSCRIPTION: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  MAINTENANCE: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

const labels: Record<string, string> = {
  PERPETUAL: "Perpetual",
  SUBSCRIPTION: "Subscription",
  MAINTENANCE: "Maintenance",
};

export function ContractTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[type] ?? "border-border text-muted"
      }`}
    >
      {labels[type] ?? type}
    </span>
  );
}
