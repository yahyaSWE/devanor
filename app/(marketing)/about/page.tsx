import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ClientsGrid } from "@/components/ClientsGrid";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { differentiators, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero — about image as background, matches the product pages */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <Image
          src="/About%20us.webp"
          alt="About Devanor"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover opacity-65"
        />
        {/* Original/light at the top, fading to solid black at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/35 to-background" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 lg:px-10">
          <BackButton className="self-start" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            About us
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
            A specialised partner for electrical engineering
          </h1>
        </div>
      </section>

      {/* Text + boxes under the image */}
      <Section>
        <div className="mx-auto max-w-3xl space-y-4 text-lg text-muted">
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
