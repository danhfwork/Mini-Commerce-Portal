"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ProductDetailErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ProductDetailError({
  error,
  reset,
}: ProductDetailErrorProps) {
  return (
    <ErrorState
      title="Could not load product"
      description={error.message || "The product detail API request failed."}
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
  );
}
