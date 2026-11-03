import { Marquee } from "@/components/animation/Marquee";
import { PlaceholderNote } from "@/components/ui/Eyebrow";
import { illustrativeBrands } from "@/data/studio";
import { cn } from "@/lib/utils";

const wordmarkStyles = {
  serif: "font-[Georgia,'Times_New_Roman',serif] text-[2.1rem] tracking-[-0.02em]",
  mono: "font-mono text-[1.6rem] tracking-[-0.04em]",
  wide: "font-display text-[1.7rem] font-semibold tracking-[0.18em]",
  italic: "font-display text-[2rem] font-medium italic tracking-[-0.03em]",
  heavy: "font-display text-[2.2rem] font-extrabold tracking-[-0.06em]",
  light: "font-sans text-[2.2rem] font-light tracking-[-0.05em]",
} as const;

/** Fictional wordmarks in a marquee, clearly labelled as illustrative and not real clients. */
export function ClientMarquee() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="scroll-mt-20 border-y border-line py-10 md:py-14">
      <div className="container-x mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="clients-title" className="eyebrow text-muted">
          The kind of brands we build for
        </h2>
        <PlaceholderNote>Illustrative brand concepts, not client logos</PlaceholderNote>
      </div>
      <Marquee duration={45} className="[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        {illustrativeBrands.map((brand) => (
          <span key={brand.name} className="flex items-center">
            <span className={cn("px-8 leading-none whitespace-nowrap text-fg/70 md:px-12", wordmarkStyles[brand.style])}>
              {brand.name}
            </span>
            <svg viewBox="0 0 16 16" className="size-3 text-accent-text" aria-hidden>
              <path d="M8 0c.3 4.2 3.8 7.7 8 8-4.2.3-7.7 3.8-8 8-.3-4.2-3.8-7.7-8-8 4.2-.3 7.7-3.8 8-8Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
