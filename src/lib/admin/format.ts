const nf = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const fmtNumber = (n: number) => (n >= 100_000 ? compact.format(n) : nf.format(Math.round(n)));
export const fmtPercent = (n: number, digits = 1) => `${(n * 100).toFixed(digits).replace(/\.0$/, "")}%`;
export const fmtDecimal = (n: number) => n.toFixed(2).replace(/\.?0+$/, "") || "0";

export function fmtDuration(ms: number) {
  if (!ms) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return m < 60 ? `${m}m ${String(rest).padStart(2, "0")}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** Relative change vs the previous period; null when there's no baseline. */
export function delta(current: number, previous: number) {
  if (!previous) return current ? null : 0;
  return (current - previous) / previous;
}

export function fmtDateTime(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: tz }).format(d);
}

const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
export function countryName(code: string) {
  if (!code) return "Unknown";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** 🇺🇸-style flag from an ISO country code, used as a compact visual cue beside the name. */
export function countryFlag(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
