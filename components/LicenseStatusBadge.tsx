const styles: Record<string, string> = {
  ACTIVE: "border-green-500/30 bg-green-500/10 text-green-400",
  TRIAL: "border-accent/40 bg-accent/10 text-accent",
  EXPIRED: "border-red-500/30 bg-red-500/10 text-red-400",
};

export function LicenseStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[status] ?? "border-border text-muted"
      }`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
