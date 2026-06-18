import { ReactNode } from "react";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  index?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent ${
            center ? "justify-center" : ""
          }`}
        >
          {index && (
            <span className="font-mono text-xs text-muted">{index}</span>
          )}
          {index && <span className="h-px w-8 bg-accent/40" />}
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}
