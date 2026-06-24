import { ButtonLink } from "./Button";
import { demoVideosUrl, e3SeriesLogo } from "@/lib/site";

/**
 * E3.series logo + "Watch E3.series Tutorial Videos" button.
 * Used on the homepage products section and the products overview hero.
 * (Plain <img> so a not-yet-uploaded logo degrades gracefully instead of
 * throwing next/image's strict validation in dev.)
 */
export function TutorialsCta({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 sm:items-end ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={e3SeriesLogo}
        alt="E3.series"
        className="h-12 w-auto object-contain"
      />
      <ButtonLink href={demoVideosUrl}>Watch E3.series Tutorial Videos</ButtonLink>
    </div>
  );
}
