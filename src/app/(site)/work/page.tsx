import type { Metadata } from "next";
import { projects, projectCategories } from "@/data/projects";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallToAction } from "@/components/shared/CallToAction";
import { WorkExplorer } from "@/components/sections/work/WorkExplorer";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Idea Kraft: e-commerce, web platforms, immersive digital experiences, WordPress builds, branding and email systems.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        index={String(projects.length).padStart(2, "0")}
        title={["Selected", "work."]}
        intro="Case studies from across our disciplines. Filter by the kind of project you're planning, or switch to the index for a quick scan."
      />
      <section aria-label="Projects" className="container-x pb-28 md:pb-40">
        <WorkExplorer projects={projects} categories={projectCategories} />
      </section>
      <CallToAction title={["Your project", "could be next."]} />
    </>
  );
}
