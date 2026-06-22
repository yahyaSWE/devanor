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
        <div className="grid gap-4 sm:grid-cols-2">
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
