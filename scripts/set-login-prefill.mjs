#!/usr/bin/env node
/**
 * Saves the admin login-form pre-fill to MongoDB (settings collection, key "loginPrefill").
 * The login page fills the username/password inputs with these values.
 * WARNING: with a password saved, anyone who opens /admin/login can sign in (test site only).
 *
 * Values are read from the env file (never typed on the command line):
 *   ADMIN_LOGIN_PREFILL_USERNAME (default "admin")
 *   ADMIN_LOGIN_PREFILL_PASSWORD
 *
 * Usage:
 *   npm run admin:prefill                          # development DB (.env.local)
 *   npm run admin:prefill -- --env .env.vercel     # production DB
 *   npm run admin:prefill -- --env .env.vercel --clear   # turn the pre-fill off
 */

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const mongoose = createRequire(import.meta.url)("mongoose");
const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? undefined : args[i + 1];
};
const envFile = flag("env") ?? ".env.local";
const env = {};
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const uri = env.MONGODB_URI ?? process.env.MONGODB_URI;
if (!uri) {
  console.error(`✖ MONGODB_URI not found in ${envFile}.`);
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
const settings = mongoose.connection.db.collection("settings");
try {
  if (args.includes("--clear")) {
    await settings.deleteOne({ _id: "loginPrefill" });
    console.log("✔ Login pre-fill removed.");
  } else {
    const username = env.ADMIN_LOGIN_PREFILL_USERNAME || "admin";
    const password = env.ADMIN_LOGIN_PREFILL_PASSWORD;
    if (!password) throw new Error(`ADMIN_LOGIN_PREFILL_PASSWORD is not set in ${envFile}.`);
    await settings.updateOne({ _id: "loginPrefill" }, { $set: { username, password, updatedAt: new Date() } }, { upsert: true });
    console.log(`✔ Login pre-fill saved for "${username}" in database "${mongoose.connection.name}".`);
  }
} catch (e) {
  console.error(`✖ ${e.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
