"use client";

import { motion } from "motion/react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * A sun that eclipses into a moon. The disc stays put while a masking circle
 * slides across it and the rays retract.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = theme === null ? "Toggle colour theme" : `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-11 place-items-center rounded-full border border-line text-fg transition-colors duration-300 hover:border-fg",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[1.15rem]" aria-hidden>
        <mask id="novara-moon-mask">
          <rect width="24" height="24" fill="white" />
          <motion.circle
            r="6"
            fill="black"
            initial={false}
            animate={isDark ? { cx: 17, cy: 7 } : { cx: 30, cy: -6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#novara-moon-mask)"
          initial={false}
          animate={{ r: isDark ? 8 : 4.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.g
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -60 : 0, scale: isDark ? 0.5 : 1 }}
          style={{ originX: "12px", originY: "12px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" />
        </motion.g>
      </svg>
    </button>
  );
}
