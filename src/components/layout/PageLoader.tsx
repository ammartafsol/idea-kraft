"use client";

import { useEffect, useRef } from "react";

const WORD = "NOVARA";

/**
 * First-visit intro. The reveal and exit are pure CSS (see globals.css), so
 * the page is never trapped behind the loader if JavaScript is slow or
 * disabled. JS only drives the counter and remembers that the intro has
 * played in this tab, so it doesn't repeat on reload.
 */
export function PageLoader() {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("novara-intro", "1");
    } catch {}
    const node = countRef.current;
    if (!node || document.documentElement.classList.contains("intro-seen")) return;

    const duration = 1300;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="page-loader fixed inset-0 z-[100] flex flex-col justify-between bg-inverse p-5 text-inverse-fg sm:p-8" aria-hidden>
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-inverse-muted uppercase">
        <span>Novara Studio</span>
        <span>Digital experiences</span>
      </div>

      <p className="flex overflow-hidden font-display text-[clamp(4rem,19vw,17rem)] leading-[0.8] font-bold tracking-[-0.06em]">
        {WORD.split("").map((letter, i) => (
          <span key={i} className="loader-letter inline-block" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
            {letter}
          </span>
        ))}
        <span className="loader-letter inline-block text-accent" style={{ animationDelay: `${0.08 + WORD.length * 0.06}s` }}>
          .
        </span>
      </p>

      <div className="flex items-end justify-between gap-6">
        <div className="relative h-px flex-1 bg-inverse-line">
          <span className="loader-bar absolute inset-0 origin-left bg-accent" />
        </div>
        <span ref={countRef} className="font-mono text-sm tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}
