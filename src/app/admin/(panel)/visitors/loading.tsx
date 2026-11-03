import { HeaderSkeleton } from "@/components/admin/Skeleton";
import { VisitorsBodySkeleton } from "@/components/admin/PageSkeletons";

/** Shown while navigating to this admin page. Mirrors the real layout so nothing jumps. */
export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <VisitorsBodySkeleton />
    </>
  );
}
