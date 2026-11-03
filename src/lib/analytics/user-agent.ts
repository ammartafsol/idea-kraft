/** Tiny, dependency-free user-agent classification. Good enough for dashboard breakdowns. */

const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link|whatsapp|telegram|discord|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http/i;

export function isBot(ua: string) {
  return !ua || BOT.test(ua);
}

export function classifyUserAgent(ua: string) {
  const device: "desktop" | "mobile" | "tablet" = /ipad|tablet|(android(?!.*mobile))|kindle|silk/i.test(ua)
    ? "tablet"
    : /mobi|iphone|ipod|android|windows phone/i.test(ua)
      ? "mobile"
      : "desktop";

  // Order matters: Edge and Opera include "Chrome"; Chrome includes "Safari".
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /samsungbrowser/i.test(ua)
        ? "Samsung Internet"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /chrome|crios/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other";

  const os = /windows/i.test(ua)
    ? "Windows"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /mac os/i.test(ua)
        ? "macOS"
        : /android/i.test(ua)
          ? "Android"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";

  return { device, browser, os };
}

/** "https://www.google.com/search?q=…" → "google.com". Same-site and empty referrers → "" (direct). */
export function referrerHost(referrer: string, ownHost: string) {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host === ownHost.replace(/^www\./, "").split(":")[0] ? "" : host;
  } catch {
    return "";
  }
}
