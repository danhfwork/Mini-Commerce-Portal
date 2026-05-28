"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ProductsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Products</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Browse products
        </h1>
      </div>
      <ErrorState
        title="Could not load products"
        description={error.message || "The product API request failed."}
        action={
          <button
            type="button"
            onClick={reset}
            className="h-10 cursor-pointer rounded-md bg-red-700 px-4 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Retry
          </button>
        }
      />
    </section>
  );
}
