// Temporary placeholder for images Johan will upload. Swap for <Image> once
// the asset exists under /public.
export function ImagePlaceholder({
  label = "Image coming soon",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 text-center text-sm text-muted ${
        className ?? "aspect-video w-full"
      }`}
    >
      {label}
    </div>
  );
}
