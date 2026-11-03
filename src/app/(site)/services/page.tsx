import type { Metadata } from "next";
import { services } from "@/data/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallToAction } from "@/components/shared/CallToAction";
import { ServicesNav } from "@/components/sections/services/ServicesNav";
import { ServiceSection } from "@/components/sections/services/ServiceSection";
import { Reveal } from "@/components/animation/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom web development, WordPress, UI/UX design, website redesign, e-commerce, landing pages, branding and HTML email development from Idea Kraft.",
  alternates: { canonical: "/services" },
};

/** The languages and platforms we work in daily, shown as an annotated "source" panel. */
const craft = [
  { lang: "HTML", note: "Semantic, accessible markup: landmarks, headings and forms done properly." },
  { lang: "CSS", note: "Modern layout with grid, container queries, fluid type and design tokens." },
  { lang: "JavaScript / TypeScript", note: "Typed, framework-agnostic logic and progressive enhancement." },
  { lang: "React / Next.js", note: "Server components, static generation and edge-ready apps." },
  { lang: "PHP / WordPress", note: "Bespoke themes, Gutenberg blocks, ACF and WooCommerce." },
  { lang: "Liquid / Shopify", note: "Online Store 2.0 themes and section-based storefronts." },
  { lang: "Email HTML", note: "Table-based, inline-styled, Outlook-proof responsive templates." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        index="01"
        title={["Everything", "you need to", "ship it right."]}
        intro="From a single landing page to a full platform, every engagement is led by senior people and built by hand. Here's what we do, how we do it, and what we build it with."
      />

      {/* Craft panel: highlights the front-end, PHP and email depth behind the services */}
      <section aria-labelledby="craft-title" className="container-x pb-20 md:pb-28">
        <Reveal className="overflow-hidden rounded-[4px] bg-inverse text-inverse-fg">
          <div className="flex items-center justify-between border-b border-inverse-line px-5 py-3 font-mono text-xs text-inverse-muted">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-inverse-line" />
              <span className="size-2.5 rounded-full bg-inverse-line" />
              <span className="size-2.5 rounded-full bg-accent" />
            </span>
            <span>idea-kraft/craft.config</span>
          </div>
          <div className="grid gap-10 p-6 md:grid-cols-12 md:p-12">
            <h2 id="craft-title" className="display-md md:col-span-4">
              Hand-built, front to back.
            </h2>
            <dl className="font-mono text-sm md:col-span-8">
              {craft.map((c, i) => (
                <div key={c.lang} className="grid gap-1 border-b border-inverse-line py-3.5 last:border-0 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="text-accent">
                    <span className="mr-3 text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                    {c.lang}
                  </dt>
                  <dd className="text-inverse-muted">{c.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <div className="container-x grid gap-10 pb-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <ServicesNav items={services.map(({ slug, title }) => ({ slug, title }))} />
        </aside>
        <div className="lg:col-span-9">
          {services.map((service, i) => (
            <ServiceSection key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>

      <CallToAction title={["Not sure", "what you need?"]} text="Most projects mix a few of these. Tell us the goal and we'll shape the right scope with you." />
    </>
  );
}
