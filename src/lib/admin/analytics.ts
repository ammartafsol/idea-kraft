import "server-only";
import type { PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongo";
import { Inquiry, PageView, type InquiryStatus } from "@/lib/db/models";
import { addDays, TZ, type DateRange } from "./range";

/*
 * Read-only queries behind the admin dashboard.
 * Unique counts use $addToSet. That's exact and simple, and comfortably fast
 * for an agency site's traffic (hundreds of thousands of views per range).
 */

const inRange = (from: Date, to: Date) => ({ ts: { $gte: from, $lt: to } });

export type Totals = {
  views: number;
  visitors: number;
  newVisitors: number;
  returningVisitors: number;
  sessions: number;
  pagesPerSession: number;
  avgDuration: number; // ms
  bounceRate: number; // 0..1
  inquiries: number;
  conversionRate: number; // inquiries / visitors
};

async function totalsFor(from: Date, to: Date): Promise<Totals> {
  const [agg] = await PageView.aggregate<{
    totals: { views: number; visitors: number; sessions: number; newVisitors: number; avgDuration: number }[];
    bounce: { sessions: number; single: number }[];
  }>([
    { $match: inRange(from, to) },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              views: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
              sessions: { $addToSet: "$sessionId" },
              newVisitors: { $addToSet: { $cond: ["$isNewVisitor", "$visitorId", "$$REMOVE"] } },
              durSum: { $sum: "$duration" },
              durCount: { $sum: { $cond: [{ $gt: ["$duration", 0] }, 1, 0] } },
            },
          },
          {
            $project: {
              views: 1,
              visitors: { $size: "$visitors" },
              sessions: { $size: "$sessions" },
              newVisitors: { $size: "$newVisitors" },
              avgDuration: { $cond: [{ $gt: ["$durCount", 0] }, { $divide: ["$durSum", "$durCount"] }, 0] },
            },
          },
        ],
        bounce: [
          { $group: { _id: "$sessionId", n: { $sum: 1 } } },
          { $group: { _id: null, sessions: { $sum: 1 }, single: { $sum: { $cond: [{ $eq: ["$n", 1] }, 1, 0] } } } },
        ],
      },
    },
  ]);

  const t = agg?.totals[0] ?? { views: 0, visitors: 0, sessions: 0, newVisitors: 0, avgDuration: 0 };
  const b = agg?.bounce[0] ?? { sessions: 0, single: 0 };
  const inquiries = await Inquiry.countDocuments({ createdAt: { $gte: from, $lt: to } });

  return {
    views: t.views,
    visitors: t.visitors,
    newVisitors: t.newVisitors,
    returningVisitors: Math.max(0, t.visitors - t.newVisitors),
    sessions: t.sessions,
    pagesPerSession: t.sessions ? t.views / t.sessions : 0,
    avgDuration: t.avgDuration,
    bounceRate: b.sessions ? b.single / b.sessions : 0,
    inquiries,
    conversionRate: t.visitors ? inquiries / t.visitors : 0,
  };
}

export async function getTotals(r: DateRange) {
  await connectToDatabase();
  const [current, previous] = await Promise.all([totalsFor(r.from, r.to), totalsFor(r.prevFrom, r.prevTo)]);
  return { current, previous };
}

export type SeriesPoint = { key: string; label: string; views: number; visitors: number };

