import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { TutorialsCta } from "@/components/TutorialsCta";
import { products, productsBlurb } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "E3.series — a complete modular platform for electrical engineering.",
};

export default function ProductsPage() {
  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Products"
              title="E3.series — a complete modular platform for electrical engineering"
              subtitle={productsBlurb}
            />
          </div>
          <TutorialsCta className="lg:pt-2" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                href={`/products/${p.slug}`}
                className="card group flex h-full flex-col overflow-hidden p-0"
              >
                {/* Landscape image — whole image visible, not zoomed/cropped */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-2" />
                  )}
                </div>
                {/* Text under the image */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold">{p.name}</h2>
                    <span className="font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
                  <span className="mt-4 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
