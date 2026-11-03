import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Service } from "@/types";
import { getProject } from "@/data/projects";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animation/Reveal";
import { SplitText } from "@/components/animation/SplitText";
import { pad } from "@/lib/utils";

/** One fully detailed service: offer, approach, technologies, related work and a CTA. */
export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const related = service.relatedProjects.map(getProject).filter((p) => p !== undefined);

  return (
    <section id={service.slug} aria-labelledby={`${service.slug}-title`} className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-xs text-muted">
          Service {pad(index + 1)}
        </p>
        <ServiceIcon name={service.icon} className="size-14 md:size-16" />
      </div>
      <SplitText id={`${service.slug}-title`} lines={[service.title]} className="display-lg mt-6 max-w-4xl" />
      <Reveal delay={0.1}>
        <p className="display-sm mt-8 max-w-3xl text-fg/80">{service.short}</p>
        <p className="mt-6 max-w-2xl text-muted">{service.description}</p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <Reveal>
          <h3 className="eyebrow border-b border-fg pb-3">What we offer</h3>
          <ul className="mt-2">
            {service.offerings.map((o) => (
              <li key={o} className="flex gap-3 border-b border-line py-3.5">
                <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="eyebrow border-b border-fg pb-3">Our approach</h3>
          <ol className="mt-2">
            {service.approach.map((a, i) => (
              <li key={a.title} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4">
                <span className="font-mono text-xs leading-7 text-muted">{pad(i + 1)}</span>
                <div>
                  <h4 className="font-medium">{a.title}</h4>
                  <p className="mt-1 text-sm text-muted">{a.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <h3 className="eyebrow text-muted">Technologies</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {service.technologies.map((t) => (
            <li key={t} className="rounded-full border border-line-strong px-3.5 py-1.5 font-mono text-xs">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      {related.length > 0 && (
        <Reveal className="mt-14">
          <h3 className="eyebrow text-muted">Relevant work</h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} data-cursor="view" className="group flex items-center gap-4 rounded-[3px] border border-line p-3 transition-colors hover:border-fg">
                  <span className="relative block aspect-square w-20 shrink-0 overflow-hidden rounded-[2px] bg-surface">
                    <Image src={p.cover.src} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold tracking-[-0.02em]">{p.title}</span>
                    <span className="text-sm text-muted">{p.tagline}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal className="mt-14">
        <ButtonLink href={`/contact?service=${service.slug}`} variant="solid" size="lg">
          Discuss a {service.title.toLowerCase()} project
        </ButtonLink>
      </Reveal>
    </section>
  );
}
