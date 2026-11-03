import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee in pure CSS (no JS). The content is rendered
 * twice so translating by -50% loops seamlessly. It pauses on hover, and the
 * global reduced-motion rule stops it.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const style = {
    "--marquee-duration": `${duration}s`,
    animationDirection: reverse ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div className={cn("marquee-group relative flex overflow-hidden", className)}>
      <div className="animate-marquee flex w-max shrink-0" style={style}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
