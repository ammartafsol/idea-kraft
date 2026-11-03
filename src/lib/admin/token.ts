/**
 * Stateless admin session token: base64url(JSON payload) + "." + HMAC-SHA256.
 * Uses only Web Crypto, so it works in the proxy and in server code alike.
 */

export const ADMIN_COOKIE = "novara_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** u = username, v = fingerprint of the password hash (a reset invalidates old sessions), exp = expiry (s). */
export type SessionPayload = { u: string; v: string; exp: number };

const encoder = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function key() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set (32+ characters).");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(username: string, version: string) {
  const payload: SessionPayload = { u: username, v: version, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = b64url(encoder.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await key(), encoder.encode(body));
  return `${body}.${b64url(sig)}`;
}

/** Returns the payload of a valid, unexpired token, otherwise null. Signature check is constant-time. */
export async function verifySession(token: string | undefined | null) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const valid = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), encoder.encode(body));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now() || typeof payload.u !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}
