import Image from "next/image";

// Real uploaded asset from /public. Same API (label/className) as ImagePlaceholder
// so swapping one for the other is a drop-in change.
export function AssetImage({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border ${
        className ?? "aspect-video w-full"
      }`}
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}
