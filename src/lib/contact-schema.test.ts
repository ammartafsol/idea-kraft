import { describe, expect, it } from "vitest";
import { contactSchema, serviceToProjectType, projectTypes } from "./contact-schema";
import { services } from "@/data/services";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  projectType: "E-commerce",
  budget: "Not sure yet",
  message: "We need a new storefront for our ceramics brand.",
  website: "",
  startedAt: Date.now() - 10_000,
};

describe("contactSchema", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email and a short message with friendly errors", () => {
    const result = contactSchema.safeParse({ ...valid, email: "nope", message: "hi" });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((i) => i.path[0]);
    expect(fields).toContain("email");
    expect(fields).toContain("message");
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });

  it("rejects unknown project types and budgets", () => {
    expect(contactSchema.safeParse({ ...valid, projectType: "Crypto" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, budget: "$1" }).success).toBe(false);
  });
});

describe("serviceToProjectType", () => {
  it("maps every service on /services to a valid project type", () => {
    for (const s of services) {
      expect(projectTypes).toContain(serviceToProjectType[s.slug]);
    }
  });
});
