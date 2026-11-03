"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongo";
import { Admin, Inquiry, inquiryStatuses, type InquiryStatus } from "@/lib/db/models";
import { hashPassword, verifyPassword } from "./password-hash.mjs";
import { validateLogin, type LoginFieldErrors } from "./login-schema";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminSession, destroyAdminSession, isAdminConfigured, requireAdmin } from "./session";

/** Compared against when the username doesn't exist, so a wrong username takes as long as a wrong password. */
let dummyHash: Promise<string> | null = null;

/**
 * `username` is echoed back so the field keeps its value after a failed attempt
 * (React resets forms after actions). `fieldErrors` mirrors client-side validation.
 */
export type LoginState = { error?: string; fieldErrors?: LoginFieldErrors; username?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Admin access isn't configured on this server. Set MONGODB_URI and ADMIN_SESSION_SECRET." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`admin-login:${ip}`, 6, 15 * 60_000).ok) {
    return { error: "Too many attempts. Please wait 15 minutes and try again.", username: String(formData.get("username") ?? "") };
  }

  // Same rules as the form; never trust the client.
  const raw = { username: formData.get("username") ?? "", password: formData.get("password") ?? "" };
  const { data, errors } = validateLogin(raw);
  if (!data) return { fieldErrors: errors, username: String(raw.username) };
  const username = data.username.toLowerCase();
  const password = data.password;

  await connectToDatabase();
  const admin = await Admin.findOne({ username }, { passwordHash: 1 }).lean();
  dummyHash ??= hashPassword(crypto.randomUUID());
  const valid = await verifyPassword(password, admin?.passwordHash ?? (await dummyHash));

  if (!admin || !valid) {
    if (!admin && (await Admin.estimatedDocumentCount()) === 0) {
      return { error: "No admin account exists yet. Create one with: npm run admin:create", username };
    }
    return { error: "Those credentials don't match.", username };
  }

  await Admin.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
  await createAdminSession(username, admin.passwordHash);
  const next = String(formData.get("next") ?? "");
  // Only ever redirect inside the admin area (prevents open redirects).
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  if (!isValidObjectId(id) || !inquiryStatuses.includes(status)) return;
  await connectToDatabase();
  await Inquiry.updateOne({ _id: id }, { $set: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  if (!isValidObjectId(id)) return;
  await connectToDatabase();
  await Inquiry.deleteOne({ _id: id });
  revalidatePath("/admin", "layout");
}
