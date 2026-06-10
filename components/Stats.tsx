import { Reveal } from "./Reveal";

export type StatItem = { value: string; label: string };

export function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
      {items.map((s, i) => (
        <div key={s.label} className="bg-surface/60 p-8 backdrop-blur">
          <Reveal delay={i * 0.06}>
            <p className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </Reveal>
        </div>
      ))}
    </div>
  );
}
