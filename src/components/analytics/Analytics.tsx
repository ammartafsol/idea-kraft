"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*
 * First-party page-view tracking for the admin dashboard.
 * - visitorId: random ID kept in this browser (localStorage) → unique & returning visitors.
 * - sessionId: kept in sessionStorage, rotated after 30 min of inactivity → sessions & bounce rate.
 * - Respects Do Not Track / Global Privacy Control: if either is on, nothing is sent.
 * No cookies, no IP storage, no third parties.
 */

const VISITOR_KEY = "novara-vid";
const SESSION_KEY = "novara-sid";
const SESSION_IDLE_MS = 30 * 60 * 1000;
/** Set by the admin panel; this browser is the site owner's and is never tracked. */
export const ADMIN_BROWSER_KEY = "novara-admin-browser";

type Current = { id: string; visitorId: string; start: number; visible: number };

/** Guards against React Strict Mode's double-invoked effects (dev) counting a view twice. */
let lastView: { path: string; at: number; current: Current } | null = null;

function uid() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function trackingAllowed() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return false;
  try {
    return localStorage.getItem(ADMIN_BROWSER_KEY) !== "1";
  } catch {
    return true;
  }
}

function getVisitor() {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return { visitorId: existing, isNewVisitor: false };
    const visitorId = uid();
    localStorage.setItem(VISITOR_KEY, visitorId);
    return { visitorId, isNewVisitor: true };
  } catch {
    return { visitorId: uid(), isNewVisitor: true };
  }
}

function getSession() {
  const now = Date.now();
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null") as { id: string; last: number } | null;
    const fresh = !stored || now - stored.last > SESSION_IDLE_MS;
    const id = fresh ? uid() : stored.id;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
    return { sessionId: id, isNewSession: fresh };
  } catch {
    return { sessionId: uid(), isNewSession: true };
  }
}

function send(body: object) {
  const json = JSON.stringify(body);
  // sendBeacon survives page unloads; fall back to keepalive fetch.
  if (!navigator.sendBeacon?.("/api/track", new Blob([json], { type: "text/plain" }))) {
    fetch("/api/track", { method: "POST", body: json, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
  }
}

function recordView(pathname: string): Current {
  const { visitorId, isNewVisitor } = getVisitor();
  const { sessionId, isNewSession } = getSession();
  const id = uid();
  send({
    type: "view",
    id,
    path: pathname,
    title: document.title.slice(0, 200),
    referrer: isNewSession ? document.referrer : "",
    visitorId,
    sessionId,
    isNewVisitor,
    isNewSession,
    utmSource: new URLSearchParams(window.location.search).get("utm_source") ?? "",
  });
  return { id, visitorId, start: Date.now(), visible: 0 };
}

export function Analytics() {
  const pathname = usePathname();
  const current = useRef<Current | null>(null);

  // Record a view on every route change and time-on-page for the previous one.
  // Network calls in response to navigation are a genuine side effect, hence an effect.
  useEffect(() => {
    if (!trackingAllowed() || pathname.startsWith("/admin")) return;

    const duplicate = lastView && lastView.path === pathname && Date.now() - lastView.at < 1500;
    if (duplicate && lastView) {
      lastView.current.start = Date.now();
      current.current = lastView.current;
    } else {
      current.current = recordView(pathname);
      lastView = { path: pathname, at: Date.now(), current: current.current };
    }

    const elapsed = (c: Current) => c.visible + (document.visibilityState === "visible" ? Date.now() - c.start : 0);
    const leave = () => {
      const c = current.current;
      if (c) send({ type: "leave", id: c.id, visitorId: c.visitorId, duration: Math.round(elapsed(c)) });
    };

    // Only count time while the tab is visible.
    const onVisibility = () => {
      const c = current.current;
      if (!c) return;
      if (document.visibilityState === "hidden") {
        c.visible += Date.now() - c.start;
        send({ type: "leave", id: c.id, visitorId: c.visitorId, duration: Math.round(c.visible) });
      } else {
        c.start = Date.now();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);
    return () => {
      leave();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", leave);
    };
  }, [pathname]);

  return null;
}
