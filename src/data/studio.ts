import { unsplash } from "@/lib/images";
import type { Stat, TeamMember, Testimonial } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT
 *  The team profiles, testimonials, statistics and client names below are
 *  illustrative samples. They are labelled as such on the site. Replace them
 *  with real, verifiable information before launch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Fictional brand names for the "illustrative clients" marquee. Each gets its own wordmark style. */
export const illustrativeBrands: { name: string; style: "serif" | "mono" | "wide" | "italic" | "heavy" | "light" }[] = [
  { name: "Halcyon", style: "serif" },
  { name: "NORTHWIND", style: "wide" },
  { name: "orbit/labs", style: "mono" },
  { name: "Kestrel & Co", style: "italic" },
  { name: "VANTA", style: "heavy" },
  { name: "lumen", style: "light" },
  { name: "Meridian", style: "serif" },
  { name: "FIELD.WORKS", style: "wide" },
  { name: "atlas_os", style: "mono" },
  { name: "Solenne", style: "italic" },
];

/** Placeholder profiles. Swap names, roles, bios and photos for your real team. */
export const team: TeamMember[] = [
  {
    name: "Amara Lindqvist",
    role: "Founder & Creative Director",
    bio: "Sets the creative bar on every project and spends too long choosing typefaces.",
    image: { src: unsplash("1582896911227-c966f6e7fb93", 900), alt: "Portrait of a woman in a grey cardigan against a light background" },
  },
  {
    name: "Daniel Okoye",
    role: "Lead Frontend Engineer",
    bio: "Turns ambitious designs into fast, accessible code. Owns our performance budgets.",
    image: { src: unsplash("1666577624653-b6f0043fed0e", 900), alt: "Portrait of a person in a dark suit against a dark background" },
  },
  {
    name: "Sofia Marín",
    role: "Senior Product Designer",
    bio: "Bridges research and interface craft. Believes most problems are naming problems.",
    image: { src: unsplash("1583387930645-0401ad8d8e1e", 900), alt: "Portrait of a woman in a black top in low light" },
  },
  {
    name: "Iris Tanaka",
    role: "Creative Developer",
    bio: "Shaders, motion and WebGL. Makes things move and makes sure they stop when they should.",
    image: { src: unsplash("1692243244821-437cce2c3010", 900), alt: "Portrait of a woman seated on a white box in a bright studio" },
  },
];

/** Sample testimonials. Clearly labelled on the site as illustrative. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "They asked better questions in the first workshop than we'd asked ourselves in a year. The site that came out of it finally sounds like us.",
    name: "Sample Client",
    role: "Head of Marketing",
    company: "Placeholder Co.",
  },
  {
    quote:
      "Launch day was the calmest one we've ever had. Every page was tested, every redirect mapped, and the handover docs actually got read.",
    name: "Sample Client",
    role: "Founder",
    company: "Example Brand",
  },
  {
    quote:
      "Our editors can publish a full case study in twenty minutes now. It used to take a developer and a week.",
    name: "Sample Client",
    role: "Operations Lead",
    company: "Demo Studio",
  },
];

/** Illustrative figures. Replace with verified numbers before publishing. */
export const stats: Stat[] = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 14, label: "Countries served" },
  { value: 9, label: "Years in practice" },
];

export const processSteps = [
  {
    title: "Discover",
    text: "Stakeholder interviews, analytics and competitor reviews. We find out what success actually means for your business before anything is designed.",
    deliverables: ["Discovery workshop", "Audit report", "Success metrics"],
  },
  {
    title: "Strategize",
    text: "We turn insight into a plan: positioning, information architecture, content model and a technical approach chosen for your team, not ours.",
    deliverables: ["Sitemap & IA", "Content model", "Technical brief"],
  },
  {
    title: "Design",
    text: "Art direction, wireframes and high-fidelity prototypes. Reviewed in short loops, so feedback lands while it's still cheap to act on.",
    deliverables: ["Art direction", "Prototypes", "Design system"],
  },
  {
    title: "Develop",
    text: "Component-driven builds with staging links from week one. Accessibility, performance and SEO are built in as we go, not bolted on at the end.",
    deliverables: ["Staging site", "CMS setup", "QA reports"],
  },
  {
    title: "Launch",
    text: "Cross-device QA, redirects, analytics and a calm go-live. Then training, documentation and a 30-day aftercare window.",
    deliverables: ["Go-live plan", "Training", "Aftercare"],
  },
];

export const reasons = [
  { title: "Creative thinking", text: "Ideas grounded in strategy. We push for the version people remember, not the version that's safest to approve." },
  { title: "Modern technology", text: "Next.js, React, TypeScript, headless CMS and WebGL, chosen per project and never by habit." },
  { title: "Performance-focused", text: "Budgets for JavaScript, images and fonts are set on day one and checked on real devices." },
  { title: "Pixel-perfect implementation", text: "Designers and engineers sit on the same call. Spacing, type and motion ship exactly as designed." },
  { title: "Responsive by design", text: "Every layout is composed separately for phone, tablet and desktop, never just squeezed down." },
  { title: "Attention to detail", text: "Focus states, empty states, error states, 404s. The parts most teams skip are the parts users notice." },
];

export const values = [
  { title: "Clarity over cleverness", text: "If a visitor has to decode it, we've failed. Bold ideas are welcome; confusing ones aren't." },
  { title: "Craft is a habit", text: "Quality comes from small decisions made carefully every day, not a polish pass at the end." },
  { title: "Honest by default", text: "Realistic timelines, plain-English estimates and no invented metrics in our pitches or yours." },
  { title: "Built to be handed over", text: "We document, train and leave you independent. Good work shouldn't need us forever." },
];
