import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db/mongo";
import { PageView } from "@/lib/db/models";
import { classifyUserAgent, isBot, referrerHost } from "@/lib/analytics/user-agent";
import { rateLimit } from "@/lib/rate-limit";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin/token";

/*
 * First-party, cookieless page-view collection.
 * Accepts JSON from fetch() or text/plain from navigator.sendBeacon().
 */

const id = z.string().regex(/^[a-zA-Z0-9-]{8,64}$/);

const viewSchema = z.object({
  type: z.literal("view"),
  id,
  path: z.string().startsWith("/").max(300),
  title: z.string().max(200).optional().default(""),
  referrer: z.string().max(1000).optional().default(""),
  visitorId: id,
  sessionId: id,
  isNewVisitor: z.boolean(),
  isNewSession: z.boolean(),
  utmSource: z.string().max(100).optional().default(""),
});

const leaveSchema = z.object({
  type: z.literal("leave"),
  id,
  visitorId: id,
  duration: z.number().int().min(0),
});

const payloadSchema = z.discriminatedUnion("type", [viewSchema, leaveSchema]);

const MAX_DURATION_MS = 30 * 60 * 1000;
const ok = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  // Always answer quickly and quietly; analytics must never break the site.
  if (!isDatabaseConfigured()) return ok();

  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return ok();

  // Never count the site owner: requests from a signed-in admin are ignored.
  if (await verifySession(req.cookies.get(ADMIN_COOKIE)?.value).catch(() => null)) return ok();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`track:${ip}`, 240, 60_000).ok) return ok();

  const raw = await req.text();
  if (raw.length > 4000) return ok();

  let parsed;
  try {
    parsed = payloadSchema.safeParse(JSON.parse(raw));
  } catch {
    return ok();
  }
  if (!parsed.success) return ok();
  const data = parsed.data;

  try {
    await connectToDatabase();

    if (data.type === "leave") {
      await PageView.updateOne(
        { _id: data.id, visitorId: data.visitorId },
        { $max: { duration: Math.min(data.duration, MAX_DURATION_MS) } },
      );
      return ok();
    }

    if (data.path.startsWith("/admin") || data.path.startsWith("/api")) return ok();

    const { device, browser, os } = classifyUserAgent(ua);
    await PageView.updateOne(
      { _id: data.id },
      {
        $setOnInsert: {
          path: data.path.split("?")[0].replace(/\/+$/, "") || "/",
          title: data.title,
          visitorId: data.visitorId,
          sessionId: data.sessionId,
          isNewVisitor: data.isNewVisitor,
          isNewSession: data.isNewSession,
          referrer: referrerHost(data.referrer, req.headers.get("host") ?? ""),
          utmSource: data.utmSource.toLowerCase(),
          device,
          browser,
          os,
          // Set by Vercel and most CDNs. Only the country code is stored, never the IP.
          country: (req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "").slice(0, 2).toUpperCase(),
          ts: new Date(),
        },
      },
      { upsert: true }, // idempotent: a retried beacon never double-counts
    );
  } catch (error) {
    console.error("[track] failed", error);
  }
  return ok();
}
