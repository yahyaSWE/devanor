import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Helpdesk support, automation, training and consulting for E3.Series teams.",
};

export default function ServicesPage() {
  return (
    <>
      <Section className="pt-28">
        <SectionHeading
          eyebrow="Services"
          title="Services that keep your design team moving"
          subtitle="We don't just sell software — we make sure it works for the way your team designs."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-surface/40 p-8">
                <h2 className="text-xl font-semibold">{s.name}</h2>
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
