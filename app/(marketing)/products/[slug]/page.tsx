import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
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
      <Section className="pt-32">
        <BackButton />

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Products / {product.name}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-lg text-muted">{product.summary}</p>
        </div>

        {/* Product image — Johan uploads (named per module) */}
        <ImagePlaceholder
          label={`${product.name} image (upload to /public/products/${product.slug}.jpg)`}
          className="mt-10 aspect-video w-full"
        />

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

        {/* Module video */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">See {product.name} in action</h2>
          {embed ? (
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
          ) : (
            <ImagePlaceholder
              label={`${product.name} video — add a YouTube/Vimeo link in lib/site.ts`}
              className="aspect-video w-full"
            />
          )}
        </div>

        <div className="mt-10">
          <ButtonLink
            href={demoVideosUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch E3.series Demo Videos
          </ButtonLink>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
