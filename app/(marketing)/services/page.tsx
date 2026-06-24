import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
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
      {/* Hero — services image as background, matches the product pages */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <Image
          src="/products/SERVICES.webp"
          alt="Devanor services"
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
            Services
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
            Services that keep your design team moving
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            From implementation to optimisation, we partner with your team every
            step of the way.
          </p>
        </div>
      </section>

      <Section>
        {/* Intro text */}
        <div className="space-y-4 text-lg text-muted">
          <p>
            Our services are built to support every stage of your E3.series journey.
            Whether you need expert guidance, process optimization, skill development,
            or tailored solutions.
          </p>
          <p>
            By combining technical expertise with practical industry experience, we
            deliver solutions that improve efficiency, enhance collaboration and help
            your team achieve better results with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <article className="card h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{s.name}</h2>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
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
