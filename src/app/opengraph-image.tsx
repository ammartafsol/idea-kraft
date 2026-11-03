import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINES = ["We turn bold", "ideas into digital", "experiences"];
const FOOTER_LEFT = "Strategy · Design · Engineering";

/** Fetches just the glyphs we need from Google Fonts. Returns null if offline, so the build never fails. */
async function loadDisplayFont(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&text=${encodeURIComponent(text)}`, {
        signal: AbortSignal.timeout(5000),
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url, { signal: AbortSignal.timeout(5000) })).arrayBuffer();
  } catch {
    return null;
  }
}

/** Default social card, generated at build time in the brand's colours. */
export default async function OpengraphImage() {
  const font = await loadDisplayFont(`${LINES.join(" ").toUpperCase()}.IDEA KRAFT${FOOTER_LEFT}${siteConfig.tagline}`);
  const display = font ? "Bricolage" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101010",
          color: "#F7F7F4",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#C6FF4D" />
            <path d="M16 5.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5-.6-5.6-4.9-9.9-10.5-10.5 5.6-.6 9.9-4.9 10.5-10.5Z" fill="#101010" />
          </svg>
          <div style={{ fontFamily: display, fontSize: 30, letterSpacing: -0.5 }}>IDEA KRAFT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: display, fontSize: 104, lineHeight: 0.92, letterSpacing: -3, textTransform: "uppercase" }}>
          {LINES.map((line, i) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
              {i === LINES.length - 1 && <span style={{ color: "#C6FF4D" }}>.</span>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: display, fontSize: 24, color: "#9D9D98" }}>
          <span>{FOOTER_LEFT}</span>
          <span style={{ color: "#C6FF4D" }}>{siteConfig.tagline}</span>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
