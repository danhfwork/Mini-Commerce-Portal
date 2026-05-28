export default function ProductDetailLoading() {
  return (
    <section className="space-y-6">
      <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="aspect-square animate-pulse rounded-md bg-slate-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-28 animate-pulse rounded-md bg-slate-200" />
          <div className="h-24 animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    </section>
  );
}
