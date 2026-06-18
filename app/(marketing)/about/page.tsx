import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ClientsGrid } from "@/components/ClientsGrid";
import { CTASection } from "@/components/CTASection";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BackButton } from "@/components/BackButton";
import { differentiators, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              About us
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
              A specialised partner for electrical engineering
            </h1>
            <div className="mt-6 space-y-4 text-lg text-muted">
              <p>
                {site.name} is a trusted Zuken Partner providing E3.series software,
                training, consulting and expert support across the GCC region. Based in
                Dubai, UAE, we help customers maximise the value of their E3.series
                investment through implementation, optimisation and ongoing support.
              </p>
              <p>
                With over 7 years of hands-on E3.series experience and expertise in both
                electrical and mechanical engineering, we combine software knowledge with
                real-world engineering experience to help customers design smarter and
                work more efficiently.
              </p>
            </div>
          </div>
          {/* Same image as Why Devanor — Johan uploads */}
          <ImagePlaceholder
            label="About image (upload to /public/about-devanor.jpg)"
            className="aspect-[4/3] w-full"
          />
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
          title="Trusted E3.series Users"
          subtitle="Supporting engineering teams across multiple industries throughout the GCC."
        />
        <div className="mt-12">
          <ClientsGrid />
        </div>
      </Section>

      <CTASection />
    </>
  );
}
