"use client";

import { useState } from "react";

/**
 * Hero background video with a poster fallback.
 *
 * The poster only renders until the video actually starts, so it never shows
 * through the semi-transparent video. Phones that block autoplay (iOS Low
 * Power/Low Data Mode) keep showing the poster instead of a black hero.
 */
export function HeroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      {!playing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero-poster.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-65"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-poster.svg"
        onPlaying={() => setPlaying(true)}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </>
  );
}
