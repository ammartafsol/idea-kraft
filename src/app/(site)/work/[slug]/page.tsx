import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { CallToAction } from "@/components/shared/CallToAction";
import { JsonLd } from "@/components/shared/JsonLd";
import { ConceptBadge } from "@/components/shared/ProjectCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/data/site";
import { cn, pad } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title}: ${project.tagline}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title}: ${project.tagline}`,
      description: project.summary,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(slug);
  const index = projects.findIndex((p) => p.slug === slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          headline: `${project.title}: ${project.tagline}`,
          description: project.summary,
          image: project.cover.src,
          dateCreated: project.year,
          creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        }}
      />

      <article>
        <header className="container-x pt-32 md:pt-44">
          <Link href="/work" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            All work
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Eyebrow index={pad(index + 1)}>
              {project.category} · {project.year}
            </Eyebrow>
            {project.isConcept && <ConceptBadge className="border border-line" />}
          </div>
          <SplitText as="h1" immediate delay={0.2} by="chars" lines={[project.title]} className="display-xl mt-6 uppercase" />
          <Reveal delay={0.5}>
            <p className="display-sm mt-6 text-muted">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.6}>
            <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
              <div>
                <dt className="eyebrow text-muted">Client</dt>
                <dd className="mt-2">{project.client}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Year</dt>
                <dd className="mt-2">{project.year}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Role</dt>
                <dd className="mt-2">
                  <ul>
                    {project.role.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">{project.liveUrl ? "Live site" : "Stack"}</dt>
                <dd className="mt-2">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">
                      Visit website <ArrowUpRight className="size-4" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    project.stack.slice(0, 3).join(", ")
                  )}
                </dd>
              </div>
            </dl>
          </Reveal>
          {project.isConcept && (
            <p className="mt-8 max-w-2xl border-l-2 border-accent pl-4 text-sm text-muted">
              This is a concept case study, an illustrative project used to present our process. Imagery is
              representative.
            </p>
          )}
        </header>

        <div className="container-x mt-14 md:mt-20">
          <ImageReveal
            src={project.cover.src}
            alt={project.cover.alt}
            priority
            sizes="(min-width: 1536px) 1440px, 100vw"
            className="aspect-[4/5] rounded-[3px] sm:aspect-[16/10] lg:aspect-[16/8]"
          />
        </div>

        <section aria-labelledby="overview-title" className="container-x section-y grid gap-10 md:grid-cols-12">
          <h2 id="overview-title" className="eyebrow text-muted md:col-span-3">
            Overview
          </h2>
          <Reveal className="md:col-span-9">
            <p className="display-md text-balance">{project.overview}</p>
          </Reveal>
        </section>

        <section aria-label="Challenge and solution" className="container-x grid gap-px overflow-hidden rounded-[3px] border border-line md:grid-cols-2">
          {[
            { label: "The challenge", text: project.challenge },
            { label: "The solution", text: project.solution },
          ].map((block, i) => (
            <Reveal key={block.label} delay={i * 0.1} className={cn("p-8 md:p-12", i === 1 ? "bg-inverse text-inverse-fg" : "bg-surface")}>
              <h2 className={cn("eyebrow", i === 1 ? "text-accent" : "text-accent-text")}>{block.label}</h2>
              <p className={cn("mt-6 text-lg leading-relaxed", i === 1 ? "text-inverse-fg/85" : "text-fg/85")}>{block.text}</p>
            </Reveal>
          ))}
        </section>

        {project.gallery[0] && (
          <div className="container-x mt-6">
            <ImageReveal src={project.gallery[0].src} alt={project.gallery[0].alt} sizes="100vw" className="aspect-[16/10] rounded-[3px] md:aspect-[21/9]" />
          </div>
        )}

        <section aria-labelledby="approach-title" className="container-x section-y">
          <div className="grid gap-10 md:grid-cols-12">
            <h2 id="approach-title" className="display-lg md:col-span-4">
              Design approach
            </h2>
            <ol className="md:col-span-7 md:col-start-6">
              {project.approach.map((a, i) => (
                <Reveal as="li" key={a.title} delay={i * 0.08} className="grid grid-cols-[3rem_1fr] border-t border-line py-8 last:border-b">
                  <span className="font-mono text-xs leading-8 text-muted">{pad(i + 1)}</span>
                  <div>
                    <h3 className="display-sm">{a.title}</h3>
                    <p className="mt-3 text-muted">{a.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {project.gallery.length > 1 && (
          <section aria-label="Project gallery" className="container-x grid gap-6 md:grid-cols-12">
            {project.gallery.slice(1).map((img, i) => (
              <ImageReveal
                key={img.src + i}
                src={img.src}
                alt={img.alt}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn(
                  "rounded-[3px]",
                  i % 2 === 0 ? "aspect-[4/5] md:col-span-7" : "aspect-[4/5] md:col-span-5 md:mt-40",
                )}
              />
            ))}
          </section>
        )}

        <section aria-labelledby="stack-title" className="container-x section-y grid gap-14 md:grid-cols-2">
          <Reveal>
            <h2 id="stack-title" className="eyebrow border-b border-fg pb-3">
              Technology stack
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-line-strong px-4 py-2 font-mono text-xs">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="eyebrow border-b border-fg pb-3">What we delivered</h2>
            <ul className="mt-2">
              {project.outcomes.map((o) => (
                <li key={o} className="flex items-baseline gap-3 border-b border-line py-4">
                  <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-accent-text" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </article>

      <nav aria-label="More projects" className="border-t border-line">
        <div className="container-x grid md:grid-cols-2">
          {[
            { p: prev, label: "Previous project", Icon: ArrowLeft },
            { p: next, label: "Next project", Icon: ArrowRight },
          ].map(({ p, label, Icon }, i) => (
            <Link
              key={label}
              href={`/work/${p.slug}`}
              data-cursor="view"
              className={cn(
                "group relative isolate flex min-h-64 flex-col justify-between gap-10 overflow-hidden py-12 md:min-h-80 md:py-16",
                i === 1 ? "border-t border-line md:border-t-0 md:border-l md:pl-12 md:text-right" : "md:pr-12",
              )}
            >
              <Image
                src={p.cover.src}
                alt=""
                fill
                sizes="50vw"
                className="-z-10 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-15"
              />
              <span className={cn("eyebrow flex items-center gap-2 text-muted", i === 1 && "md:justify-end")}>
                {i === 0 && <Icon className="size-4" aria-hidden />}
                {label}
                {i === 1 && <Icon className="size-4" aria-hidden />}
              </span>
              <span>
                <span className="display-lg block transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
                  {p.title}
                </span>
                <span className="mt-2 block text-muted">{p.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <CallToAction />
    </>
  );
}
