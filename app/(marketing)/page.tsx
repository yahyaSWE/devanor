import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { Stats } from "@/components/Stats";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TutorialsCta } from "@/components/TutorialsCta";
import {
  caseStudies,
  differentiators,
  products,
  productsBlurb,
  services,
  site,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — full screen video, text bottom-left, badge bottom-right (in line w/ content) */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        {/* Always-visible fallback: an <img> renders the poster even on phones
            that block autoplay (iOS Low Power/Data Mode) or won't paint an SVG
            video poster. The video plays on top when it can. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-poster.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Background video — drop the real file at /public/hero.mp4 */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-65"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.svg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Legibility gradient — original/light at the top, fading to solid black at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/35 to-background" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
                  <span className="text-gradient">{site.tagline}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
              </Reveal>
            </div>
            {/* Badge — bottom-right, aligned with the bottom of the text, visible immediately */}
            <span className="hidden shrink-0 items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Official Zuken Partner · E3.series Experts
            </span>
          </div>
        </div>
      </section>

      {/* Stats + client logos — one matching section (reveals on scroll, below the hero) */}
      <Section>
        <Reveal>
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
        </Reveal>
        {/* Client logos box — same width as the stats box, label inside, clear gap above */}
        <div className="mt-8">
          <LogoMarquee />
        </div>
      </Section>

      {/* 01 — Products */}
      <Section className="border-t border-border">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionHeading
              index="01"
              eyebrow="Products"
              title="Products: E3.series — a complete modular platform for electrical engineering"
              subtitle={productsBlurb}
            />
            <div className="mt-6">
              <ButtonLink href="/products" variant="outline">
                View all products
              </ButtonLink>
            </div>
          </div>
          <TutorialsCta className="self-end lg:self-start lg:pt-2" />
        </div>
        <ProductCarousel products={products} />
      </Section>

      {/* 02 — Services */}
      <Section className="border-t border-border">
        <SectionHeading
          index="02"
          eyebrow="Services"
          title="Services that keep your design team moving"
          subtitle="From implementation to optimisation, we partner with your team every step of the way."
        />
        <div className="mt-6">
          <ButtonLink href="/services" variant="outline">
            Learn more
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="card h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{s.name}</h3>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 03 — Why Devanor */}
      <Section className="border-t border-border">
        {/* Top row: heading (left) + full image (right) */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
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
          </div>
          {/* Whole image visible (not cropped), rounded corners */}
          <div className="overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/About%20us.webp"
              alt="About Devanor"
              className="block h-auto w-full"
            />
          </div>
        </div>
        {/* Differentiator cards — full-width row below */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.05}>
              <div className="card h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{d.title}</h3>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{d.description}</p>
              </div>
            </Reveal>
          ))}
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
