import Link from "next/link";
import { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:brightness-110 hover:shadow-[0_0_30px_-5px_var(--color-accent)]",
  outline:
    "border border-white/15 text-foreground hover:border-accent/60 hover:text-accent",
  ghost: "text-muted hover:text-foreground",
};

function classes(variant: Variant, className?: string) {
  return `${base} ${variants[variant]} ${className ?? ""}`;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return <Link className={classes(variant, className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & ComponentProps<"button">) {
  return <button className={classes(variant, className)} {...props} />;
}
