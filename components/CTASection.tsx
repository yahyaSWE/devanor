import { Section } from "./Section";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { AssetImage } from "./AssetImage";
import { site } from "@/lib/site";

export function CTASection() {
  return (
    <Section>
      <Reveal>
        <div className="glow relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Contact us for a demo
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
                See E3.series in action
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted">
                Schedule a personalised demo and tell us about your engineering
                challenges. We&apos;ll show you how E3.series can improve efficiency,
                reduce manual work and streamline your design process.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/book-demo" className="px-8">
                  Book a Demo
                </ButtonLink>
                <ButtonLink href={site.contact.phoneHref} variant="outline">
                  Call {site.contact.phone}
                </ButtonLink>
              </div>
            </div>
            {/* Image */}
            <AssetImage
              src="/BOOK%20A%20DEMO.webp"
              label="Book a demo"
              className="aspect-video w-full"
            />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
