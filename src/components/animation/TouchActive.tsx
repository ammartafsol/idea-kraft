"use client";

import { useInView } from "motion/react";
import { useRef, type ComponentPropsWithoutRef } from "react";

type Tag = "div" | "article" | "li";

/**
 * Touch screens can't hover, so hover effects never fire there. This wrapper
 * marks itself `data-inview="true"` while it crosses the middle band of the
 * viewport. Children opt in with the `touch-active:` variant (globals.css),
 * which only applies on devices without hover. Scrolling a card into focus
 * plays the same animation a mouse hover would on desktop.
 */
export function TouchActive<T extends Tag = "div">({
  as,
  children,
  ...rest
}: { as?: T } & ComponentPropsWithoutRef<T>) {
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref, { margin: "-46% 0px -46% 0px" });
  const Comp = (as ?? "div") as "div";

  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} data-inview={active} {...(rest as ComponentPropsWithoutRef<"div">)}>
      {children}
    </Comp>
  );
}
