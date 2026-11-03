import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallToAction } from "@/components/shared/CallToAction";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { Parallax } from "@/components/animation/Parallax";
import { Reveal } from "@/components/animation/Reveal";
import { ScrollHighlight } from "@/components/animation/ScrollHighlight";
import { Marquee } from "@/components/animation/Marquee";
import { ValuesAccordion } from "@/components/sections/about/ValuesAccordion";
import { TeamGrid } from "@/components/sections/about/TeamGrid";
import { Eyebrow, PlaceholderNote } from "@/components/ui/Eyebrow";
import { unsplash } from "@/lib/images";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Novara Studio is a small, senior team of designers and engineers building websites and digital products for ambitious brands. Meet the studio, our philosophy and our values.",
  alternates: { canonical: "/about" },
};

const designPrinciples = [
  { title: "Hierarchy before decoration", text: "If the most important thing on the page isn't obvious in two seconds, no amount of polish will save it." },
  { title: "Type does the heavy lifting", text: "A confident typographic system carries a brand further than illustrations and effects ever will." },
  { title: "Design the edges", text: "Empty states, errors and loading moments get designed with the same care as the hero." },
];

const devPrinciples = [
  { title: "Semantic first", text: "Real HTML elements, real headings, real buttons. Accessibility starts in the markup, not in an overlay." },
  { title: "Budgets, not hopes", text: "JavaScript, image and font budgets are agreed up front and tested on mid-range phones." },
  { title: "Readable over clever", text: "Typed, documented, component-driven code that the next developer can pick up in an afternoon." },
];

const capabilities = ["Strategy", "Art Direction", "UI/UX", "Next.js", "WordPress", "Shopify", "WebGL", "Motion", "HTML Email", "Accessibility", "Performance", "SEO"];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the studio"
        index="01"
        title={["Small studio.", "Serious craft."]}
        intro="Novara is an independent creative digital agency: a compact, senior team of designers and engineers who'd rather do fewer projects exceptionally well than many projects adequately."
      />

      {/* Story: asymmetric image pair */}
      <section aria-label="Our story" className="container-x pb-24 md:pb-40">
        <div className="grid gap-8 md:grid-cols-12">
          <ImageReveal
            src={unsplash("1695712551846-4dc15433fbd4")}
            alt="A designer working through printed layouts at a studio table"
            sizes="(min-width: 768px) 58vw, 100vw"
            priority
            className="aspect-[4/3] md:col-span-7"
          />
          <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
            <Parallax offset={60}>
              <ImageReveal
                src={unsplash("1756723902378-7073227e8ece", 1200)}
                alt="A bright studio desk with a laptop previewing a 3D model"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[3/4]"
              />
            </Parallax>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-12">
          <Eyebrow index="02" className="self-start md:col-span-3 md:pt-4">
            Our story
          </Eyebrow>
          <ScrollHighlight
            className="display-md md:col-span-9"
            text="We started Novara because we kept seeing the same gap: beautiful designs that fell apart in the browser, and solid code that nobody felt anything about. We built a studio where designers and engineers share one table, one standard and one goal: work people remember."
          />
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-labelledby="mission-title" className="border-y border-line">
        <h2 id="mission-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="container-x grid md:grid-cols-2">
          {[
            { label: "Mission", text: "To help ambitious brands earn attention and trust online through work that's as considered in the code as it is on the canvas." },
            { label: "Vision", text: "A web where fast, accessible and genuinely beautiful is the default, not the premium tier." },
          ].map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 0.1}
              className={i === 1 ? "py-16 md:border-l md:border-line md:py-24 md:pl-12" : "border-b border-line py-16 md:border-b-0 md:py-24 md:pr-12"}
            >
              <p className="eyebrow text-accent-text">{item.label}</p>
              <p className="display-sm mt-6 max-w-xl">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy: design vs development */}
      <section aria-labelledby="philosophy-title" className="section-y">
        <div className="container-x">
          <SectionHeader
            index="03"
            eyebrow="Philosophy"
            titleId="philosophy-title"
            title={["Two crafts,", "one standard."]}
            aside={<p className="text-muted">Design and development aren’t sequential steps here. They’re two halves of the same decision.</p>}
          />
          <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-2 md:gap-12">
            {[
              { heading: "Design philosophy", items: designPrinciples },
              { heading: "Development philosophy", items: devPrinciples },
            ].map((col) => (
              <div key={col.heading}>
                <h3 className="eyebrow border-b border-fg pb-4">{col.heading}</h3>
                <ol>
                  {col.items.map((p, i) => (
                    <Reveal as="li" key={p.title} delay={i * 0.08} className="grid grid-cols-[3rem_1fr] border-b border-line py-8">
                      <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                      <div>
                        <h4 className="display-sm">{p.title}</h4>
                        <p className="mt-3 text-muted">{p.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities band */}
      <section aria-label="Capabilities" className="overflow-hidden bg-inverse py-10 text-inverse-fg md:py-14">
        <Marquee duration={50}>
          {capabilities.map((c) => (
            <span key={c} className="flex items-center gap-10 px-5 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none font-bold tracking-[-0.03em] whitespace-nowrap">
              {c}
              <span aria-hidden className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="section-y">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Eyebrow index="04">Values</Eyebrow>
              <h2 id="values-title" className="display-lg mt-6">
                What we
                <br />
                stand for.
              </h2>
            </div>
          </div>
          <div className="md:col-span-8">
            <ValuesAccordion />
          </div>
        </div>
      </section>

      {/* Team */}
      <section aria-labelledby="team-title" className="section-y bg-surface/60">
        <div className="container-x">
          <SectionHeader
            index="05"
            eyebrow="The team"
            titleId="team-title"
            title={["The people", "behind the work."]}
            aside={<PlaceholderNote>Placeholder profiles: replace in src/data/studio.ts</PlaceholderNote>}
          />
          <div className="mt-16 md:mt-24">
            <TeamGrid />
          </div>
        </div>
      </section>

      <CallToAction title={["Like how", "we think?"]} text="Tell us what you're building. We'll tell you honestly whether we're the right studio for it." />
    </>
  );
}
