import type { NavItem, SocialLink } from "@/types";

/** The canonical public domain. Production always uses this for canonical URLs, the sitemap and share previews. */
export const PRODUCTION_URL = "https://idea-kraft.com";

/**
 * - Production deployment on Vercel → the custom domain (never the *.vercel.app alias).
 * - Preview deployments → their own preview URL.
 * - Local / other hosts → NEXT_PUBLIC_SITE_URL, else localhost.
 * Only read on the server (metadata, sitemap, robots, structured data).
 */
function resolveSiteUrl() {
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const siteConfig = {
  name: "NOVARA STUDIO",
  shortName: "Novara",
  tagline: "We Build Digital Experiences That Move Brands Forward.",
  description:
    "Novara Studio is an independent creative digital agency. We combine strategy, design and modern engineering to build websites, e-commerce and digital products for ambitious brands.",
  url: resolveSiteUrl(),
  email: "hello@novara.studio",
  location: "Binghamton, NY · Working worldwide",
  /** Studio address, used by the contact-page globe, directions link and structured data.
   *  Coordinates are the OpenStreetMap geocode for 45 Lewis St, Binghamton, NY 13901. */
  address: {
    street: "45 Lewis St",
    city: "Binghamton",
    region: "NY",
    postalCode: "13901",
    country: "United States",
    countryCode: "US",
    timeZone: "America/New_York",
    lat: 42.10357,
    lng: -75.90772,
  },
  /** Editable: shown on the contact page and in the hero status pill. */
  availability: {
    open: true,
    label: "Booking projects for Q1 2027",
  },
  /** Editable placeholder — set this to the response time you can actually commit to. */
  responseTime: "Within 1–2 business days",
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/** Replace the hrefs with your real profiles. */
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", handle: "@novara.studio" },
  { label: "LinkedIn", href: "https://linkedin.com", handle: "Novara Studio" },
  { label: "Dribbble", href: "https://dribbble.com", handle: "novarastudio" },
  { label: "GitHub", href: "https://github.com", handle: "novara-studio" },
];
