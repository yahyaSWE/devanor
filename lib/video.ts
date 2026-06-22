// Helpers to turn a pasted YouTube/Vimeo/Loom URL into an embeddable player URL.

export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtube.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    }
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    return null;
  } catch {
    return null;
  }
}

/** Returns an embeddable player URL for YouTube/Vimeo/Loom links, or null. */
export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;

  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    if (host === "player.vimeo.com") return u.toString();
    if (host === "loom.com") {
      // Share links look like loom.com/share/{id}; embeds use loom.com/embed/{id}.
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[0] === "share" || parts[0] === "embed" ? parts[1] : parts[0];
      if (id) return `https://www.loom.com/embed/${id}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

/** A thumbnail image URL for a YouTube link (used for compact previews). */
export function getVideoThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