/** Daily buckets (hourly for a single day), gap-filled so the chart has no holes. */
export async function getTimeseries(r: DateRange): Promise<SeriesPoint[]> {
  await connectToDatabase();
  const format = r.hourly ? "%H" : "%Y-%m-%d";
  const rows = await PageView.aggregate<{ _id: string; views: number; visitors: number }>([
    { $match: inRange(r.from, r.to) },
    { $group: { _id: { $dateToString: { format, date: "$ts", timezone: TZ } }, views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
    { $project: { views: 1, visitors: { $size: "$visitors" } } },
  ]);
  const byKey = new Map(rows.map((x) => [x._id, x]));

  if (r.hourly) {
    return Array.from({ length: 24 }, (_, h) => {
      const key = String(h).padStart(2, "0");
      const label = new Intl.DateTimeFormat("en-US", { hour: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(2000, 0, 1, h)));
      return { key, label, views: byKey.get(key)?.views ?? 0, visitors: byKey.get(key)?.visitors ?? 0 };
    });
  }

  return Array.from({ length: r.days }, (_, i) => {
    const key = addDays(r.fromYmd, i);
    const label = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${key}T00:00:00Z`));
    return { key, label, views: byKey.get(key)?.views ?? 0, visitors: byKey.get(key)?.visitors ?? 0 };
  });
}

export type PageRow = { path: string; views: number; visitors: number; entries: number; avgDuration: number };
export const pageSortKeys = ["views", "visitors", "entries", "avgDuration", "path"] as const;
export type PageSort = (typeof pageSortKeys)[number];

export async function getTopPages(
  r: DateRange,
  opts: { sort?: PageSort; dir?: "asc" | "desc"; q?: string; limit?: number } = {},
): Promise<PageRow[]> {
  await connectToDatabase();
  const sort = pageSortKeys.includes(opts.sort as PageSort) ? (opts.sort as PageSort) : "views";
  const dir = opts.dir === "asc" ? 1 : -1;
  const match: Record<string, unknown> = inRange(r.from, r.to);
  if (opts.q) match.path = { $regex: escapeRegex(opts.q), $options: "i" };

  return PageView.aggregate<PageRow>([
    { $match: match },
    {
      $group: {
        _id: "$path",
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        entries: { $sum: { $cond: ["$isNewSession", 1, 0] } },
        durSum: { $sum: "$duration" },
        durCount: { $sum: { $cond: [{ $gt: ["$duration", 0] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        path: "$_id",
        views: 1,
        entries: 1,
        visitors: { $size: "$visitors" },
        avgDuration: { $cond: [{ $gt: ["$durCount", 0] }, { $divide: ["$durSum", "$durCount"] }, 0] },
      },
    },
    { $sort: { [sort]: dir, path: 1 } as Record<string, 1 | -1> },
    { $limit: opts.limit ?? 200 },
  ]);
}

export type BreakdownField = "referrer" | "device" | "browser" | "os" | "country" | "utmSource";
export type BreakdownRow = { label: string; visitors: number };

/** Unique visitors grouped by one dimension (top N + "Other"). */
export async function getBreakdown(r: DateRange, field: BreakdownField, limit = 7): Promise<BreakdownRow[]> {
  await connectToDatabase();
  const rows = await PageView.aggregate<{ _id: string; visitors: number }>([
    { $match: inRange(r.from, r.to) },
    { $group: { _id: `$${field}`, visitors: { $addToSet: "$visitorId" } } },
    { $project: { visitors: { $size: "$visitors" } } },
    { $sort: { visitors: -1 } },
  ]);
  const named = rows.map((x) => ({ label: x._id || (field === "referrer" ? "Direct / none" : "Unknown"), visitors: x.visitors }));
  if (named.length <= limit) return named;
  const head = named.slice(0, limit);
  const other = named.slice(limit).reduce((sum, x) => sum + x.visitors, 0);
  return [...head, { label: "Other", visitors: other }];
}

export async function getLiveVisitors() {
  await connectToDatabase();
  const ids = await PageView.distinct("visitorId", { ts: { $gte: new Date(Date.now() - 5 * 60_000) } });
  return ids.length;
}

export type SessionRow = {
  sessionId: string;
  visitorId: string;
  start: Date;
  end: Date;
  views: number;
  pages: string[];
  isNewVisitor: boolean;
  country: string;
  device: string;
  browser: string;
  referrer: string;
  duration: number;
};

export async function getSessions(
  r: DateRange,
  opts: { page?: number; type?: "new" | "returning"; device?: string } = {},
): Promise<{ rows: SessionRow[]; total: number; pageSize: number }> {
  await connectToDatabase();
  const pageSize = 25;
  const page = Math.max(1, opts.page ?? 1);
  const match: Record<string, unknown> = inRange(r.from, r.to);
  if (opts.device && ["desktop", "mobile", "tablet"].includes(opts.device)) match.device = opts.device;

  const after: PipelineStage[] = [];
  if (opts.type === "new") after.push({ $match: { isNewVisitor: true } });
  if (opts.type === "returning") after.push({ $match: { isNewVisitor: false } });

  const [res] = await PageView.aggregate<{ rows: SessionRow[]; count: { n: number }[] }>([
    { $match: match },
    { $sort: { ts: 1 } },
    {
      $group: {
        _id: "$sessionId",
        visitorId: { $first: "$visitorId" },
        start: { $min: "$ts" },
        end: { $max: "$ts" },
        views: { $sum: 1 },
        pages: { $push: "$path" },
        isNewVisitor: { $max: "$isNewVisitor" },
        country: { $first: "$country" },
        device: { $first: "$device" },
        browser: { $first: "$browser" },
        referrer: { $first: "$referrer" },
        duration: { $sum: "$duration" },
      },
    },
    ...after,
    { $sort: { start: -1 } },
    {
      $facet: {
        rows: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }, { $addFields: { sessionId: "$_id" } }, { $project: { _id: 0 } }],
        count: [{ $count: "n" }],
      },
    },
  ]);
  return { rows: res?.rows ?? [], total: res?.count[0]?.n ?? 0, pageSize };
}

/* ---------------------------------- Inquiries ---------------------------------- */

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  country: string;
  visitorId: string;
  createdAt: Date;
};

export async function getInquiries(opts: { status?: string; q?: string; page?: number; sort?: "newest" | "oldest" }) {
  await connectToDatabase();
  const pageSize = 20;
  const page = Math.max(1, opts.page ?? 1);
  const filter: Record<string, unknown> = {};
  if (opts.status && ["new", "read", "replied", "archived"].includes(opts.status)) filter.status = opts.status;
  if (opts.q) {
    const rx = { $regex: escapeRegex(opts.q), $options: "i" };
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { message: rx }, { projectType: rx }];
  }

  const [docs, total, byStatus] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: opts.sort === "oldest" ? 1 : -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Inquiry.countDocuments(filter),
    Inquiry.aggregate<{ _id: InquiryStatus; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);

  const counts = { all: 0, new: 0, read: 0, replied: 0, archived: 0 } as Record<"all" | InquiryStatus, number>;
  byStatus.forEach((s) => {
    counts[s._id] = s.n;
    counts.all += s.n;
  });

  return { rows: docs.map(toInquiryRow), total, pageSize, counts };
}

export async function getAllInquiries() {
  await connectToDatabase();
  return (await Inquiry.find({}).sort({ createdAt: -1 }).lean()).map(toInquiryRow);
}

export async function getNewInquiryCount() {
  await connectToDatabase();
  return Inquiry.countDocuments({ status: "new" });
}

/** The pages a visitor viewed before (and up to) sending an enquiry. */
export async function getVisitorJourney(visitorId: string, until: Date) {
  if (!visitorId) return [];
  await connectToDatabase();
  return PageView.find({ visitorId, ts: { $lte: until } }, { path: 1, ts: 1, _id: 0 }).sort({ ts: -1 }).limit(15).lean();
}

function toInquiryRow(d: Record<string, unknown>): InquiryRow {
  return {
    id: String(d._id),
    name: String(d.name ?? ""),
    email: String(d.email ?? ""),
    company: String(d.company ?? ""),
    projectType: String(d.projectType ?? ""),
    budget: String(d.budget ?? ""),
    message: String(d.message ?? ""),
    status: (d.status as InquiryStatus) ?? "new",
    country: String(d.country ?? ""),
    visitorId: String(d.visitorId ?? ""),
    createdAt: d.createdAt as Date,
  };
}

function escapeRegex(s: string) {
  return s.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
