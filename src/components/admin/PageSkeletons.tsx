import { BarListSkeleton, CardSkeleton, KpiSkeleton, Skeleton, SkeletonScreen, TableSkeleton } from "./Skeleton";

/* Body skeletons for each admin page: used by loading.tsx (navigation) and by
   the Suspense boundary that wraps each page body (filter/range changes). */

export function OverviewBodySkeleton() {
  return (
    <SkeletonScreen label="Loading overview…">

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      <CardSkeleton className="mt-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-44" />
        </div>
        {/* Chart area with faint gridlines */}
        <div className="relative mt-5 h-[260px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: `${i * 23}%` }} />
          ))}
          <Skeleton className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-none opacity-60" />
        </div>
      </CardSkeleton>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TableSkeleton rows={6} cols={4} />
        </div>
        <BarListSkeleton rows={4} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <BarListSkeleton rows={3} />
        <BarListSkeleton rows={4} />
        <BarListSkeleton rows={4} />
      </div>
    </SkeletonScreen>
  );
}

export function PagesBodySkeleton() {
  return (
    <SkeletonScreen label="Loading pages…">
      <Skeleton className="mb-3 h-4 w-40" />
      <TableSkeleton rows={10} cols={6} />
    </SkeletonScreen>
  );
}

export function VisitorsBodySkeleton() {
  return (
    <SkeletonScreen label="Loading visitors…">
      <CardSkeleton>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="mt-4 h-3 rounded" />
        <div className="mt-3 flex gap-8">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardSkeleton>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <BarListSkeleton rows={3} />
        <BarListSkeleton rows={3} title="w-40" />
      </div>
      <div className="mt-6 mb-3 flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <TableSkeleton rows={8} cols={7} />
    </SkeletonScreen>
  );
}

export function InquiriesBodySkeleton() {
  return (
    <SkeletonScreen label="Loading inquiries…">
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <ul className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-lg border border-line bg-raised p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-3.5 w-11/12 max-w-xl" />
              </div>
              <Skeleton className="hidden h-3 w-24 sm:block" />
            </div>
          </li>
        ))}
      </ul>
    </SkeletonScreen>
  );
}
