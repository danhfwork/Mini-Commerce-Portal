import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { LoadingState } from "@/components/ui/LoadingState";

export default function ProductsLoading() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-emerald-700">Products</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950">
          Shop curated daily deals
        </h1>
      </div>
      <LoadingState label="Loading products..." />
      <ProductGridSkeleton />
    </section>
  );
}
