import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { e3Modules } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description: "E3.Series — the modular platform for electrical and mechanical design.",
};

export default function ProductsPage() {
  return (
    <>
      <Section className="pt-28">
        <SectionHeading
          eyebrow="Products"
          title="Our products"
          subtitle="We currently offer the E3 Series platform, with more products to come."
        />

        <div className="mt-12 grid gap-6">
          <Reveal>
            <article className="rounded-3xl border border-border bg-surface/40 p-8 sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Flagship
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold">E3 Series</h2>
                  <p className="mt-3 text-muted">
                    A modular platform for designing electrical, wiring and fluid
                    systems — with seamless MCAD integration, automated electrical
                    inspections and bidirectional ECAD/MCAD workflows.
                  </p>
                </div>
                <ButtonLink href="/products/e3-series">Learn more</ButtonLink>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {e3Modules.map((m) => (
                  <div
                    key={m.name}
                    className="rounded-xl border border-border bg-background/40 p-4"
                  >
                    <h3 className="text-sm font-semibold">{m.name}</h3>
                    <p className="mt-1 text-sm text-muted">{m.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
