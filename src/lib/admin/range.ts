import { siteConfig } from "@/data/site";

/**
 * Date ranges for the admin dashboard. Days are counted in the studio's time
 * zone, so "Today" means today in Binghamton regardless of where the admin is.
 */
export const TZ = siteConfig.address.timeZone;

export const rangePresets = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "12m", label: "12 months", days: 365 },
] as const;

export type RangeKey = (typeof rangePresets)[number]["key"] | "custom";

export type DateRange = {
  key: RangeKey;
  label: string;
  fromYmd: string; // inclusive, studio time zone
  toYmd: string; // inclusive
  from: Date; // UTC instant at start of fromYmd
  to: Date; // UTC instant at end of toYmd (exclusive)
  prevFrom: Date;
  prevTo: Date;
  days: number;
  hourly: boolean;
};

const YMD = /^\d{4}-\d{2}-\d{2}$/;

function tzOffsetMs(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - date.getTime();
}

/** UTC instant of local midnight for a YYYY-MM-DD date in `tz` (DST-safe). */
export function startOfDay(ymd: string, tz = TZ) {
  const [y, m, d] = ymd.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - tzOffsetMs(new Date(guess), tz);
  const corrected = guess - tzOffsetMs(new Date(t), tz);
  if (corrected !== t) t = corrected;
  return new Date(t);
}

export function todayYmd(tz = TZ) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function addDays(ymd: string, n: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000) + 1;
}

export function parseRange(params: { range?: string; from?: string; to?: string }): DateRange {
  const today = todayYmd();
  let key = (params.range ?? "30d") as RangeKey;
  let fromYmd: string;
  let toYmd = today;

  if (key === "custom" && params.from && YMD.test(params.from)) {
    fromYmd = params.from;
    toYmd = params.to && YMD.test(params.to) ? params.to : today;
    if (fromYmd > toYmd) [fromYmd, toYmd] = [toYmd, fromYmd];
    // Keep custom ranges sane (max ~2 years).
    if (daysBetween(fromYmd, toYmd) > 731) fromYmd = addDays(toYmd, -730);
  } else {
    const preset = rangePresets.find((p) => p.key === key) ?? rangePresets[2];
    key = preset.key;
    fromYmd = addDays(today, -(preset.days - 1));
  }

  const days = daysBetween(fromYmd, toYmd);
  const from = startOfDay(fromYmd);
  const to = startOfDay(addDays(toYmd, 1));
  const span = to.getTime() - from.getTime();
  const fmt = (ymd: string) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${ymd}T00:00:00Z`));
  const label =
    key === "custom" ? `${fmt(fromYmd)} – ${fmt(toYmd)}` : (rangePresets.find((p) => p.key === key)?.label ?? "30 days");

  return {
    key,
    label,
    fromYmd,
    toYmd,
    from,
    to,
    prevFrom: new Date(from.getTime() - span),
    prevTo: from,
    days,
    hourly: days === 1,
  };
}

/** Query-string helper so links and filters keep the current range. */
export function rangeQuery(r: DateRange) {
  return r.key === "custom" ? `range=custom&from=${r.fromYmd}&to=${r.toYmd}` : `range=${r.key}`;
}
