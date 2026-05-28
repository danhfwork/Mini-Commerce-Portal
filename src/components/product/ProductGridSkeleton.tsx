export function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md border border-slate-200 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-100" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-10 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
