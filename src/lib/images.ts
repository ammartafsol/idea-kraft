/**
 * Photography is served from Unsplash's CDN and optimised by next/image.
 * Swap any `unsplash("…")` call for a local path such as "/work/acommify/cover.jpg"
 * (drop files into /public) when you have real project screenshots.
 */
export function unsplash(id: string, width = 2400) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}
