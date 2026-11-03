"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  /** Render as a list item so the reveal can sit directly inside <ul>/<ol>. */
  as?: "div" | "li";
};

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ delay = 0, y = 24, as = "div", children, ...rest }: RevealProps) {
  const Comp = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
