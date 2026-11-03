import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, postCategories, readingTime } from "@/data/posts";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallToAction } from "@/components/shared/CallToAction";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { Reveal } from "@/components/animation/Reveal";
import { InsightsExplorer } from "@/components/sections/insights/InsightsExplorer";
import { TextLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from the studio on design, front-end development, performance, WordPress, HTML email and brand strategy.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        index="01"
        title={["Notes from", "the studio."]}
        intro="Practical writing on design, engineering and the details in between. No growth hacks, just what we've learned shipping real work."
      />

      <section aria-labelledby="featured-title" className="container-x pb-24 md:pb-32">
        <Link href={`/insights/${featured.slug}`} className="group grid gap-8 md:grid-cols-12 md:items-end">
          <ImageReveal
            src={featured.cover.src}
            alt={featured.cover.alt}
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="aspect-[4/3] rounded-[3px] md:col-span-7"
            imageClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <Reveal delay={0.2} className="md:col-span-5">
            <p className="eyebrow text-accent-text">Featured · {featured.category}</p>
            <h2 id="featured-title" className="display-md mt-5 text-balance">
              {featured.title}
            </h2>
            <p className="mt-5 text-muted">{featured.excerpt}</p>
            <p className="mt-6 font-mono text-xs text-muted">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time> · {readingTime(featured)} min read
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-medium underline decoration-1 underline-offset-4 transition-colors group-hover:text-accent-text">
              Read the article →
            </span>
          </Reveal>
        </Link>
      </section>

      <section aria-label="All articles" className="container-x pb-28 md:pb-40">
        <InsightsExplorer posts={posts} categories={postCategories} />
        <div className="mt-20 text-center">
          <TextLink href="/contact">Want us to write about something? Tell us</TextLink>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
