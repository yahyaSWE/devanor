// Temporary placeholder for images Johan will upload. Clearly marked "TEST" so
// it's obvious a real image goes here. Swap for <Image> once the asset exists
// under /public.
export function ImagePlaceholder({
  label = "Image coming soon",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-accent/50 bg-gradient-to-br from-surface to-surface-2 ${
        className ?? "aspect-video w-full"
      }`}
    >
      {/* faint grid pattern to read as an image area */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        {/* image icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/70"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 16l-5-5L5 20" />
        </svg>
        <span className="rounded-full border-2 border-accent/50 bg-accent/10 px-5 py-1.5 text-2xl font-extrabold tracking-[0.35em] text-accent">
          TEST
        </span>
        <span className="max-w-xs text-xs text-muted">{label}</span>
      </div>
    </div>
  );
}
