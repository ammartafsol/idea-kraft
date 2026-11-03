import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { TouchActive } from "@/components/animation/TouchActive";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index?: number;
  /** Tailwind aspect class for the preview frame, which differs per layout slot. */
  aspect?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  showSummary?: boolean;
};

export function ConceptBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-bg/85 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-fg uppercase backdrop-blur",
        className,
      )}
      title="Concept content. Replace with the real case study."
    >
      <span className="size-1.5 rounded-full bg-accent-text" aria-hidden />
      Concept
    </span>
  );
}

/**
 * Large project preview with a wipe-in reveal, slow parallax, hover zoom, and
 * the cursor's "View" state. The whole card is one link, so it's a single tab stop.
 */
export function ProjectCard({
  project,
  index,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  className,
  priority,
  showSummary = true,
}: ProjectCardProps) {
  return (
    <TouchActive as="article" className={cn("group", className)}>
      <Link href={`/work/${project.slug}`} data-cursor="view" className="block" aria-label={`${project.title}: ${project.tagline}. View project`}>
        <div className="relative">
          <ImageReveal
            src={project.cover.src}
            alt={project.cover.alt}
            sizes={sizes}
            priority={priority}
            className={cn("w-full rounded-[3px]", aspect)}
            imageClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] touch-active:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
            {project.isConcept ? <ConceptBadge /> : <span />}
            <span className="grid size-11 translate-y-2 place-items-center rounded-full bg-accent text-accent-ink opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 touch-active:translate-y-0 touch-active:opacity-100 md:hidden">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-3 md:grid-cols-[1fr_auto]">
          <div className="flex items-baseline gap-4">
            {index !== undefined && <span className="font-mono text-xs text-muted">({String(index + 1).padStart(2, "0")})</span>}
            <h3 className="display-sm transition-colors duration-300">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px] touch-active:bg-[length:100%_1px]">
                {project.title}
              </span>
            </h3>
          </div>
          <p className="eyebrow text-muted md:text-right">
            {project.tagline} · {project.year}
          </p>
          {showSummary && <p className="max-w-xl text-muted md:col-span-2">{project.summary}</p>}
          <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
            <ul className="flex flex-wrap gap-1.5" aria-label="Technology stack">
              {project.stack.slice(0, 4).map((tech) => (
                <li key={tech} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                  {tech}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium" aria-hidden>
              View Project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 touch-active:-translate-y-0.5 touch-active:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </TouchActive>
  );
}
