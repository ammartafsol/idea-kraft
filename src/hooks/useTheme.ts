"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/*
 * The source of truth for the theme is the `data-theme` attribute on <html>,
 * set before paint by the inline script in the root layout. Components
 * subscribe to that attribute, so there's no React context, no effect, and
 * no hydration mismatch.
 */

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Follow OS changes live, but only until the visitor makes an explicit choice.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = (e: MediaQueryListEvent) => {
    try {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
    } catch {}
    document.documentElement.dataset.theme = e.matches ? "dark" : "light";
  };
  media.addEventListener("change", onSystem);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onSystem);
  };
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerSnapshot = (): Theme | null => null;

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {}
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Switches theme with a circular reveal that grows out of the click point
   * (View Transitions API), or a colour cross-fade where that isn't supported.
   */
  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      applyTheme(next);
      return;
    }

    if (typeof document.startViewTransition === "function") {
      const x = origin?.x ?? window.innerWidth - 80;
      const y = origin?.y ?? 40;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const transition = document.startViewTransition(() => applyTheme(next));
      transition.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {});
      return;
    }

    root.classList.add("theme-fade");
    applyTheme(next);
    window.setTimeout(() => root.classList.remove("theme-fade"), 500);
  }, []);

  return { theme, toggleTheme };
}
