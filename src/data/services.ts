import type { Discipline, Service } from "@/types";

/** The six disciplines shown on the homepage. Each links to its detailed section on /services. */
export const disciplines: Discipline[] = [
  {
    title: "Web Development",
    description:
      "Fast, accessible sites engineered on Next.js, React and modern CSS, built so your team can keep shipping after launch.",
    icon: "code",
    href: "/services#custom-web-development",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    title: "UI/UX Design",
    description:
      "Research-backed interfaces where every screen has a job, from first wireframe to a fully specified design system.",
    icon: "layers",
    href: "/services#ui-ux-design",
    tags: ["Research", "Prototyping", "Design systems"],
  },
  {
    title: "Branding & Identity",
    description:
      "Identities built for screens first: wordmarks, type, colour and motion rules that survive contact with real products.",
    icon: "brand",
    href: "/services#branding-creative-design",
    tags: ["Identity", "Art direction", "Guidelines"],
  },
  {
    title: "E-commerce Development",
    description:
      "Storefronts that load fast and sell harder. We build on Shopify and WooCommerce, or go fully headless when that's the better fit.",
    icon: "cart",
    href: "/services#ecommerce-solutions",
    tags: ["Shopify", "WooCommerce", "Headless"],
  },
  {
    title: "Digital Experiences",
    description:
      "Launch sites, campaign pages and interactive stories that are designed to be remembered as well as clicked.",
    icon: "spark",
    href: "/services#landing-page-development",
    tags: ["Campaigns", "Storytelling", "Launches"],
  },
  {
    title: "Creative Development",
    description:
      "WebGL, motion and interaction engineering that turns a static layout into a site you can feel.",
    icon: "cube",
    href: "/services#custom-web-development",
    tags: ["Three.js", "Motion", "WebGL"],
  },
];

