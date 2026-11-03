import { getFeaturedProjects, projects } from "@/data/projects";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/animation/Magnetic";

/**
 * The visually dominant section. Four projects in a staggered editorial
 * layout: full-bleed, offset pair, then a wide closing frame.
 */
export function FeaturedProjects() {
  const [first, second, third, fourth] = getFeaturedProjects();

  return (
    <section aria-labelledby="work-title" className="section-y bg-surface/60">
      <div className="container-x">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          titleId="work-title"
          title={["Work that", "moves brands."]}
          titleClassName="display-xl"
          aside={
            <p className="text-muted">
              A selection of recent projects across e-commerce, platforms, immersive web and WordPress. Each one
              started with a problem worth solving.
            </p>
          }
        />

        <div className="mt-16 grid gap-x-8 gap-y-20 md:mt-24 md:grid-cols-12 md:gap-y-32">
          {first && (
            <ProjectCard
              project={first}
              index={0}
              aspect="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]"
              sizes="(min-width: 1536px) 1440px, 100vw"
              className="md:col-span-12"
            />
          )}
          {second && (
            <ProjectCard
              project={second}
              index={1}
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 58vw, 100vw"
              className="md:col-span-7"
            />
          )}
          {third && (
            <ProjectCard
              project={third}
              index={2}
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 42vw, 100vw"
              className="md:col-span-5 md:mt-[40%]"
            />
          )}
          {fourth && (
            <ProjectCard
              project={fourth}
              index={3}
              aspect="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]"
              sizes="(min-width: 1536px) 1440px, 100vw"
              className="md:col-span-10 md:col-start-2"
            />
          )}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 text-center md:mt-28">
          <p className="text-muted">{projects.length} projects in the archive</p>
          <Magnetic>
            <ButtonLink href="/work" size="lg" variant="solid">
              View All Work
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
