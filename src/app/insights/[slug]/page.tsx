import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPost, getRelatedPosts, readingTime } from "@/data/posts";
import { siteConfig } from "@/data/site";
import type { PostBlock } from "@/types";
import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { ArticleCard } from "@/components/sections/insights/ArticleCard";
import { ShareButtons } from "@/components/sections/insights/ShareButtons";
import { JsonLd } from "@/components/shared/JsonLd";
import { LogoMark } from "@/components/ui/Logo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.cover.src, alt: post.cover.alt }],
    },
  };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre>
          <code>{block.text}</code>
        </pre>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);
  const minutes = readingTime(post);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.cover.src,
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          mainEntityOfPage: `${siteConfig.url}/insights/${post.slug}`,
        }}
      />

      <article>
        <header className="container-x pt-32 md:pt-44">
          <Link href="/insights" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            All insights
          </Link>
          <div className="mt-10 max-w-5xl">
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
              <span className="rounded-full bg-accent px-2.5 py-1 text-accent-ink">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{minutes} min read</span>
            </p>
            <SplitText as="h1" immediate delay={0.2} lines={[post.title]} className="display-lg mt-8 text-balance" />
            <Reveal delay={0.4}>
              <p className="lede mt-8 text-muted">{post.excerpt}</p>
            </Reveal>
          </div>
        </header>

        <div className="container-x mt-14 md:mt-20">
          <ImageReveal src={post.cover.src} alt={post.cover.alt} priority sizes="(min-width: 1536px) 1440px, 100vw" className="aspect-[16/10] rounded-[3px] md:aspect-[21/9]" />
        </div>

        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="flex items-center gap-3 lg:sticky lg:top-28 lg:flex-col lg:items-start">
              <LogoMark className="size-10" />
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted">Studio journal</p>
              </div>
            </div>
          </aside>
          <div className="prose-novara lg:col-span-7">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <div className="!mt-16 border-t border-line pt-8">
              <p className="eyebrow mb-4 text-muted">Share this article</p>
              <ShareButtons title={post.title} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-surface/60">
          <div className="container-x section-y">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-title" className="display-lg">
                Keep reading
              </h2>
              <Link href="/insights" className="underline decoration-1 underline-offset-4 hover:text-accent-text">
                All articles
              </Link>
            </div>
            <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ArticleCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
