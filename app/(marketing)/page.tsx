import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { Stats } from "@/components/Stats";
import { LogoMarquee } from "@/components/LogoMarquee";
import { AssetImage } from "@/components/AssetImage";
import { caseStudies, differentiators, products, services, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — full screen video with text bottom-left, badge bottom-right */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        {/* Background video — drop the real file at /public/hero.mp4 */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.svg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Legibility gradients (darker toward bottom-left where the text sits) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 lg:px-10">
          <Reveal>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
              <span className="text-gradient">{site.tagline}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
          </Reveal>
        </div>

        {/* Badge — lower right */}
        <div className="absolute bottom-24 right-6 hidden lg:block lg:right-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Official Zuken Partner · E3.series Experts
          </span>
        </div>
      </section>

      {/* Stats band */}
      <Section className="!py-0">
        <div className="relative z-10 -mt-16">
          <Stats
            items={[
              { value: "8+", label: "Years of hands-on E3.series experience" },
              { value: "6", label: "Serving all GCC countries" },
              {
                value: "5+",
                label:
                  "Power Distribution · Control Systems · Automotive · Aviation · Defense & More",
              },
              { value: "2", label: "ECAD to MCAD integration" },
            ]}
          />
        </div>
      </Section>

      {/* Client logo marquee (renders when 3+ clients exist) */}
      <div className="mt-20">
        <LogoMarquee />
      </div>

      {/* 01 — Products */}
      <Section>
        <SectionHeading
          index="01"
          eyebrow="Products"
          title="Products: E3.series — a complete modular platform for electrical engineering"
          subtitle="Design complex electrical systems with integrated wiring, fluid engineering, MCAD connectivity and automated design checks."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                href={`/products/${p.slug}`}
                className="card group block h-full p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{p.summary}</p>
                <span className="mt-4 inline-block text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 02 — Services */}
      <Section className="border-t border-border">
        <SectionHeading
          index="02"
          eyebrow="Services"
          title="Services that keep your design team moving"
          subtitle="From implementation to optimisation, we partner with your team every step of the way."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="card h-full p-6">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="mt-3 font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 03 — Why Devanor */}
      <Section className="border-t border-border">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              index="03"
              eyebrow="Why Devanor"
              title="Design partners, not just a software provider"
              subtitle="Over 7 years of hands-on E3.series experience, backed by expertise in both electrical and mechanical engineering."
            />
            <div className="mt-6">
              <ButtonLink href="/about" variant="outline">
                Learn more
              </ButtonLink>
            </div>
            {/* Image — same asset as the About us page */}
            <AssetImage
              src="/About%20us.webp"
              label="About Devanor"
              className="mt-8 aspect-[4/3] w-full"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.05}>
                <div className="card h-full p-6">
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted">{d.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 04 — Case Studies (kept until the News feature lands) */}
      <Section id="case-studies" className="border-t border-border">
        <SectionHeading
          index="04"
          eyebrow="Case Studies"
          title="Results our customers have seen"
          subtitle="A few examples of what's possible when E3.series is set up and supported well."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="card flex h-full flex-col p-6">
                <p className="text-xs uppercase tracking-wider text-muted">{c.client}</p>
                <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted">{c.summary}</p>
                <p className="mt-4 border-t border-border pt-4 text-sm font-semibold text-accent">
                  {c.result}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />

      <p className="sr-only">
        <Link href="/about">About {site.name}</Link>
      </p>
    </>
  );
}
