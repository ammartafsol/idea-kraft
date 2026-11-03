import Link from "next/link";
import { disciplines } from "@/data/services";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animation/Reveal";
import { TouchActive } from "@/components/animation/TouchActive";
import { pad } from "@/lib/utils";

/**
 * Services as an editorial index rather than a card grid. On hover, a lime
 * panel rises behind the row, the description opens, and the icon turns.
 */
export function ServicesOverview() {
  return (
    <section aria-labelledby="services-title" className="section-y">
      <div className="container-x">
        <SectionHeader
          index="01"
          eyebrow="What we do"
          title={["Six disciplines.", "One studio."]}
          titleId="services-title"
          aside={
            <>
              <p className="text-muted">
                Strategy, design and engineering under one roof, so nothing gets lost between the idea and the shipped
                product.
              </p>
              <TextLink href="/services" className="mt-5">
                All services
              </TextLink>
            </>
          }
        />

        <ul className="mt-16 border-t border-line md:mt-24">
          {disciplines.map((d, i) => (
            <Reveal as="li" key={d.title} delay={i * 0.05} y={16} className="border-b border-line">
              <TouchActive>
                <Link
                  href={d.href}
                  className="group relative isolate grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 py-7 transition-colors duration-500 md:grid-cols-12 md:gap-x-6 md:py-9"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-[-1rem] inset-y-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100 touch-active:scale-y-100 md:inset-x-[-1.5rem]"
                  />
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent-ink/60 touch-active:text-accent-ink/60 md:col-span-1">
                    {pad(i + 1)}
                  </span>
                  <h3 className="display-sm transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-accent-ink touch-active:translate-x-2 touch-active:text-accent-ink md:col-span-4">
                    {d.title}
                  </h3>
                  <ServiceIcon
                    name={d.icon}
                    className="size-10 justify-self-end text-fg transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg] group-hover:text-accent-ink touch-active:rotate-[-8deg] touch-active:text-accent-ink md:order-last md:col-span-1 md:size-12"
                  />
                  <div className="col-span-3 md:col-span-5 md:col-start-7">
                    <p className="text-muted transition-colors group-hover:text-accent-ink/80 touch-active:text-accent-ink/80 md:max-w-md">{d.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Focus areas">
                      {d.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition-colors group-hover:border-accent-ink/20 group-hover:text-accent-ink/70 touch-active:border-accent-ink/20 touch-active:text-accent-ink/70"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="sr-only">Learn more about {d.title}</span>
                </Link>
              </TouchActive>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
