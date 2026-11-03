import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db/mongo";
import { Inquiry } from "@/lib/db/models";

const MIN_FILL_TIME_MS = 3000;
const MAX_BODY_BYTES = 16_000;

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still subject to every other check
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 415 });
  }

  const limited = rateLimit(`contact:${clientIp(req)}`);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this connection. Please try again a little later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "That message is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key === "website" || key === "startedAt" || key === "visitorId") continue;
      fieldErrors[key] ??= issue.message;
    }
    // Bot heuristics failed (honeypot / timestamp): pretend success, store nothing.
    if (Object.keys(fieldErrors).length === 0) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const { website, startedAt, visitorId, ...submission } = parsed.data;

  // Spam heuristics: filled honeypot or a form completed impossibly fast.
  if (website || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  const country = (req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "").slice(0, 2).toUpperCase();
  const payload = {
    ...submission,
    company: submission.company ?? "",
    receivedAt: new Date().toISOString(),
  };

  // Delivery: save to the database (shown in /admin/inquiries) and/or forward to a webhook.
  // The request succeeds if at least one configured channel accepted it.
  let stored = false;
  let forwarded = false;
  const channels = { db: isDatabaseConfigured(), webhook: Boolean(process.env.CONTACT_WEBHOOK_URL) };

  if (channels.db) {
    try {
      await connectToDatabase();
      await Inquiry.create({ ...submission, company: submission.company ?? "", country, visitorId: visitorId ?? "" });
      stored = true;
    } catch (error) {
      console.error("[contact] database save failed", error);
    }
  }

  if (channels.webhook) {
    try {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: `New project enquiry from ${payload.name} <${payload.email}>`, ...payload }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      forwarded = true;
    } catch (error) {
      console.error("[contact] webhook delivery failed", error);
    }
  }

  if (!channels.db && !channels.webhook) {
    console.info("[contact] new enquiry (configure MONGODB_URI or CONTACT_WEBHOOK_URL to keep these):", payload);
  } else if (!stored && !forwarded) {
    return NextResponse.json(
      { ok: false, error: "We couldn't deliver your message just now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
