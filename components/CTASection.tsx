import { Section } from "./Section";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function CTASection() {
  return (
    <Section>
      <Reveal>
        <div className="glow relative overflow-hidden rounded-3xl border border-border bg-surface/60 px-8 py-16 text-center sm:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Contact us for a demo
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
            See E3.Series in action with a tailored, no-pressure demo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Tell us about your design challenges and we&apos;ll show you exactly how
            Devanor Solutions can speed up your workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/book-demo" className="px-8">
              Book a Demo
            </ButtonLink>
            <ButtonLink href={site.contact.phoneHref} variant="outline">
              Call {site.contact.phone}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
