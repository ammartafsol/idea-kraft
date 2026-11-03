import Image from "next/image";
import { team } from "@/data/studio";
import { Reveal } from "@/components/animation/Reveal";
import { cn } from "@/lib/utils";

/** Editable placeholder profiles. Portraits sit in monochrome and bloom into colour on hover. */
export function TeamGrid() {
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((m, i) => (
        <Reveal as="li" key={m.name} delay={i * 0.08} className={cn("group", i % 2 === 1 && "lg:mt-24")}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-surface">
            <Image
              src={m.image.src}
              alt={m.image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover grayscale transition-[filter,transform] duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
            />
            <span className="absolute top-3 left-3 rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.12em] text-fg uppercase backdrop-blur">
              Placeholder profile
            </span>
          </div>
          <h3 className="display-sm mt-5">{m.name}</h3>
          <p className="eyebrow mt-2 text-accent-text">{m.role}</p>
          <p className="mt-3 text-muted">{m.bio}</p>
        </Reveal>
      ))}
    </ul>
  );
}
