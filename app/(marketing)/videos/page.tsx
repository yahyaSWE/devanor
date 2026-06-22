import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { VideosChapters, type VideoChapter } from "@/components/VideosChapters";
import { products } from "@/lib/site";
import { getEmbedUrl } from "@/lib/video";

export const metadata: Metadata = {
  title: "Demo Videos",
  description:
    "Step-by-step E3.series demo videos, organised by module as chapters.",
};

export default function VideosPage() {
  // Chapters = products that have an embeddable demo video.
  const chapters: VideoChapter[] = products
    .map((p) => {
      const embed = p.videoUrl ? getEmbedUrl(p.videoUrl) : null;
      return embed
        ? { slug: p.slug, name: p.name, summary: p.summary, embed }
        : null;
    })
    .filter((c): c is VideoChapter => c !== null);

  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <SectionHeading
          eyebrow="Demo Videos"
          title="See E3.series in action"
          subtitle="Browse module-by-module demos. Pick a chapter or use the arrows — no scrolling required."
        />
        <VideosChapters chapters={chapters} />
      </Section>

      <CTASection />
    </>
  );
}
