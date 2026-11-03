import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/** Live-looking availability indicator. Edit `siteConfig.availability` to change it everywhere. */
export function StatusPill({ className }: { className?: string }) {
  const { open, label } = siteConfig.availability;
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line bg-raised/60 py-1.5 pr-4 pl-3 text-[0.8rem] backdrop-blur",
        className,
      )}
    >
      <span className="relative flex size-2" aria-hidden>
        {open && <span className="absolute inset-0 animate-[pulse-ring_2s_ease-out_infinite] rounded-full bg-[#5fd34a]" />}
        <span className={cn("relative size-2 rounded-full", open ? "bg-[#3fbf2c]" : "bg-muted")} />
      </span>
      <span className="sr-only">Status:</span>
      {open ? label : "Currently fully booked"}
    </p>
  );
}
