"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { SeriesPoint } from "@/lib/admin/analytics";
import { fmtNumber } from "@/lib/admin/format";

/*
 * Visitors & page views over time. Both are counts on ONE shared axis.
 * Palette (validated light/dark, CVD-safe): slot 1 blue = unique visitors,
 * slot 2 orange = page views. Text stays in text tokens, never series colours.
 */

const H = 260;
const PAD = { top: 16, right: 12, bottom: 28, left: 44 };

/** Axis top for counts: four equal whole-number steps (1, 2, 5 × 10ⁿ), so tick labels are never fractional. */
function niceMax(v: number) {
  const raw = Math.max(1, v / 4);
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = Math.max(1, (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow);
  return step * 4;
}

export function TrafficChart({ data, hourly }: { data: SeriesPoint[]; hourly: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [hover, setHover] = useState<number | null>(null);

  // Track container width; the observer is an external subscription.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { x, y, max, ticks, visitorsPath, visitorsArea, viewsPath, labelEvery } = useMemo(() => {
    const innerW = width - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.views, d.visitors))));
    const step = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const x = (i: number) => PAD.left + (data.length > 1 ? i * step : innerW / 2);
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
    const line = (key: "views" | "visitors") => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join("");
    const visitorsPath = line("visitors");
    const visitorsArea = data.length ? `${visitorsPath}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z` : "";
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
    const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 70))));
    return { x, y, max, ticks, visitorsPath, visitorsArea, viewsPath: line("views"), labelEvery };
  }, [data, width]);

  function onMove(e: PointerEvent<SVGRectElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    setHover(Math.min(data.length - 1, Math.max(0, Math.round(rel * (data.length - 1)))));
  }

  const total = data.reduce((s, d) => ({ views: s.views + d.views, visitors: s.visitors + d.visitors }), { views: 0, visitors: 0 });
  const h = hover !== null ? data[hover] : null;

  return (
    <section className="min-w-0 rounded-lg border border-line bg-raised p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Traffic {hourly ? "by hour" : "by day"}</h2>
        <ul className="flex items-center gap-4 text-xs text-muted" aria-label="Legend">
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" aria-hidden />
            Unique visitors
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-[#eb6834] dark:bg-[#d95926]" aria-hidden />
            Page views
          </li>
        </ul>
      </div>

      <div ref={wrap} className="relative mt-3">
        <svg width="100%" height={H} viewBox={`0 0 ${width} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Line chart of unique visitors and page views ${hourly ? "by hour" : "by day"}. Peak ${fmtNumber(max)}.`} className="block max-w-full">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={t === 0 ? 1 : 0.75} strokeDasharray={t === 0 ? undefined : "2 4"} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[10px] tabular-nums">
                {fmtNumber(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            i % labelEvery === 0 || (i === data.length - 1 && (data.length - 1) % labelEvery >= labelEvery / 2) ? (
              <text key={d.key} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="fill-muted text-[10px]">
                {d.label}
              </text>
            ) : null,
          )}

          <path d={visitorsArea} className="fill-[#2a78d6]/10 dark:fill-[#3987e5]/15" />
          <path d={viewsPath} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="stroke-[#eb6834] dark:stroke-[#d95926]" />
          <path d={visitorsPath} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="stroke-[#2a78d6] dark:stroke-[#3987e5]" />

          {h && hover !== null && (
            <g aria-hidden>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={H - PAD.bottom} className="stroke-line-strong" strokeWidth={1} />
              <circle cx={x(hover)} cy={y(h.views)} r={4.5} strokeWidth={2} className="fill-[#eb6834] stroke-raised dark:fill-[#d95926]" />
              <circle cx={x(hover)} cy={y(h.visitors)} r={4.5} strokeWidth={2} className="fill-[#2a78d6] stroke-raised dark:fill-[#3987e5]" />
            </g>
          )}

          {/* Hit area larger than the marks: the whole plot. */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={Math.max(0, width - PAD.left - PAD.right)}
            height={H - PAD.top - PAD.bottom}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
            style={{ touchAction: "pan-y" }}
          />
        </svg>

        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-44 rounded-lg border border-line bg-bg/95 p-3 text-xs shadow-lg backdrop-blur"
            style={{ left: Math.min(Math.max(x(hover) - 88, 0), width - 176) }}
          >
            <p className="font-medium">{h.label}</p>
            <dl className="mt-2 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-muted">
                  <span className="size-2 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" aria-hidden />
                  Visitors
                </dt>
                <dd className="font-medium tabular-nums">{fmtNumber(h.visitors)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-muted">
                  <span className="size-2 rounded-full bg-[#eb6834] dark:bg-[#d95926]" aria-hidden />
                  Page views
                </dt>
                <dd className="font-medium tabular-nums">{fmtNumber(h.views)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs text-muted hover:text-fg">View as table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded border border-line">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-raised text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-medium">{hourly ? "Hour" : "Date"}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Unique visitors</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Page views</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className="border-t border-line">
                  <td className="px-3 py-1.5">{d.label}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmtNumber(d.visitors)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmtNumber(d.views)}</td>
                </tr>
              ))}
              <tr className="border-t border-line-strong font-medium">
                <td className="px-3 py-1.5">Sum of {hourly ? "hours" : "days"}</td>
                <td className="px-3 py-1.5 text-right tabular-nums">{fmtNumber(total.visitors)}</td>
                <td className="px-3 py-1.5 text-right tabular-nums">{fmtNumber(total.views)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
