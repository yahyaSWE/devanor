import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ClientsGrid } from "@/components/ClientsGrid";
import { CTASection } from "@/components/CTASection";
import { differentiators, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            About us
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            A specialised partner for electrical &amp; mechanical design
          </h1>
          <div className="mt-6 space-y-4 text-lg text-muted">
            <p>
              {site.name} is a specialised partner of Zuken, providing solutions for
              electrical and mechanical design. Operating from Dubai, UAE, we deliver
              E3.Series software, training and professional support services.
            </p>
            <p>
              With over 7 years of hands-on experience in E3.Series and deep knowledge
              of electrical and mechanical design, we help engineering teams optimise
              their workflows and get more out of their tools.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.05}>
              <div className="card h-full p-6">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="mt-3 font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm text-muted">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Our Clients */}
      <Section id="our-clients" className="border-t border-border">
        <SectionHeading
          eyebrow="Our Clients"
          title="Teams that design with Devanor"
          subtitle="We're proud to support engineering teams across industries. Click a logo to visit their site."
        />
        <div className="mt-12">
          <ClientsGrid />
        </div>
      </Section>

      <CTASection />
    </>
  );
}
