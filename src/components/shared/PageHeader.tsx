import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/** Opening block for inner pages: indexed label, oversized h1, and intro copy offset on the grid. */
export function PageHeader({
  eyebrow,
  index,
  title,
  intro,
  children,
  className,
}: {
  eyebrow: string;
  index?: string;
  title: string[];
  intro?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-x pt-36 pb-16 md:pt-48 md:pb-24", className)}>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <SplitText as="h1" immediate delay={0.25} lines={title} className="display-xl mt-8 uppercase" />
      {(intro || children) && (
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          {intro && (
            <Reveal delay={0.5} className="lede text-muted md:col-span-6 md:col-start-7">
              {intro}
            </Reveal>
          )}
          {children}
        </div>
      )}
    </header>
  );
}
