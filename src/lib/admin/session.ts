import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongo";
import { Admin } from "@/lib/db/models";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./token";

/** Admin accounts live in MongoDB; the only env requirements are the database and the cookie-signing secret. */
export function isAdminConfigured() {
  return Boolean(process.env.MONGODB_URI && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

/** Short, non-reversible fingerprint of the stored hash: changes whenever the password is reset. */
export function sessionVersion(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}

export async function createAdminSession(username: string, passwordHash: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, await signSession(username, sessionVersion(passwordHash)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function getAdmin() {
  if (!isAdminConfigured()) return null;
  const session = await verifySession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session) return null;
  // Deleting an admin or resetting their password ends existing sessions immediately.
  await connectToDatabase();
  const admin = await Admin.findOne({ username: session.u }, { passwordHash: 1 }).lean();
  return admin && sessionVersion(admin.passwordHash) === session.v ? session.u : null;
}

/** Login-form pre-fill stored in MongoDB (settings collection, key "loginPrefill"). */
export async function getLoginPrefill() {
  if (!process.env.MONGODB_URI) return null;
  const db = (await connectToDatabase()).connection.db;
  const doc = await db?.collection("settings").findOne<{ username?: string; password?: string }>({ _id: "loginPrefill" as never });
  return doc ? { username: doc.username, password: doc.password } : null;
}

/**
 * Call at the top of every admin page and Server Action. The proxy redirects
 * early, but authorization is always re-checked where data is read or written.
 */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
