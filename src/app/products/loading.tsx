import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { LoadingState } from "@/components/ui/LoadingState";

export default function ProductsLoading() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Products</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Browse products
        </h1>
      </div>
      <LoadingState label="Loading products..." />
      <ProductGridSkeleton />
    </section>
  );
}
