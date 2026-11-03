"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { processSteps } from "@/data/studio";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitText } from "@/components/animation/SplitText";
import { cn, pad } from "@/lib/utils";

/**
 * Scroll-driven timeline. The left column stays pinned and shows the active
 * step number; a rail on the right fills as you move through the five phases.
 */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(processSteps.length - 1, Math.max(0, Math.floor(v * processSteps.length))));
  });

  return (
    <section aria-labelledby="process-title" className="section-y">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Eyebrow index="03">How we work</Eyebrow>
            <SplitText id="process-title" lines={["A clear path", "from idea", "to launch."]} className="display-lg mt-6" />
            <p className="mt-8 max-w-sm text-muted">
              Five phases, short feedback loops and no surprises. You’ll always know what’s happening, what’s next
              and what we need from you.
            </p>

            <div className="mt-12 hidden items-end gap-4 md:flex" aria-hidden>
              <div className="relative h-[clamp(6rem,11vw,10rem)] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="block font-display text-[clamp(6rem,11vw,10rem)] leading-none font-bold tracking-[-0.06em] text-accent-text"
                  >
                    {pad(active + 1)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="mb-3 font-mono text-sm text-muted">/ {pad(processSteps.length)}</span>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="relative md:col-span-6 md:col-start-7">
          <span aria-hidden className="absolute top-0 bottom-0 left-[0.4rem] w-px bg-line md:left-0" />
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 left-[0.4rem] w-px origin-top bg-fg md:left-0"
            style={{ scaleY: fill }}
          />
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative pb-16 pl-10 last:pb-0 md:pb-24 md:pl-14">
              <span
                aria-hidden
                className={cn(
                  "absolute top-2 left-0 size-[0.8rem] -translate-x-0 rounded-full border transition-all duration-500 md:-translate-x-1/2",
                  i <= active ? "scale-110 border-accent-text bg-accent" : "border-line-strong bg-bg",
                )}
              />
              <p className="font-mono text-xs text-muted">{pad(i + 1)}</p>
              <h3
                className={cn(
                  "display-md mt-2 transition-colors duration-500",
                  i <= active ? "text-fg" : "text-fg/35",
                )}
              >
                {step.title}
              </h3>
              <p className="mt-4 max-w-md text-muted">{step.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${step.title} deliverables`}>
                {step.deliverables.map((d) => (
                  <li key={d} className="rounded-full bg-surface px-3 py-1 text-xs">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
