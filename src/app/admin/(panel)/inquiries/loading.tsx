import { HeaderSkeleton, Skeleton } from "@/components/admin/Skeleton";
import { InquiriesBodySkeleton } from "@/components/admin/PageSkeletons";

/** Shown while navigating to this admin page. Mirrors the real layout so nothing jumps. */
export default function Loading() {
  return (
    <>
      <HeaderSkeleton controls={false} />
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-9 w-full rounded-lg sm:w-72" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <InquiriesBodySkeleton />
    </>
  );
}
