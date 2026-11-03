"use client";

import { useEffect } from "react";
import { ADMIN_BROWSER_KEY } from "@/components/analytics/Analytics";

/**
 * Marks this browser as the site owner's, so the public-site tracker never
 * counts it, even after logging out. Writing to localStorage is a side effect,
 * so it runs in an effect.
 */
export function ExcludeThisBrowser() {
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_BROWSER_KEY, "1");
    } catch {}
  }, []);
  return null;
}
