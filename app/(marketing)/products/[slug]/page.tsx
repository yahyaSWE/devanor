import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { getProduct, products, demoVideosUrl } from "@/lib/site";
import { getEmbedUrl } from "@/lib/video";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product
    ? { title: product.name, description: product.summary }
    : { title: "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const embed = product.videoUrl ? getEmbedUrl(product.videoUrl) : null;

  return (
    <>
      {/* Hero — product image as background, text bottom-left (matches home) */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} preview`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-65"
          />
        ) : null}
        {/* Legibility gradient — original/light at the top, fading to solid black at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/35 to-background" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 lg:px-10">
          <BackButton className="self-start" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Products / {product.name}
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
            {product.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{product.summary}</p>
        </div>
      </section>

      <Section>
        {/* Detail + highlight boxes */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <p className="text-lg leading-relaxed text-muted">{product.detail}</p>
          <div className="grid gap-3">
            {product.highlights.map((h, i) => (
              <Reveal key={h} delay={i * 0.04}>
                <div className="card flex items-start gap-3 p-4 text-sm">
                  <span className="mt-0.5 text-accent">▸</span>
                  <span>{h}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Module video — only when a video exists for this product */}
        {embed && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">See {product.name} in action</h2>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
              <iframe
                src={embed}
                title={`${product.name} video`}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="mt-10">
          <ButtonLink href={demoVideosUrl}>
            Watch E3.series Demo Videos
          </ButtonLink>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
