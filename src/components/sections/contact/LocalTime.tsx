"use client";

import { useSyncExternalStore } from "react";

/** Ticks once every 15s; plenty for a clock that shows minutes. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

/**
 * The studio's current local time. Rendered only on the client (the server
 * can't know the visitor's "now" at view time), with a stable placeholder
 * during server rendering so there's no layout shift.
 */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", hour12: true }).format(
        Math.floor(Date.now() / 60_000) * 60_000,
      ),
    () => null,
  );
  const zone = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
    .formatToParts(new Date(0))
    .find((p) => p.type === "timeZoneName")?.value;

  return (
    <span className="tabular-nums">
      {time ?? "--:--"} <span className="text-[0.7em] opacity-70">{time ? zone?.replace(/^E[SD]T$/, "ET") : ""}</span>
    </span>
  );
}
