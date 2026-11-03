import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "NOVARA STUDIO",
  shortName: "Novara",
  tagline: "We Build Digital Experiences That Move Brands Forward.",
  description:
    "Novara Studio is an independent creative digital agency. We combine strategy, design and modern engineering to build websites, e-commerce and digital products for ambitious brands.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@novara.studio",
  location: "Binghamton, NY · Working worldwide",
  /** Studio address, used by the contact-page globe, directions link and structured data. */
  address: {
    street: "45 Lewis Street",
    city: "Binghamton",
    region: "NY",
    postalCode: "13901",
    country: "United States",
    countryCode: "US",
    timeZone: "America/New_York",
    lat: 42.0987,
    lng: -75.9113,
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
