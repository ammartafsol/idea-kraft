import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types";
import { readingTime } from "@/data/posts";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ post, headingLevel = "h3" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group">
      <Link href={`/insights/${post.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-surface">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-bg/85 px-3 py-1 text-xs backdrop-blur">{post.category}</span>
        </div>
        <p className="mt-5 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingTime(post)} min read
        </p>
        <Heading className="mt-3 font-display text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </Heading>
        <p className="mt-3 line-clamp-2 text-muted">{post.excerpt}</p>
      </Link>
    </article>
  );
}
