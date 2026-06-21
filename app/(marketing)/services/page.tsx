import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { AssetImage } from "@/components/AssetImage";
import { BackButton } from "@/components/BackButton";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Helpdesk support, automation, training and consulting for E3.series teams.",
};

export default function ServicesPage() {
  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <SectionHeading
          eyebrow="Services"
          title="Services that keep your design team moving"
          subtitle="From implementation to optimisation, we partner with your team every step of the way."
        />

        {/* Overall services image — only on this page */}
        <AssetImage
          src="/products/SERVICES.webp"
          label="Devanor services"
          className="mt-10 aspect-[21/9] w-full"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <article className="card h-full p-8">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h2 className="mt-3 text-xl font-semibold">{s.name}</h2>
                <p className="mt-3 text-muted">{s.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
