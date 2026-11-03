import { unsplash } from "@/lib/images";
import type { Project, ProjectCategory } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO DATA
 * ─────────────────────────────────────────────────────────────────────────────
 *  Adding a project: copy an object, give it a unique `slug`, and it will
 *  automatically appear on /work, get its own /work/[slug] page, be added to
 *  the sitemap and join the next/previous navigation.
 *
 *  REPLACE WITH YOUR REAL WORK: Acommify, The Coach Huddle and Havera are
 *  reserved slots for your own case studies. Drop your screenshots into
 *  /public/work/<slug>/ and point `cover.src` / `gallery[].src` at them
 *  (e.g. "/work/acommify/cover.jpg"), update the copy, then set
 *  `isConcept: false` to remove the "Concept" badge.
 *  Recommended cover size: 2400 × 1500px (16:10).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: "acommify",
    title: "Acommify",
    tagline: "E-commerce Experience",
    category: "E-commerce",
    year: "2026",
    client: "Acommify (concept)",
    role: ["E-commerce strategy", "UI/UX design", "Headless development"],
    summary:
      "A headless storefront for a design-led homeware label. Editorial product storytelling with a checkout built for speed.",
    overview:
      "Acommify sells small-batch homeware to a design-literate audience who browse slowly and buy deliberately. The brief was a store that feels like a printed catalogue but performs like a modern commerce platform.",
    challenge:
      "The existing theme-based store was heavy with apps and scripts, product pages took over four seconds to become interactive on mobile, and the brand's photography was buried under generic UI. Customers were dropping off between collection pages and the product detail view.",
    solution:
      "We rebuilt the front end headlessly on Next.js and the Shopify Storefront API. Product imagery leads every template, collection filtering happens instantly on the client, and the cart is a persistent drawer so browsing never resets. Pages are statically generated and revalidated on inventory change.",
    approach: [
      { title: "Catalogue-led layouts", text: "Asymmetric product grids and full-bleed lifestyle imagery borrow the pacing of a print catalogue." },
      { title: "Instant filtering", text: "Collections ship with a pre-indexed product payload, so filters and sorts respond without a network round-trip." },
      { title: "Frictionless checkout", text: "Persistent cart drawer, express payment buttons and address autocomplete cut checkout steps." },
    ],
    outcomes: [
      "Static product pages with on-demand revalidation",
      "Fully keyboard-navigable shopping flow",
      "Editor-managed lookbooks via headless CMS",
    ],
    stack: ["Next.js", "TypeScript", "Shopify Storefront API", "Tailwind CSS", "Motion", "Sanity"],
    cover: { src: unsplash("1666866875759-84154ec24c85"), alt: "A minimal ceramic espresso cup photographed on a soft grey surface" },
    gallery: [
      { src: unsplash("1530543787849-128d94430c6b"), alt: "Abstract close-up of a yellow and white painted wall used as a brand texture" },
      { src: unsplash("1772211402702-a3080a09a828"), alt: "Still life of yellow flowers resting on stacked concrete blocks" },
      { src: unsplash("1786840320334-c12bde49bf23"), alt: "Carved wooden sculpture with a domed top on a white background" },
    ],
    isConcept: true,
  },
  {
    slug: "the-coach-huddle",
    title: "The Coach Huddle",
    tagline: "Coaching Platform",
    category: "Web Platform",
    year: "2026",
    client: "The Coach Huddle (concept)",
    role: ["Product design", "Design system", "Full-stack development"],
    summary:
      "A membership platform connecting independent strength coaches with their athletes, covering programming, video feedback and payments.",
    overview:
      "Independent coaches were juggling spreadsheets, messaging apps and payment links to run their businesses. The Coach Huddle brings programme delivery, form-check video and subscriptions into one calm, focused workspace.",
    challenge:
      "Two very different users share one product: coaches managing dozens of athletes on desktop, and athletes logging sessions on their phones between sets in a noisy gym. The interface had to be dense for one and dead simple for the other.",
    solution:
      "We designed two tailored surfaces on a shared design system: a data-rich coach dashboard and a thumb-first athlete app with oversized controls and offline logging. Stripe handles subscriptions, and video uploads are transcoded and streamed adaptively.",
    approach: [
      { title: "Two-surface design", text: "One component library, two densities: comfortable for coaches, gym-proof for athletes." },
      { title: "Offline-first logging", text: "Sessions save locally and sync when signal returns, which matters in basement gyms." },
      { title: "Video feedback loop", text: "Coaches annotate athlete form-check videos with time-stamped comments." },
    ],
    outcomes: [
      "Shared design system with 60+ documented components",
      "Role-based dashboards for coaches and athletes",
      "Subscription billing with self-serve plan changes",
    ],
    stack: ["Next.js", "React", "Node.js", "MongoDB", "Stripe", "Mux Video"],
    cover: { src: unsplash("1671316149446-4da1e921c007"), alt: "An athlete holding a dumbbell in a dark, moody gym" },
    gallery: [
      { src: unsplash("1734630341082-0fec0e10126c"), alt: "A row of metal dumbbells on a rack in low light" },
      { src: unsplash("1672344048213-76b6e77304bd"), alt: "Black and white close-up of a single dumbbell" },
      { src: unsplash("1676655079738-af54dfd6318e"), alt: "An athlete training on rings in a dark gym lit in red" },
    ],
    isConcept: true,
  },
  {
    slug: "havera",
    title: "Havera",
    tagline: "Modern Digital Experience",
    category: "Digital Experience",
    year: "2025",
    client: "Havera (concept)",
    role: ["Art direction", "Creative development", "3D & motion"],
    summary:
      "An immersive launch site for a sculptural lighting brand, with real-time 3D, scroll-driven storytelling and a calm, gallery-like pace.",
    overview:
      "Havera makes sculptural objects that sit between lighting and art. The launch site needed to communicate material and form before a single product photograph had been taken.",
    challenge:
      "With physical samples still in production, we had to convey texture, translucency and scale digitally, without a heavy site that would stutter on laptops or drain phone batteries.",
    solution:
      "We built a lightweight Three.js scene with custom shaders that echo the objects' soft forms, paired with a scroll-driven narrative. On phones and for users who prefer reduced motion, the 3D gracefully steps down to art-directed stills.",
    approach: [
      { title: "Material studies", text: "Custom GLSL shaders simulate frosted glass and soft light without heavy textures." },
      { title: "Scroll as narrative", text: "Each chapter of the story is tied to scroll progress, so visitors set the pace." },
      { title: "Adaptive fidelity", text: "Device capability checks decide between real-time 3D and pre-rendered stills." },
    ],
    outcomes: [
      "Real-time 3D under a 200 KB JavaScript budget",
      "Reduced-motion and mobile fallbacks built in",
      "CMS-driven chapters for future collections",
    ],
    stack: ["Next.js", "Three.js", "React Three Fiber", "GLSL", "Motion", "Sanity"],
    cover: { src: unsplash("1769228092677-9f2d7d7c19f3"), alt: "A soft white sculptural 3D form with a hole through its centre" },
    gallery: [
      { src: unsplash("1762361962969-9e1484e8c8b5"), alt: "Abstract neutral composition of soft curved shapes" },
      { src: unsplash("1777734863334-6217dd1af7a6"), alt: "A bright luminous ring against a muted background" },
    ],
    isConcept: true,
  },
  {
    slug: "nova-architecture",
    title: "NOVA Architecture",
    tagline: "Architecture & Interior Website",
    category: "WordPress",
    year: "2025",
    client: "NOVA Architecture",
    role: ["Website redesign", "Custom WordPress theme", "Editorial design"],
    summary:
      "A custom WordPress theme for an architecture and interiors practice. Monumental photography with an editor experience the whole studio can use.",
    overview:
      "NOVA's work is about mass, light and restraint. Their old site, built with a page builder, was slow, inconsistent and painful to update, so new projects often went unpublished for months.",
    challenge:
      "The practice needed large-format photography to load quickly, a layout that felt as considered as their buildings, and an admin simple enough for architects, not web editors, to publish case studies.",
    solution:
      "We designed a stark, grid-led editorial site and built it as a bespoke PHP theme with custom Gutenberg blocks for project galleries, drawings and specifications. Images are served responsively with modern formats, and the page builder was removed entirely.",
    approach: [
      { title: "Grid as structure", text: "A strict 12-column grid and heavy horizontal rules echo architectural drawings." },
      { title: "Blocks for architects", text: "Purpose-built Gutenberg blocks mean case studies are assembled, not designed." },
      { title: "SEO-safe migration", text: "Every legacy URL was mapped and redirected so search visibility carried over." },
    ],
    outcomes: [
      "Page builder removed, with a fully custom PHP theme",
      "Eight bespoke Gutenberg blocks with locked styling",
      "Complete 301 redirect map for legacy URLs",
    ],
    stack: ["WordPress", "PHP", "Gutenberg Blocks", "ACF Pro", "JavaScript", "SCSS"],
    cover: { src: unsplash("1546414701-81cc6963c67f"), alt: "A brutalist grey concrete building against a pale sky" },
    gallery: [
      { src: unsplash("1635074155443-6cbf74711dd2"), alt: "Black and white study of a textured concrete wall" },
      { src: unsplash("1586871608370-4adee64d1794"), alt: "Clean white concrete walls meeting at sharp angles in daylight" },
      { src: unsplash("1720762256650-ea429f429226"), alt: "Black and white film photograph of a modernist building" },
    ],
    isConcept: false,
  },
  {
    slug: "kiln-and-form",
    title: "Kiln & Form",
    tagline: "Brand Identity & Shopify Store",
    category: "Branding",
    year: "2025",
    client: "Kiln & Form",
    role: ["Brand identity", "Packaging", "Shopify theme"],
    summary:
      "Identity and online shop for a two-person ceramics studio, with a tactile wordmark and a Shopify theme that lets the work breathe.",
    overview:
      "Kiln & Form were selling through markets and Instagram DMs. They needed a brand that felt as handmade as their pieces, and a shop that two busy makers could run themselves.",
    challenge:
      "Handmade means every piece is slightly different and often one-of-a-kind. The store had to handle single-quantity inventory gracefully and still feel abundant when stock was low.",
    solution:
      "We developed a wordmark drawn from the studio's own glaze marks, a warm earthen palette and a custom Online Store 2.0 theme with sections the founders can rearrange themselves. Sold-out pieces become an archive instead of disappearing.",
    approach: [
      { title: "Mark from material", text: "The wordmark is traced from real glaze drips, so the brand carries the maker's hand." },
      { title: "Archive, not 404", text: "Sold pieces live on as an archive with a 'notify me' for similar work." },
      { title: "Self-serve sections", text: "Every homepage block is a Shopify section the founders can edit without code." },
    ],
    outcomes: [
      "Complete identity system and packaging",
      "Custom Shopify OS 2.0 theme",
      "Back-in-stock notifications via Klaviyo",
    ],
    stack: ["Shopify", "Liquid", "JavaScript", "Klaviyo", "Figma", "Illustrator"],
    cover: { src: unsplash("1786840320334-c12bde49bf23"), alt: "A carved wooden sculpture with twisted legs on a white backdrop" },
    gallery: [
      { src: unsplash("1772211402702-a3080a09a828"), alt: "Yellow flowers on concrete blocks in a geometric still life" },
      { src: unsplash("1530543787849-128d94430c6b"), alt: "Painted wall texture in soft yellow and white" },
    ],
    isConcept: false,
  },
  {
    slug: "tidewater",
    title: "Tidewater",
    tagline: "Email Design System",
    category: "Email",
    year: "2024",
    client: "Tidewater Travel",
    role: ["Email design", "HTML email development", "ESP integration"],
    summary:
      "A modular, dark-mode-aware email system for a boutique travel company: 28 hand-coded blocks that render consistently from Outlook 2016 to iOS Mail.",
    overview:
      "Tidewater's marketing team was rebuilding every newsletter from scratch in a drag-and-drop editor, and the results broke in Outlook and looked muddy in dark mode.",
    challenge:
      "Campaigns had to look premium in every major client, support dark mode intentionally, and still let a non-technical team assemble emails quickly.",
    solution:
      "We designed a modular email system and hand-coded each block in hybrid, table-based HTML with VML fallbacks for Outlook. Blocks were packaged as locked, editable modules in Klaviyo, and every combination was screenshot-tested across clients.",
    approach: [
      { title: "Hybrid fluid layout", text: "Layouts adapt without relying on media queries, so they hold up in Gmail apps that strip them." },
      { title: "Intentional dark mode", text: "Colour and imagery choices are tuned so dark-mode inversions look designed, not broken." },
      { title: "Locked creativity", text: "Marketers edit copy and imagery while spacing and type stay on-brand." },
    ],
    outcomes: [
      "28 modular email blocks in Klaviyo",
      "Tested across 90+ client and device combinations",
      "Accessible markup with semantic roles and alt text",
    ],
    stack: ["HTML (tables)", "Inline CSS", "MJML", "VML", "Klaviyo", "Litmus"],
    cover: { src: unsplash("1745931492294-a705b9ee4c66"), alt: "A concrete structure reflected in still dark water" },
    gallery: [
      { src: unsplash("1635074155443-6cbf74711dd2"), alt: "Monochrome concrete texture" },
      { src: unsplash("1777734863334-6217dd1af7a6"), alt: "A glowing ring against a muted background" },
    ],
    isConcept: false,
  },
];

/** The four projects featured on the homepage, in display order. */
export const featuredProjectSlugs = ["acommify", "the-coach-huddle", "havera", "nova-architecture"];

export const projectCategories: ProjectCategory[] = [
  "E-commerce",
  "Web Platform",
  "Digital Experience",
  "WordPress",
  "Branding",
  "Email",
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return featuredProjectSlugs
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p));
}

/** Wraps around, so the last project links back to the first. */
export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}
