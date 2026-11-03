"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useId, useRef, useSyncExternalStore, type PointerEvent } from "react";
import { SplitText } from "@/components/animation/SplitText";
import { Magnetic } from "@/components/animation/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { LogoMark } from "@/components/ui/Logo";
import { HeroVisual } from "@/components/three/HeroVisual";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Wait for the intro loader on a first visit; start almost immediately otherwise. */
function useIntroDelay() {
  return useSyncExternalStore(
    () => () => {},
    () => (document.documentElement.classList.contains("intro-seen") ? 0.1 : 1.65),
    () => 1.65,
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const delay = useIntroDelay();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Pointer → subtle counter-movement of the headline (depth).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(useTransform(mx, [-1, 1], [14, -14]), { stiffness: 80, damping: 20 });
  const ty = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 20 });

  // Scroll → hero recedes as the next section arrives.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    pointer.current = { x, y };
    if (!reduce) {
      mx.set(x);
      my.set(y);
    }
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-8 sm:pt-28 md:pb-10"
    >
      <BackgroundGrid />

      {/* Desktop 3D centrepiece: sits behind the content on the right and follows the mouse. */}
      <motion.div
        style={reduce ? undefined : { scale: visualScale, opacity: fade }}
        className="absolute top-[10%] right-[0%] z-10 hidden aspect-square w-[min(46vw,680px)] md:block"
      >
        <motion.div
          className="size-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: delay + 0.2, ease }}
        >
          {isDesktop && <HeroVisual pointer={pointer} touchable className="size-full" />}
        </motion.div>
      </motion.div>

      <motion.div style={reduce ? undefined : { opacity: fade, y: lift }} className="container-x flex flex-1 flex-col">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay, ease }}
        >
          <StatusPill />
          <p className="eyebrow hidden text-muted md:block">Strategy · Design · Engineering</p>
        </motion.div>

        <motion.div style={{ x: tx, y: ty }} className="mt-10 md:mt-[6vh] md:flex-1">
          <SplitText
            as="h1"
            by="chars"
            immediate
            delay={delay + 0.1}
            stagger={0.022}
            lines={["We turn bold", "ideas into", "digital", "experiences."]}
            className="display-xl uppercase"
            lineClassName="[&:nth-child(2)]:pl-[8vw] md:[&:nth-child(3)]:pl-[22vw] md:[&:nth-child(4)]:pl-[4vw]"
          />
        </motion.div>

        {/* Phone 3D centrepiece: in normal flow (never overlaps text) and fully touchable. */}
        <motion.div
          className="relative -mt-6 flex flex-1 items-center justify-end md:hidden"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: delay + 0.5, ease }}
        >
          <RotatingBadge delay={delay} className="absolute bottom-[10%] left-0 size-24 sm:size-28" />
          {!isDesktop && (
            <HeroVisual
              pointer={pointer}
              touchable
              className="-mr-[4vw] aspect-square w-[72vw] max-w-[25rem] sm:w-[54vw]"
            />
          )}
        </motion.div>

        <div className="relative z-20 mt-4 grid items-end gap-8 md:mt-16 md:grid-cols-12">
          <motion.p
            className="lede text-muted md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: delay + 0.75, ease }}
          >
            We combine strategy, creative design, and modern technology to build digital experiences that help
            ambitious brands grow.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: delay + 0.9, ease }}
          >
            <Magnetic strength={0.3}>
              <ButtonLink href="/work" size="lg" variant="solid">
                Explore Our Work
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.3}>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Let&apos;s Talk
              </ButtonLink>
            </Magnetic>
          </motion.div>

          <motion.a
            href="#clients"
            aria-label="Scroll to the next section"
            className="group hidden flex-col items-center gap-3 justify-self-end md:col-span-1 md:col-start-12 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + 1.1 }}
          >
            <span className="eyebrow text-muted [writing-mode:vertical-rl]">Scroll</span>
            <span className="relative h-16 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-fg" />
            </span>
          </motion.a>
        </div>
      </motion.div>

      <RotatingBadge delay={delay} className="absolute right-[33%] bottom-[19%] hidden size-28 lg:block xl:size-32" />
    </section>
  );
}

/** Hairline column grid that draws itself in, which hints at the 12-column system underneath. */
function BackgroundGrid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
      <div className="container-x grid h-full grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className={`border-l border-line ${i >= 4 ? "hidden md:block" : ""} last:border-r`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ originY: 0 }}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.04, ease }}
          />
        ))}
      </div>
    </div>
  );
}

function RotatingBadge({ delay, className }: { delay: number; className?: string }) {
  const text = "Idea Kraft • Strategy • Design • Code • ";
  const pathId = `badge-circle${useId().replace(/:/g, "")}`;
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none", className)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: delay + 1.2, ease }}
    >
      <svg viewBox="0 0 120 120" className="size-full animate-[spin-slow_24s_linear_infinite]">
        <defs>
          <path id={pathId} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-fg font-mono text-[8.6px] tracking-[0.2em] uppercase">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <LogoMark className="size-9" />
      </div>
    </motion.div>
  );
}
