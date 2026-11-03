"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { values } from "@/data/studio";
import { cn, pad } from "@/lib/utils";

/** Values as an interactive list: one open at a time, fully keyboard accessible. */
export function ValuesAccordion() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <ul className="border-t border-line">
      {values.map((v, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={v.title} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center gap-5 py-6 text-left md:gap-8 md:py-8"
              >
                <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                <span
                  className={cn(
                    "display-md flex-1 transition-colors duration-500",
                    isOpen ? "text-fg" : "text-fg/40 group-hover:text-fg/70",
                  )}
                >
                  {v.title}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                    isOpen ? "border-accent bg-accent text-accent-ink" : "border-line-strong",
                  )}
                >
                  <span className="absolute h-px w-4 bg-current" />
                  <span
                    className={cn(
                      "absolute h-4 w-px bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      isOpen && "rotate-90 scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="lede pb-8 text-muted md:pl-[calc(2rem+1.75rem)]">{v.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
