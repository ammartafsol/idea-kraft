import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/**
 * Shared editorial section header: an indexed eyebrow, a large staggered
 * title, and an optional aside (intro copy or a link) on the right.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  aside,
  className,
  titleClassName,
  titleId,
}: {
  index?: string;
  eyebrow: string;
  title: string[];
  aside?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  titleId?: string;
}) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <SplitText id={titleId} lines={title} className={cn("display-lg mt-6", titleClassName)} />
      </div>
      {aside && (
        <Reveal delay={0.2} className="md:col-span-4 md:pb-2">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
