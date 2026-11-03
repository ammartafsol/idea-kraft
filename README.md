# NOVARA STUDIO

Marketing website for **Novara Studio**, a fictional creative digital agency.
*We Build Digital Experiences That Move Brands Forward.*

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion and React Three Fiber.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see "Environment" below
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Development server (Turbopack)                  |
| `npm run build`     | Production build                                |
| `npm start`         | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | TypeScript, no emit                             |
| `npm test`          | Vitest unit tests                               |
| `npm run ci`        | Lint, typecheck, test and build in one go       |

## Environment

| Variable               | Required | Purpose                                                                                                                |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Canonical URLs, sitemap, robots and Open Graph.                                                              |
| `MONGODB_URI`          | For the admin panel | MongoDB Atlas connection string. Stores analytics and contact enquiries. Use a different database name locally (e.g. `/novara_dev`) than in production (`/novara`). |
| `ADMIN_SESSION_SECRET` | For the admin panel | Random string (32+ chars) that signs the admin session cookie. Changing it signs everyone out. |
| `CONTACT_WEBHOOK_URL`  | No       | Each valid contact submission is POSTed here as JSON (Slack, Discord, Zapier, Make, n8n or your own API). Without it, submissions are logged to the server console. |

## Replacing the placeholder content

Everything editable lives in `src/data/`. No component hard-codes content.

| What                         | Where                       | Notes |
| ---------------------------- | --------------------------- | ----- |
| Name, email, availability, response time | `src/data/site.ts` | `availability` drives every status pill. |
| Social links                 | `src/data/site.ts`          | Replace the placeholder URLs. |
| **Your projects**            | `src/data/projects.ts`      | Acommify, The Coach Huddle and Havera are reserved slots for your real case studies. Put screenshots in `public/work/<slug>/`, point `cover.src` and `gallery[].src` at them (e.g. `"/work/acommify/cover.jpg"`), update the copy, then set `isConcept: false` to remove the "Concept" badge. Recommended cover: 2400×1500. |
| Homepage featured projects   | `featuredProjectSlugs` in `src/data/projects.ts` | Order matters. |
| Services                     | `src/data/services.ts`      | `disciplines` (homepage) and `services` (services page). |
| Articles                     | `src/data/posts.ts`         | Reading time is calculated automatically. |
| Team, testimonials, stats, process, values | `src/data/studio.ts` | **Testimonials, stats, team profiles and brand names are illustrative placeholders** and are labelled as such on the site. Replace them with real, verifiable content before launch. |

Adding a project or article is a matter of adding an object. Its page, sitemap entry and next/previous links are generated automatically.

Photography is loaded from Unsplash's CDN via `next/image` (see `src/lib/images.ts`). Swap URLs for local files in `/public` whenever you like.

## Architecture

```
src/
├─ app/                     Routes (App Router). Server Components by default.
│  ├─ api/contact/route.ts  Validated, rate-limited, spam-protected contact endpoint
│  ├─ work/[slug]/          Statically generated case studies
│  ├─ insights/[slug]/      Statically generated articles
│  ├─ opengraph-image.tsx   Generated social card
│  └─ sitemap.ts, robots.ts, manifest.ts, icon.svg, not-found.tsx, error.tsx, template.tsx
├─ components/
│  ├─ animation/            Reveal, SplitText, ImageReveal, Parallax, Counter, Marquee, Magnetic, ScrollHighlight
│  ├─ layout/               Navbar, MobileMenu, Footer, ThemeToggle, PageLoader, ScrollProgress, BackToTop, CursorFollower
│  ├─ sections/             Page-specific sections (home, about, services, work, insights, contact)
│  ├─ shared/               Cross-page blocks (PageHeader, SectionHeader, ProjectCard, CallToAction, JsonLd)
│  ├─ three/                Hero WebGL scene and its device-aware loader
│  └─ ui/                   Buttons, logo, icons, labels
├─ data/                    All site content
├─ hooks/                   useTheme, useMediaQuery
├─ lib/                     Utilities, contact schema, rate limiter, theme script
└─ types/                   Shared TypeScript types
```

### Decisions worth knowing

- **MongoDB only where it earns its place.** Site content stays in typed files under `src/data/*`. MongoDB (via Mongoose, `src/lib/db`) stores only what genuinely needs a database: analytics events and contact enquiries for the admin panel. Without `MONGODB_URI` the public site works normally and the contact form falls back to the webhook or server log.
- **Theme without flash.** An inline script in `<head>` sets `data-theme` before first paint (saved choice, then OS preference). React reads it through `useSyncExternalStore`, so there's no context and no effect. Switching uses the View Transitions API for a circular reveal, with a colour cross-fade where that isn't supported.
- **3D only where it pays off.** Three.js is dynamically imported only on devices with a fine pointer, a ≥768px viewport, WebGL and no reduced-motion preference. Everyone else gets a CSS-rendered orb. The render loop pauses when the hero is off-screen.
- **Reduced motion.** `MotionConfig reducedMotion="user"` plus a global CSS rule disable transforms, parallax, marquees, the intro loader and the cursor follower.
- **Contact endpoint.** Shared Zod schema (client and server), same-origin check, content-type and body-size limits, per-IP rate limiting (in memory; swap `src/lib/rate-limit.ts` for Redis on multi-instance hosting), honeypot field and a minimum fill-time trap.

## Admin panel (`/admin`)

A private dashboard at `/admin`. It isn't linked anywhere on the site, is excluded from `robots.txt`, and sends `noindex`.

| View | What it shows |
| ---- | ------------- |
| **Overview** | Unique visitors, page views, sessions, new vs returning visitors, pages per session, average time on page, bounce rate, enquiries and conversion rate, each compared with the previous period. Daily traffic chart (hourly for "Today"), top pages, sources, devices, browsers, countries. |
| **Pages** | Every page with views, unique visitors, entrances and average time. Sortable and searchable. |
| **Visitors** | Session log with each visitor's journey through the site, filters for new/returning and device, operating systems and `utm_source` campaigns. |
| **Inquiries** | Contact-form submissions with a New → Read → Replied → Archived pipeline, search, the visitor's page journey before they got in touch, reply-by-email and CSV export. |

All views share date filters (Today, 7/30/90 days, 12 months, custom range), counted in the studio's time zone.

**How visitors are counted:** the site records page views with its own lightweight tracker (`src/components/analytics/Analytics.tsx` → `/api/track`). A random, anonymous ID kept in the visitor's browser tells unique and returning visitors apart, and a per-tab session ID (30-minute timeout) gives sessions and bounce rate. No cookies are set for visitors and no IP addresses are stored, only a country code from the hosting platform. Bots are ignored, and visitors with Do Not Track or Global Privacy Control enabled are not tracked at all.

**Admin accounts** are stored in MongoDB (`admins` collection) with passwords hashed using scrypt, never in plain text or env vars:

```bash
npm run admin:create                          # create or reset an admin (development DB, .env.local)
npm run admin:create -- --env .env.vercel     # same, against the production DB
npm run admin:create -- --list                # list admins
npm run admin:create -- --delete <username>   # remove an admin
```

**Security:** sign-in is rate-limited, and checks the hash in constant time (unknown usernames take as long as wrong passwords). Deleting an admin revokes their access immediately. The session is a signed, HTTP-only cookie (7 days). `src/proxy.ts` redirects signed-out requests, and every admin page, server action and export route checks the session again.

## Deployment

Works on any Node host or Vercel. A multi-stage `Dockerfile` (standalone output) is included:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com -t novara .
docker run -p 3000:3000 -e CONTACT_WEBHOOK_URL=… novara
```
