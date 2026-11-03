import { HeaderSkeleton, Skeleton } from "@/components/admin/Skeleton";
import { PagesBodySkeleton } from "@/components/admin/PageSkeletons";

/** Shown while navigating to this admin page. Mirrors the real layout so nothing jumps. */
export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <Skeleton className="mb-3 h-9 w-full rounded-lg sm:w-72" />
      <PagesBodySkeleton />
    </>
  );
}
