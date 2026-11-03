"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

/** Oversized wordmark that rises into place as the footer scrolls into view. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  return (
    <div ref={ref} aria-hidden className="overflow-hidden pt-16 pb-6 select-none md:pt-24">
      <motion.p
        style={reduce ? undefined : { y }}
        className="font-display text-[clamp(4rem,21.5vw,22rem)] leading-[0.78] font-bold tracking-[-0.06em] whitespace-nowrap"
      >
        NOVARA<span className="text-accent">.</span>
      </motion.p>
    </div>
  );
}
