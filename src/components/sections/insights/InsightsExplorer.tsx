"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useDeferredValue, useId, useState } from "react";
import type { Post, PostCategory } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { cn } from "@/lib/utils";

type Filter = PostCategory | "All";

/** Client-side search and category filtering over the (already server-rendered) article list. */
export function InsightsExplorer({ posts, categories }: { posts: Post[]; categories: PostCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All");
  const deferredQuery = useDeferredValue(query);
  const inputId = useId();

  const q = deferredQuery.trim().toLowerCase();
  const results = posts.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (!q) return true;
    return [p.title, p.excerpt, p.category].some((field) => field.toLowerCase().includes(q));
  });

  const reset = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-my-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
          {(["All", ...categories] as Filter[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm transition-colors",
                category === c ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg hover:text-fg",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative lg:w-80">
          <label htmlFor={inputId} className="sr-only">
            Search articles
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="h-11 w-full rounded-full border border-line bg-raised pr-11 pl-11 text-sm transition-colors outline-none placeholder:text-muted focus:border-fg [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "article" : "articles"}
        {category !== "All" && ` in ${category}`}
        {q && ` matching “${deferredQuery.trim()}”`}
      </p>

      {results.length > 0 ? (
        <motion.ul layout className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((post) => (
              <motion.li
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ArticleCard post={post} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-10 rounded-[3px] border border-dashed border-line-strong px-6 py-20 text-center">
          <p className="display-sm">Nothing matches that yet.</p>
          <p className="mt-3 text-muted">Try a different word, or browse every article.</p>
          <button type="button" onClick={reset} className="mt-6 h-11 rounded-full bg-fg px-6 text-sm text-bg">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
