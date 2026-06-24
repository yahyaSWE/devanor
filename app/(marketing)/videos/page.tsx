import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { BackButton } from "@/components/BackButton";
import { VideosChapters, type VideoChapter } from "@/components/VideosChapters";
import { tutorials } from "@/lib/site";
import { getEmbedUrl } from "@/lib/video";

export const metadata: Metadata = {
  title: "Tutorials",
  description: "Step-by-step E3.series tutorial videos.",
};

export default function VideosPage() {
  // Chapters = tutorial videos that have an embeddable URL.
  const chapters: VideoChapter[] = tutorials
    .map((t, i) => {
      const embed = getEmbedUrl(t.videoUrl);
      return embed ? { slug: `tutorial-${i + 1}`, name: t.title, embed } : null;
    })
    .filter((c): c is VideoChapter => c !== null);

  return (
    <>
      <Section className="pt-32">
        <BackButton />
        <SectionHeading
          eyebrow="Tutorials"
          title="E3.series tutorials"
          subtitle="Step-by-step walkthroughs. Pick a tutorial or use the arrows."
        />
        <VideosChapters chapters={chapters} />
      </Section>

      <CTASection />
    </>
  );
}
