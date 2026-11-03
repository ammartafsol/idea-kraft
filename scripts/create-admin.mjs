#!/usr/bin/env node
/**
 * Create an admin account, or reset an existing admin's password.
 * The password is stored only as a salted scrypt hash in MongoDB (collection: admins).
 *
 * Usage:
 *   npm run admin:create                            # uses .env.local (development database)
 *   npm run admin:create -- --env .env.vercel       # production database
 *   npm run admin:create -- --username alice        # skip the username prompt
 *   npm run admin:create -- --list                  # list admin usernames
 *   npm run admin:create -- --delete alice          # remove an admin
 *
 * You'll be asked for the password twice; typing is hidden.
 * For automation, set NEW_ADMIN_PASSWORD instead (kept out of shell history, unlike a CLI flag).
 */

import { readFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { createRequire } from "node:module";
import { hashPassword, passwordProblem } from "../src/lib/admin/password-hash.mjs";

const require = createRequire(import.meta.url);
const mongoose = require("mongoose");

// ---------- args & env ----------
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : (args[i + 1] ?? "");
};
const has = (name) => args.includes(`--${name}`);

const envFile = flag("env") ?? (existsSync(".env.local") ? ".env.local" : ".env");
if (!process.env.MONGODB_URI && existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(`✖ MONGODB_URI not found (looked in ${envFile} and the environment).`);
  process.exit(1);
}

// ---------- prompts ----------
function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Echo nothing while the password is typed.
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

const dbName = (() => {
  try {
    return new URL(uri.replace(/^mongodb\+srv:/, "https:")).pathname.slice(1) || "(default)";
  } catch {
    return "(unknown)";
  }
})();

// ---------- main ----------
await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
const admins = mongoose.connection.db.collection("admins");
await admins.createIndex({ username: 1 }, { unique: true });
console.log(`• Connected to database "${dbName}" (env: ${envFile})`);

try {
  if (has("list")) {
    const rows = await admins.find({}, { projection: { username: 1, createdAt: 1, lastLoginAt: 1 } }).toArray();
    if (!rows.length) console.log("No admins yet.");
    for (const r of rows) console.log(`  ${r.username}  (created ${r.createdAt?.toISOString().slice(0, 10)}, last login ${r.lastLoginAt?.toISOString().slice(0, 16) ?? "never"})`);
  } else if (flag("delete")) {
    const username = flag("delete").toLowerCase();
    const res = await admins.deleteOne({ username });
    console.log(res.deletedCount ? `✔ Deleted admin "${username}".` : `No admin named "${username}".`);
  } else {
    const username = (flag("username") || (await ask("Admin username: "))).toLowerCase();
    if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new Error("Username must be 3–40 characters: letters, numbers, dot, dash or underscore.");

    const existing = await admins.findOne({ username });
    if (existing) console.log(`• "${username}" exists; this will reset their password.`);

    // Non-interactive use (CI/automation): NEW_ADMIN_PASSWORD=... npm run admin:create -- --username x
    const preset = process.env.NEW_ADMIN_PASSWORD;
    const password = preset ?? (await ask("Password (hidden): ", { hidden: true }));
    const problem = passwordProblem(password);
    if (problem) throw new Error(problem);
    if (!preset) {
      const confirm = await ask("Confirm password (hidden): ", { hidden: true });
      if (confirm !== password) throw new Error("Passwords don't match.");
    }

    const passwordHash = await hashPassword(password);
    await admins.updateOne(
      { username },
      { $set: { passwordHash, updatedAt: new Date() }, $setOnInsert: { username, createdAt: new Date() } },
      { upsert: true },
    );
    console.log(`✔ ${existing ? "Password reset for" : "Created admin"} "${username}". Only a scrypt hash was stored.`);
  }
} catch (error) {
  console.error(`✖ ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
