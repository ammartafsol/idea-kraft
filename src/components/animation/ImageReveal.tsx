"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ImageRevealProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Vertical parallax travel, as a percentage of the frame height. 0 disables it. */
  parallax?: number;
};

/**
 * An image that wipes open (clip-path) the first time it's seen, then drifts
 * with a subtle parallax as you scroll. The image is slightly over-scaled so
 * the drift never exposes the edge of the frame.
 */
export function ImageReveal({ src, alt, sizes, className, imageClassName, priority, parallax = 8 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const still = reduce || parallax === 0;

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden bg-surface", className)}
      initial={reduce || priority ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="absolute inset-0" style={still ? undefined : { y, scale: 1 + (parallax * 2.2) / 100 }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imageClassName)} />
      </motion.div>
    </motion.div>
  );
}
