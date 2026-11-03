"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/data/studio";
import { Eyebrow, PlaceholderNote } from "@/components/ui/Eyebrow";
import { cn, pad } from "@/lib/utils";

/**
 * One oversized quote at a time, with numbered controls. Every quote is
 * a clearly labelled sample. Replace them in src/data/studio.ts.
 */
export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const total = testimonials.length;
  const t = testimonials[index];

  const go = (dir: number) => setState(([i]) => [(i + dir + total) % total, dir]);

  return (
    <section aria-labelledby="testimonials-title" aria-roledescription="carousel" className="section-y overflow-hidden">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="05">Kind words</Eyebrow>
            <h2 id="testimonials-title" className="sr-only">
              Sample testimonials
            </h2>
          </div>
          <PlaceholderNote>Sample testimonials for layout only, not real client reviews</PlaceholderNote>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-6">
          <div aria-hidden className="font-display text-[clamp(6rem,14vw,13rem)] leading-[0.7] font-bold text-accent-text md:col-span-2">
            &ldquo;
          </div>

          <div className="relative min-h-[22rem] sm:min-h-[19rem] md:col-span-10 md:min-h-[24rem]" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <blockquote className="display-md max-w-5xl text-balance">{t.quote}</blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="grid size-12 place-items-center rounded-full bg-surface font-display text-lg font-semibold">
                    {t.company.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="text-sm text-muted">
                      {t.role}, {t.company}
                    </span>
                  </span>
                  <span className="ml-1 rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.65rem] tracking-[0.12em] text-muted uppercase">
                    Sample
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-6 border-t border-line pt-6 md:ml-[calc(2/12*100%)]">
          <div className="flex items-center gap-3" role="group" aria-label="Choose testimonial">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className="group flex h-11 items-center"
              >
                <span
                  className={cn(
                    "block h-[2px] rounded-full transition-all duration-500",
                    i === index ? "w-12 bg-fg" : "w-6 bg-line-strong group-hover:bg-fg/60",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 font-mono text-xs text-muted tabular-nums">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
