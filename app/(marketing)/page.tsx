import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { Stats } from "@/components/Stats";
import { LogoMarquee } from "@/components/LogoMarquee";
import {
  caseStudies,
  differentiators,
  e3Modules,
  services,
  site,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background video — file lives at /public/hero.mp4 */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.svg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-center px-6 py-28">
          <Reveal>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Official Zuken Partner · E3.Series Experts
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="text-gradient">{site.tagline}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book-demo" className="px-8">
                Contact us for a demo
              </ButtonLink>
              <ButtonLink href="/products/e3-series" variant="outline">
                Explore E3 Series
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <Section className="!py-0">
        <div className="-mt-16 relative z-10">
          <Stats
            items={[
              { value: "7+", label: "Years of E3.Series expertise" },
              { value: "4", label: "Core E3 modules supported" },
              { value: "2", label: "Disciplines bridged — ECAD & MCAD" },
              { value: "100%", label: "Focus on your design workflow" },
            ]}
          />
        </div>
      </Section>

      {/* Client logo marquee (renders when 3+ clients exist) */}
      <div className="mt-20">
        <LogoMarquee />
      </div>

      {/* Products teaser */}
      <Section>
        <SectionHeading
          index="01"
          eyebrow="Products"
          title="E3 Series — one modular platform for electrical design"
          subtitle="Design electrical, wiring and fluid systems with seamless MCAD integration and automated inspections."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {e3Modules.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <Link href="/products/e3-series" className="card group block h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  <span className="font-mono text-xs text-muted">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{m.description}</p>
                <span className="mt-4 inline-block text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/products" variant="outline">
            View all products
          </ButtonLink>
        </div>
      </Section>

      {/* Services teaser */}
      <Section className="border-t border-border">
        <SectionHeading
          index="02"
          eyebrow="Services"
          title="Expert support at every step"
          subtitle="From helpdesk to consulting, we help your team get the most out of E3.Series."
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
        <div className="mt-10">
          <ButtonLink href="/services" variant="outline">
            Explore services
          </ButtonLink>
        </div>
      </Section>

      {/* Why Devanor */}
      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            index="03"
            eyebrow="Why Devanor"
            title="Design partners, not just a software reseller"
            subtitle="Over 7 years of hands-on E3.Series experience across electrical and mechanical design."
          />
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

      {/* Case Studies (homepage section per spec) */}
      <Section id="case-studies" className="border-t border-border">
        <SectionHeading
          index="04"
          eyebrow="Case Studies"
          title="Results our customers have seen"
          subtitle="A few examples of what's possible when E3.Series is set up and supported well."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="card flex h-full flex-col p-6">
                <p className="text-xs uppercase tracking-wider text-muted">
                  {c.client}
                </p>
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
