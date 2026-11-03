"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  // Driving a DOM text node from an animation is a real side effect, so an
  // effect is the right tool. Writing textContent directly avoids 60 React
  // re-renders per second.
  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduce) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reduce]);

  return (
    <>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {`0${suffix}`}
      </span>
    </>
  );
}
