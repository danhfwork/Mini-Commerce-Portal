export default function PostDetailLoading() {
  return (
    <section className="space-y-6">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
      <div className="rounded-md border border-slate-200 bg-white p-6">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mt-5 h-10 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-md border border-slate-200 bg-white" />
    </section>
  );
}
