import { unsplash } from "@/lib/images";
import type { Post, PostBlock, PostCategory } from "@/types";

/**
 * Local article data. Each post is rendered at /insights/[slug].
 * To move to a CMS or MongoDB later, keep the `Post` shape and replace the
 * functions at the bottom of this file. The pages only call those functions.
 */
export const posts: Post[] = [
  {
    slug: "why-your-website-feels-slow",
    title: "Why your website feels slow, even when Lighthouse says it isn't",
    excerpt:
      "A green score in a lab test doesn't mean real users are having a fast experience. Here's how we measure what people actually feel.",
    category: "Performance",
    date: "2026-10-14",
    author: "Novara Studio",
    featured: true,
    cover: { src: unsplash("1647790292957-c7f3b44b3973"), alt: "A minimal desk setup with a monitor, keyboard and headphones" },
    body: [
      { type: "p", text: "Lighthouse runs on a simulated device with a simulated network, once. Your visitors run your site on a three-year-old Android phone, on a train, with twelve browser tabs open. Those are different things, and treating the first as a proxy for the second is how teams end up with a 98 performance score and a bounce-rate problem." },
      { type: "h2", text: "Lab data versus field data" },
      { type: "p", text: "Lab data is reproducible and great for catching regressions. Field data, collected from real sessions through the Chrome UX Report or your own real-user monitoring, tells you what people actually experienced. Core Web Vitals are assessed on field data at the 75th percentile, so a quarter of your visitors can have a worse experience than the number you see." },
      { type: "h2", text: "The usual suspects" },
      { type: "list", items: [
        "Interaction to Next Paint (INP): long JavaScript tasks block the main thread, so taps feel ignored. Third-party tags are the most common cause.",
        "Largest Contentful Paint (LCP): the hero image is lazy-loaded, discovered late, or served at desktop size to phones.",
        "Cumulative Layout Shift (CLS): fonts swap without matched fallbacks, or banners inject themselves above content.",
      ] },
      { type: "quote", text: "Performance is a feeling before it is a number. Optimise for the moment a person taps and waits." },
      { type: "h2", text: "What we actually do" },
      { type: "p", text: "We start every performance engagement by pulling 28 days of field data, then reproducing the worst sessions on a real mid-range device. Fixes are prioritised by how many users they affect, not by how satisfying they are to implement. Usually that means auditing third-party scripts, preloading the true LCP element, and breaking up long tasks." },
      { type: "code", text: "// Yield to the main thread between chunks of work\nawait scheduler.yield?.() ?? new Promise((r) => setTimeout(r, 0));" },
      { type: "p", text: "None of this is glamorous, but it's the difference between a site that tests well and a site that feels fast." },
    ],
  },
  {
    slug: "designing-motion-that-earns-its-place",
    title: "Designing motion that earns its place",
    excerpt:
      "Animation can guide attention, explain change and add character. Or it can just get in the way. A practical framework for telling the difference.",
    category: "Design",
    date: "2026-09-02",
    author: "Novara Studio",
    cover: { src: unsplash("1762361962969-9e1484e8c8b5"), alt: "Soft abstract curved shapes in neutral tones" },
    body: [
      { type: "p", text: "Every animation asks the user for a little time and attention. Good motion repays that with clarity or delight. Bad motion charges the fee and gives nothing back. Before we animate anything, we ask what job the movement is doing." },
      { type: "h2", text: "Three jobs motion can do" },
      { type: "list", items: [
        "Orientation: showing where something came from or went, like a drawer sliding in from the edge it lives behind.",
        "Feedback: confirming that an action registered, like a button that compresses on press.",
        "Character: expressing the brand's personality through timing, easing and choreography.",
      ] },
      { type: "p", text: "If an animation does none of these, it goes. If it does one, it should do it quickly. Most UI transitions should resolve in 200 to 500 milliseconds. Hero moments can take longer because they happen once." },
      { type: "h2", text: "Easing is the brand voice" },
      { type: "p", text: "Linear motion feels mechanical. A strong ease-out, quick to start and slow to settle, feels confident and premium. Springs feel playful and physical. Picking one easing family and using it consistently does more for a brand's feel than any single flourish." },
      { type: "quote", text: "Restraint is what makes the one big moment feel big." },
      { type: "h2", text: "Respect the opt-out" },
      { type: "p", text: "Some people experience nausea or distraction from motion and tell their operating system to reduce it. The prefers-reduced-motion media query exposes that choice. We treat it as a design constraint, not an afterthought: content appears in its final state, parallax is disabled, and nothing loops." },
    ],
  },
  {
    slug: "bulletproof-html-email",
    title: "Bulletproof HTML email: what still breaks, and how to fix it",
    excerpt:
      "Email clients are a museum of rendering engines. Here's the short list of techniques that keep our templates intact from Outlook to iOS.",
    category: "Development",
    date: "2026-07-21",
    author: "Novara Studio",
    cover: { src: unsplash("1745931492294-a705b9ee4c66"), alt: "A concrete structure mirrored in dark still water" },
    body: [
      { type: "p", text: "Desktop Outlook on Windows renders HTML with Microsoft Word's engine. Gmail strips some styles, and its apps ignore media queries for some account types. Dark mode inverts colours differently in every client. If that sounds chaotic, it is, but it's predictable chaos, and a handful of habits handles most of it." },
      { type: "h2", text: "Tables for structure, always" },
      { type: "p", text: "Flexbox and grid are still not dependable across email clients. We lay out every email with nested tables using role=\"presentation\" so screen readers don't announce them as data tables." },
      { type: "code", text: "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n  <tr>\n    <td style=\"padding:24px; font-family:Arial, sans-serif;\">…</td>\n  </tr>\n</table>" },
      { type: "h2", text: "Hybrid, fluid layouts" },
      { type: "p", text: "Instead of relying on media queries to stack columns, hybrid layouts use inline-block elements with max-widths that wrap naturally on small screens. Outlook gets fixed-width ghost tables in conditional comments." },
      { type: "h2", text: "Design for dark mode on purpose" },
      { type: "list", items: [
        "Avoid pure black text on pure white. Partial inversions handle off-tones more gracefully.",
        "Give transparent PNG logos a subtle stroke so they don't vanish on dark backgrounds.",
        "Use the color-scheme meta and prefers-color-scheme styles where they're supported, and test where they aren't.",
      ] },
      { type: "quote", text: "In email, 'works on my machine' means nothing. Screenshot-test every client before you send." },
      { type: "p", text: "Finally, keep total HTML under about 100 KB. Gmail clips anything larger, which hides your footer and unsubscribe link and can hurt deliverability." },
    ],
  },
  {
    slug: "headless-or-wordpress",
    title: "Headless or WordPress? An honest decision guide",
    excerpt:
      "The right platform depends on your team, content and budget, not on what's fashionable. A framework we use with clients.",
    category: "Strategy",
    date: "2026-05-30",
    author: "Novara Studio",
    cover: { src: unsplash("1695712551846-4dc15433fbd4"), alt: "A designer working at a table in a bright studio" },
    body: [
      { type: "p", text: "We build both: bespoke WordPress themes in PHP, and headless front ends in Next.js. Clients often arrive convinced they need one or the other. Usually the answer comes from three questions about the people who will run the site after launch." },
      { type: "h2", text: "1. Who publishes, and how often?" },
      { type: "p", text: "If a marketing or editorial team publishes daily and wants to preview layouts as they work, a well-built WordPress theme with custom Gutenberg blocks is hard to beat. The editing experience is mature and familiar." },
      { type: "h2", text: "2. Where else does the content need to go?" },
      { type: "p", text: "If the same content feeds a website, an app and in-store screens, a headless CMS with structured content pays for itself. Content is modelled once and rendered anywhere." },
      { type: "h2", text: "3. Who maintains the code?" },
      { type: "list", items: [
        "A team with PHP experience, or a reliance on agency support → WordPress is lower risk.",
        "An in-house JavaScript team → a headless Next.js build fits their skills.",
        "No developers at all → choose the simplest platform that meets your needs, and budget for updates.",
      ] },
      { type: "quote", text: "The best platform is the one your team will still be happy using in three years." },
      { type: "p", text: "There's also a middle path: WordPress as a headless CMS behind a Next.js front end. It keeps a familiar editor and gives you a modern front end, at the cost of more moving parts. We recommend it only when both halves earn their keep." },
    ],
  },
  {
    slug: "type-led-branding",
    title: "Type-led branding for small teams",
    excerpt:
      "You don't need an illustrated mascot or a custom icon set to build a memorable brand. You need a typeface with a point of view, used with discipline.",
    category: "Branding",
    date: "2026-03-18",
    author: "Novara Studio",
    cover: { src: unsplash("1530543787849-128d94430c6b"), alt: "A painted wall in soft yellow and white" },
    body: [
      { type: "p", text: "Small teams often over-invest in brand assets they can't maintain, like illustration systems that need an illustrator for every new page. Typography is the opposite: once it's chosen and the rules are written, anyone on the team can apply it consistently." },
      { type: "h2", text: "Choose one voice, then a quiet partner" },
      { type: "p", text: "Pick a display face with real character for headlines, then pair it with a neutral, highly readable body face. Two families is almost always enough. Variable fonts let you get weight and width contrast from a single file." },
      { type: "h2", text: "Rules worth writing down" },
      { type: "list", items: [
        "A fluid type scale with no more than six steps.",
        "Tracking values for display sizes (tighter) and small caps labels (looser).",
        "Maximum line length for body copy, usually 60 to 75 characters.",
        "When, if ever, the display face may be used in all caps.",
      ] },
      { type: "quote", text: "Consistency is a brand asset. Type is the cheapest way to buy it." },
      { type: "p", text: "Get those rules right and your website, decks, social posts and invoices will start to look like they came from the same company, which is most of what branding is." },
    ],
  },
  {
    slug: "shipping-3d-without-killing-mobile",
    title: "Shipping 3D on the web without killing mobile",
    excerpt:
      "Real-time 3D can make a site unforgettable, or make it unusable. How we budget, lazy-load and gracefully degrade WebGL scenes.",
    category: "Development",
    date: "2026-01-27",
    author: "Novara Studio",
    cover: { src: unsplash("1777734863334-6217dd1af7a6"), alt: "A luminous ring against a muted backdrop" },
    body: [
      { type: "p", text: "A WebGL hero is a promise that the rest of the site is just as considered. Break that promise with a janky scroll or a hot phone, and the 3D becomes a liability. We treat every scene as a feature with a budget." },
      { type: "h2", text: "Load it last, and only if it will run" },
      { type: "p", text: "Three.js and its renderer shouldn't block your first paint. We dynamically import the scene after the page is interactive, and only when the device has a fine pointer, a reasonably wide viewport and no reduced-motion preference." },
      { type: "code", text: "const canRender3D =\n  matchMedia(\"(min-width: 768px) and (pointer: fine)\").matches &&\n  !matchMedia(\"(prefers-reduced-motion: reduce)\").matches;" },
      { type: "h2", text: "Spend polygons in the shader" },
      { type: "p", text: "Rather than loading heavy models, we often displace simple geometry in a vertex shader. A single icosahedron with noise can look organic and alive at a fraction of the download cost." },
      { type: "list", items: [
        "Cap device pixel ratio at 1.5 to 2. Retina phones don't need 3× render targets.",
        "Pause the render loop when the canvas scrolls out of view.",
        "Provide a designed fallback, not an empty box, for devices that don't get the scene.",
      ] },
      { type: "quote", text: "The best 3D on the web is the 3D nobody notices is expensive." },
      { type: "p", text: "Handled this way, 3D stops being a performance risk and becomes what it should be: a memorable moment in an otherwise fast, accessible site." },
    ],
  },
];

export const postCategories: PostCategory[] = ["Design", "Development", "Strategy", "Performance", "Branding"];

function wordCount(blocks: PostBlock[]) {
  return blocks.reduce((total, block) => {
    const text = block.type === "list" ? block.items.join(" ") : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

/** Reading time at ~220 words per minute, minimum one minute. */
export function readingTime(post: Post) {
  return Math.max(1, Math.round(wordCount(post.body) / 220));
}

export function getAllPosts() {
  return [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPost(slug);
  if (!current) return [];
  const others = getAllPosts().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
