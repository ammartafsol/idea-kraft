import { describe, expect, it } from "vitest";
import { hashPassword, passwordProblem, verifyPassword } from "./password-hash.mjs";

describe("password hashing", () => {
  it("stores a salted scrypt hash, never the password", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(hash).not.toContain("correct horse battery");
  });

  it("uses a fresh salt each time", async () => {
    const [a, b] = await Promise.all([hashPassword("same-password-123"), hashPassword("same-password-123")]);
    expect(a).not.toBe(b);
  });

  it("verifies the right password and rejects others", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("Correct horse battery", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("rejects malformed stored values instead of throwing", async () => {
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(await verifyPassword("anything", "scrypt$1$2$3$$")).toBe(false);
  });

  it("enforces a minimum password standard", () => {
    expect(passwordProblem("short")).toMatch(/12/);
    expect(passwordProblem("aaaaaaaaaaaaaaaa")).not.toBeNull();
    expect(passwordProblem("a-decent-passphrase")).toBeNull();
  });
});
