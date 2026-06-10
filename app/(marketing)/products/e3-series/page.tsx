import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { e3Modules, e3Tutorials } from "@/lib/site";

export const metadata: Metadata = {
  title: "E3 Series",
  description:
    "E3.Series modular platform: Schematic & Cable, Topology, Formboard and Panel.",
};

export default function E3SeriesPage() {
  return (
    <>
      <Section className="pt-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Products / E3 Series
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            One platform for electrical, wiring &amp; fluid design
          </h1>
          <p className="mt-5 text-lg text-muted">
            E3.Series is a modular, object-oriented platform. Each module shares a
            single consistent data model, so changes stay in sync from schematic to
            manufacturing — with automated checks and full MCAD integration.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book-demo">Book a Demo</ButtonLink>
            <ButtonLink href="#tutorials" variant="outline">
              E3 Tutorials
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {e3Modules.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="card h-full p-6">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h2 className="mt-3 text-lg font-semibold">{m.name}</h2>
                <p className="mt-2 text-sm text-muted">{m.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* E3 Tutorials */}
      <Section id="tutorials" className="border-t border-border">
        <SectionHeading
          eyebrow="E3 Tutorials"
          title="Learn E3.Series, step by step"
          subtitle="Guided tutorials from first project to advanced automation. More are added regularly."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {e3Tutorials.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <div className="card flex h-full items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted">{t.description}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {t.level}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
