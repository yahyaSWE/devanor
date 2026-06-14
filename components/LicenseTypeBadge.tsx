const styles: Record<string, string> = {
  LICENSE: "border-accent/40 bg-accent/10 text-accent",
  MAINTENANCE: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

export function LicenseTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[type] ?? "border-border text-muted"
      }`}
    >
      {type === "MAINTENANCE" ? "Maintenance" : "License"}
    </span>
  );
}
