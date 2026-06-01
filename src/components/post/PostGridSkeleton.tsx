export function PostGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-md border border-slate-200 bg-white p-4"
        >
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded bg-slate-200" />
            <div className="h-6 w-16 rounded bg-slate-200" />
          </div>
          <div className="mt-4 h-7 w-4/5 rounded bg-slate-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
          </div>
          <div className="mt-8 h-4 w-2/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
