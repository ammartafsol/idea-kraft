"use client";

import { useEffect, useState } from "react";
import { cn, pad } from "@/lib/utils";

/** Sticky in-page index for /services that highlights the section currently in view. */
export function ServicesNav({ items }: { items: { slug: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);

  // IntersectionObserver is an external browser API; subscribing to it is a legitimate effect.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Services index" className="sticky top-28">
      <p className="eyebrow mb-5 text-muted">Index</p>
      <ol className="space-y-1 border-l border-line">
        {items.map((item, i) => {
          const isActive = active === item.slug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px flex items-baseline gap-3 border-l py-1.5 pl-4 text-sm transition-colors duration-300",
                  isActive ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                <span className="font-mono text-[0.7rem]">{pad(i + 1)}</span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
