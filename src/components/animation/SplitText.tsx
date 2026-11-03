"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  /** Each entry renders on its own line. */
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** "chars" animates letter by letter (hero), "words" is lighter for section titles. */
  by?: "chars" | "words";
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Staggered, masked text reveal. Screen readers get the plain sentence via
 * aria-label; the animated fragments are hidden from assistive tech.
 */
export function SplitText({
  lines,
  className,
  lineClassName,
  by = "words",
  delay = 0,
  stagger,
  immediate = false,
  as = "h2",
  id,
}: SplitTextProps) {
  const Tag = motion[as];
  const step = stagger ?? (by === "chars" ? 0.028 : 0.07);

  const container = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: step } },
  };
  const piece = {
    hidden: { y: "110%", rotate: by === "chars" ? 6 : 2 },
    visible: { y: "0%", rotate: 0, transition: { duration: by === "chars" ? 0.9 : 1, ease } },
  };

  const trigger = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <Tag id={id} className={className} aria-label={lines.join(" ")} initial="hidden" variants={container} {...trigger}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className={cn("block", lineClassName)}>
          {line.split(" ").map((word, wi, words) => (
            <Fragment key={wi}>
              <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                {by === "words" ? (
                  <motion.span className="inline-block origin-bottom-left will-change-transform" variants={piece}>
                    {word}
                  </motion.span>
                ) : (
                  word.split("").map((char, ci) => (
                    <motion.span
                      key={ci}
                      className="inline-block origin-bottom-left will-change-transform"
                      variants={piece}
                    >
                      {char}
                    </motion.span>
                  ))
                )}
              </span>
              {wi < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
