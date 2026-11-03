import { describe, expect, it } from "vitest";
import { validateLogin } from "./login-schema";

describe("login validation", () => {
  it("accepts a valid username and password", () => {
    const { data, errors } = validateLogin({ username: "  admin ", password: "a-long-enough-password" });
    expect(errors).toEqual({});
    expect(data?.username).toBe("admin");
  });

  it("requires both fields with specific messages", () => {
    const { errors } = validateLogin({ username: "", password: "" });
    expect(errors.username).toBe("Enter your username.");
    expect(errors.password).toBe("Enter your password.");
  });

  it("explains username rules", () => {
    expect(validateLogin({ username: "ab", password: "x".repeat(12) }).errors.username).toMatch(/at least 3/);
    expect(validateLogin({ username: "bad name!", password: "x".repeat(12) }).errors.username).toMatch(/letters, numbers/);
  });

  it("matches the account password policy (12+ characters)", () => {
    expect(validateLogin({ username: "admin", password: "short" }).errors.password).toMatch(/12/);
    expect(validateLogin({ username: "admin", password: "x".repeat(201) }).errors.password).toMatch(/too long/);
  });
});
