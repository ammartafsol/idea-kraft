// Password hashing shared by the app (login) and scripts/create-admin.mjs.
// Plain JS (.mjs) so the Node script can import it without a TypeScript build step.
//
// Format: scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>
// scrypt is a memory-hard KDF built into Node, so no extra dependency is needed.

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const N = 2 ** 15; // CPU/memory cost
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 64 * 1024 * 1024;

/** @param {string} password @param {Buffer} salt @param {number} n @param {number} r @param {number} p @returns {Promise<Buffer>} */
function derive(password, salt, n, r, p) {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, { N: n, r, p, maxmem: MAX_MEM }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

/** Hashes a password with a fresh random salt. @param {string} password @returns {Promise<string>} */
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/** Constant-time comparison against a stored hash. @param {string} password @param {string} stored @returns {Promise<boolean>} */
export async function verifyPassword(password, stored) {
  const parts = String(stored).split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  try {
    const expected = Buffer.from(hashB64, "base64");
    const key = await derive(password, Buffer.from(saltB64, "base64"), Number(n), Number(r), Number(p));
    return key.length === expected.length && timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

/** Minimum rules for admin passwords. @param {string} password @returns {string | null} an error message, or null if acceptable */
export function passwordProblem(password) {
  if (password.length < 12) return "Use at least 12 characters.";
  if (password.length > 200) return "That password is too long.";
  if (/^(.)\1+$/.test(password)) return "Avoid repeating a single character.";
  return null;
}
