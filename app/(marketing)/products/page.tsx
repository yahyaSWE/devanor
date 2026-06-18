import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { products } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "E3.series — a complete modular platform for electrical engineering.",
};

export default function ProductsPage() {
  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <SectionHeading
          eyebrow="Products"
          title="E3.series — a complete modular platform for electrical engineering"
          subtitle="Design complex electrical systems with integrated wiring, fluid engineering, MCAD connectivity and automated design checks."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                href={`/products/${p.slug}`}
                className="card group flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
                <span className="mt-4 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