export const services: Service[] = [
  {
    slug: "custom-web-development",
    title: "Custom Web Development",
    short: "Hand-built websites and web apps, engineered for speed and longevity.",
    description:
      "We write semantic HTML, modern CSS and typed JavaScript from first principles. No page-builder bloat and no theme you'll fight for the next three years. Each build is component-driven, accessible to WCAG 2.2 AA, and tuned against real-device Core Web Vitals, not just a lab score.",
    icon: "code",
    offerings: [
      "Marketing sites and multi-page web applications",
      "Component libraries and design-system implementation",
      "Headless CMS integration (Sanity, Contentful, Strapi)",
      "Interactive and WebGL experiences with Three.js",
      "Performance audits and Core Web Vitals remediation",
      "API integrations, authentication and dashboards",
    ],
    approach: [
      { title: "Architecture first", text: "We map content, data and routes before writing UI, so the codebase grows without rewrites." },
      { title: "Components, not pages", text: "Every section is a reusable, documented component that your team can compose into new pages." },
      { title: "Measured in the field", text: "We test on mid-range Android over throttled networks, because that's where real users are." },
    ],
    technologies: ["HTML5", "CSS / Tailwind", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Three.js"],
    relatedProjects: ["havera", "the-coach-huddle"],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    short: "Custom WordPress themes and plugins that editors love and developers can maintain.",
    description:
      "WordPress still powers a huge share of the web, and done properly it's a superb editorial tool. We build bespoke themes in PHP with custom Gutenberg blocks and Advanced Custom Fields. No bloated multipurpose themes. Your editors get exactly the controls they need and nothing that can break the layout.",
    icon: "wordpress",
    offerings: [
      "Bespoke theme development from your designs",
      "Custom Gutenberg blocks and block patterns",
      "Advanced Custom Fields (ACF) and custom post types",
      "Plugin development and third-party integrations",
      "Theme migrations off page builders",
      "Security hardening, caching and hosting setup",
    ],
    approach: [
      { title: "Editor-first modelling", text: "We design the admin experience alongside the front end, so publishing is quick and safe." },
      { title: "Lean PHP templates", text: "Clean template hierarchy, escaped output and no unnecessary plugins means fewer updates and fewer vulnerabilities." },
      { title: "Documented handover", text: "Every block and field is documented, and your team gets a recorded walkthrough." },
    ],
    technologies: ["PHP", "WordPress", "Gutenberg", "ACF Pro", "WooCommerce", "MySQL", "JavaScript", "SCSS"],
    relatedProjects: ["nova-architecture"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    short: "Interfaces grounded in research and refined until they feel effortless.",
    description:
      "Good interface design is mostly decisions about what to leave out. We start with your users and your numbers, then move from flows to wireframes to high-fidelity prototypes you can click through and test before a line of production code is written.",
    icon: "layers",
    offerings: [
      "User research, interviews and journey mapping",
      "Information architecture and user flows",
      "Wireframes and interactive prototypes",
      "High-fidelity UI design for web and product",
      "Design systems and component documentation",
      "Usability testing and accessibility reviews",
    ],
    approach: [
      { title: "Evidence over opinion", text: "Analytics, interviews and heuristic reviews tell us where the friction really is." },
      { title: "Prototype early", text: "Clickable prototypes in week two surface problems while they're still cheap to fix." },
      { title: "Built to be built", text: "Every design comes with tokens, states and responsive rules, so nothing is lost in handoff." },
    ],
    technologies: ["Figma", "FigJam", "Maze", "Hotjar", "Framer", "Lottie"],
    relatedProjects: ["the-coach-huddle", "acommify"],
  },
  {
    slug: "website-redesign",
    title: "Website Redesign",
    short: "Turn an underperforming site into your best salesperson, without losing what already works.",
    description:
      "Redesigns fail when they start from a blank canvas. We begin with an audit of content, analytics, SEO equity and technical debt, then rebuild with a plan that protects your rankings, migrates content cleanly and gives you a measurable before-and-after.",
    icon: "refresh",
    offerings: [
      "Content, UX and technical audit",
      "SEO-safe URL mapping and 301 redirect plans",
      "Content strategy and copy refinement",
      "Visual redesign and new component library",
      "Platform migration (e.g. page builder → custom build)",
      "Post-launch monitoring and iteration",
    ],
    approach: [
      { title: "Audit before artwork", text: "We benchmark speed, conversions and search visibility before changing anything." },
      { title: "Protect the equity", text: "Redirect maps and structured data are planned up front, so rankings carry over." },
      { title: "Launch, then learn", text: "We compare against the baseline after launch and iterate on what the data shows." },
    ],
    technologies: ["Google Analytics 4", "Search Console", "Screaming Frog", "Next.js", "WordPress", "Figma"],
    relatedProjects: ["nova-architecture", "havera"],
  },
  {
    slug: "ecommerce-solutions",
    title: "E-commerce Solutions",
    short: "Storefronts designed to convert and engineered to scale.",
    description:
      "From a focused Shopify store to a headless commerce build with a custom front end, we design and develop shopping experiences where product pages load fast, filtering feels instant and checkout gets out of the customer's way.",
    icon: "cart",
    offerings: [
      "Shopify theme development (Liquid & Online Store 2.0)",
      "WooCommerce stores on custom WordPress themes",
      "Headless commerce with Next.js and Storefront APIs",
      "Product page, collection and cart optimisation",
      "Payment, shipping and ERP integrations",
      "Conversion audits and A/B test implementation",
    ],
    approach: [
      { title: "Merchandising first", text: "We design around how your customers actually shop: search, filter, compare, decide." },
      { title: "Speed is revenue", text: "Image pipelines, edge caching and lean JavaScript keep product pages fast." },
      { title: "Own your stack", text: "We pick the platform that fits your catalogue and team rather than our own preference." },
    ],
    technologies: ["Shopify", "Liquid", "WooCommerce", "Stripe", "Next.js", "Storefront API", "Klaviyo"],
    relatedProjects: ["acommify", "kiln-and-form"],
  },
  {
    slug: "landing-page-development",
    title: "Landing Page Development",
    short: "Single-purpose pages and campaign experiences built to perform.",
    description:
      "A landing page has one job. We build focused, high-converting pages for launches, campaigns and paid traffic. Each one is responsive, lightweight, easy to A/B test, and wired into your analytics and CRM from day one.",
    icon: "target",
    offerings: [
      "Campaign and product-launch landing pages",
      "Interactive storytelling and scroll experiences",
      "Lead capture with CRM and email integrations",
      "A/B test variants and analytics instrumentation",
      "Hand-coded HTML/CSS/JS or framework builds",
      "Reusable page templates for your marketing team",
    ],
    approach: [
      { title: "One goal per page", text: "Every element is judged by whether it moves a visitor toward the single action that matters." },
      { title: "Message match", text: "Copy and visuals are aligned to the ad or email that brought the visitor there." },
      { title: "Ship and test", text: "We build pages to be iterated, with variants that are cheap to spin up and easy to measure." },
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Next.js", "Motion", "HubSpot", "Google Tag Manager"],
    relatedProjects: ["havera", "acommify"],
  },
  {
    slug: "branding-creative-design",
    title: "Branding & Creative Design",
    short: "Identity systems with a point of view, designed for screens first.",
    description:
      "We build brands from strategy outward: positioning, naming support, wordmark, typography, colour and a motion language. The result is a system with real rules, delivered as guidelines and production-ready assets your team can use straight away.",
    icon: "brand",
    offerings: [
      "Brand strategy and positioning workshops",
      "Logo, wordmark and visual identity design",
      "Typography, colour and layout systems",
      "Motion principles and animated brand assets",
      "Brand guidelines and asset libraries",
      "Social, pitch-deck and campaign creative",
    ],
    approach: [
      { title: "Strategy as the brief", text: "Positioning work comes first, so every visual decision has a reason you can defend." },
      { title: "Design in context", text: "We test identities on real screens, products and ads, not on empty artboards." },
      { title: "Systems that scale", text: "Clear rules let your team extend the brand without diluting it." },
    ],
    technologies: ["Figma", "Adobe Illustrator", "After Effects", "Glyphs", "Blender"],
    relatedProjects: ["kiln-and-form", "havera"],
  },
  {
    slug: "email-template-development",
    title: "Email Template Development",
    short: "Responsive, bulletproof HTML email that renders everywhere, including Outlook.",
    description:
      "Email is still the highest-ROI channel most brands have, and still the hardest to code. We hand-build table-based, inline-styled templates that hold up in Outlook, Gmail, Apple Mail and dark mode, then package them as modular systems in your ESP so your marketers can build campaigns without breaking them.",
    icon: "mail",
    offerings: [
      "Responsive HTML email templates (hand-coded or MJML)",
      "Modular template systems for Klaviyo, Mailchimp, HubSpot",
      "Dark-mode and accessibility-aware email design",
      "Transactional email templates for apps and stores",
      "Cross-client QA across 90+ clients and devices",
      "Template documentation and team training",
    ],
    approach: [
      { title: "Tables, done right", text: "Hybrid fluid layouts with VML fallbacks keep designs intact in desktop Outlook." },
      { title: "Modular by default", text: "Content blocks are locked where they need to be and flexible where marketers need room." },
      { title: "Tested, not hoped", text: "Every template is screenshot-tested across clients before it's handed over." },
    ],
    technologies: ["HTML (tables)", "Inline CSS", "MJML", "VML", "Litmus", "Email on Acid", "Klaviyo", "Mailchimp"],
    relatedProjects: ["tidewater"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
