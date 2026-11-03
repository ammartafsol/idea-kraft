import { describe, expect, it } from "vitest";
import { getAdjacentProjects, getFeaturedProjects, getProject, projects } from "./projects";
import { getAllPosts, getRelatedPosts, posts, readingTime } from "./posts";
import { services, disciplines } from "./services";

describe("projects", () => {
  it("has unique slugs", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it("features the four requested projects in order", () => {
    expect(getFeaturedProjects().map((p) => p.title)).toEqual([
      "Acommify",
      "The Coach Huddle",
      "Havera",
      "NOVA Architecture",
    ]);
  });

  it("wraps next/previous navigation", () => {
    const first = projects[0].slug;
    const last = projects[projects.length - 1].slug;
    expect(getAdjacentProjects(first).prev.slug).toBe(last);
    expect(getAdjacentProjects(last).next.slug).toBe(first);
  });

  it("only references services' related projects that exist", () => {
    for (const s of services) for (const slug of s.relatedProjects) expect(getProject(slug)).toBeDefined();
  });
});

describe("services", () => {
  it("homepage disciplines link to real service anchors", () => {
    const anchors = new Set(services.map((s) => `/services#${s.slug}`));
    for (const d of disciplines) expect(anchors.has(d.href)).toBe(true);
  });
});

describe("posts", () => {
  it("has unique slugs and sorts newest first", () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
    const dates = getAllPosts().map((p) => +new Date(p.date));
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it("reports at least one minute of reading time", () => {
    for (const p of posts) expect(readingTime(p)).toBeGreaterThanOrEqual(1);
  });

  it("returns related posts without the current one, same category first", () => {
    const related = getRelatedPosts("bulletproof-html-email");
    expect(related.find((p) => p.slug === "bulletproof-html-email")).toBeUndefined();
    expect(related[0].category).toBe("Development");
  });
});
