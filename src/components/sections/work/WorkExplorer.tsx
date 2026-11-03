"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, LayoutGrid, Rows3 } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { Project, ProjectCategory } from "@/types";
import { ProjectCard, ConceptBadge } from "@/components/shared/ProjectCard";
import { cn, pad } from "@/lib/utils";

type Filter = ProjectCategory | "All";
type View = "grid" | "index";

export function WorkExplorer({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("grid");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", projects.length]]);
    projects.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [projects]);

  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const filters: Filter[] = ["All", ...categories.filter((c) => counts.has(c))];

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-y border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between gap-4">
          <div role="group" aria-label="Filter projects by category" className="-my-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={cn(
                    "relative h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-300",
                    active ? "text-bg" : "text-muted hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">
                    {f} <sup className="font-mono text-[0.6rem]">{counts.get(f)}</sup>
                  </span>
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="Layout" className="hidden shrink-0 gap-1 rounded-full border border-line p-1 sm:flex">
            {(
              [
                ["grid", LayoutGrid, "Grid view"],
                ["index", Rows3, "Index view"],
              ] as const
            ).map(([v, Icon, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                aria-label={label}
                title={label}
                className={cn("grid size-9 place-items-center rounded-full transition-colors", view === v ? "bg-fg text-bg" : "text-muted hover:text-fg")}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <div className="mt-12 md:mt-16">
        {view === "grid" ? (
          <motion.ul layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(i % 2 === 1 && "md:mt-32")}
                >
                  <ProjectCard project={p} index={projects.indexOf(p)} aspect="aspect-[4/5]" sizes="(min-width: 768px) 50vw, 100vw" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <ProjectIndex projects={visible} all={projects} />
        )}
      </div>
    </div>
  );
}

/** Editorial table of projects. Hovering a row floats its cover image beside the cursor. */
function ProjectIndex({ projects, all }: { projects: Project[]; all: Project[] }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  function onMove(e: PointerEvent<HTMLUListElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <ul className="relative border-t border-line" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
      {projects.map((p) => (
        <li key={p.slug} className="border-b border-line">
          <Link
            href={`/work/${p.slug}`}
            onPointerEnter={() => setHovered(p)}
            onFocus={() => setHovered(null)}
            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 transition-[padding] duration-500 hover:pl-3 md:grid-cols-12 md:py-8"
          >
            <span className="font-mono text-xs text-muted md:col-span-1">{pad(all.indexOf(p) + 1)}</span>
            <span className="display-md md:col-span-5">{p.title}</span>
            <ArrowUpRight className="size-5 self-center transition-transform duration-300 group-hover:rotate-45 md:order-last md:col-span-1 md:justify-self-end" aria-hidden />
            <span className="col-span-2 col-start-2 text-muted md:col-span-3 md:col-start-auto">{p.tagline}</span>
            <span className="hidden font-mono text-xs text-muted md:col-span-2 md:block">
              {p.category} · {p.year}
            </span>
          </Link>
        </li>
      ))}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 hidden w-[22rem] md:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.slug}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-32 left-8 aspect-[4/3] w-full overflow-hidden rounded-[3px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)]"
            >
              <Image src={hovered.cover.src} alt="" fill sizes="352px" className="object-cover" />
              {hovered.isConcept && <ConceptBadge className="absolute top-3 left-3" />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ul>
  );
}
