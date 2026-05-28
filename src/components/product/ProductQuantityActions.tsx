"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";

type ProductQuantityActionsProps = {
  product: Pick<
    Product,
    | "id"
    | "title"
    | "thumbnail"
    | "price"
    | "discountPercentage"
    | "minimumOrderQuantity"
    | "stock"
  >;
};

export function ProductQuantityActions({
  product,
}: ProductQuantityActionsProps) {
  const minQuantity = Math.max(product.minimumOrderQuantity ?? 1, 1);
  const maxQuantity = Math.max(product.stock, minQuantity);
  const [quantity, setQuantity] = useState(minQuantity);

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
          Quantity
        </label>
        <div className="flex items-center rounded-md border border-slate-300">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(value - 1, minQuantity))}
            className="h-10 w-10 cursor-pointer text-lg text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            disabled={quantity <= minQuantity}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min={minQuantity}
            max={maxQuantity}
            value={quantity}
            onChange={(event) => {
              const nextQuantity = Number(event.target.value);

              if (Number.isInteger(nextQuantity)) {
                setQuantity(Math.min(Math.max(nextQuantity, minQuantity), maxQuantity));
              }
            }}
            className="h-10 w-16 border-x border-slate-300 text-center text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(value + 1, maxQuantity))}
            className="h-10 w-10 cursor-pointer text-lg text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <AddToCartButton
        product={product}
        quantity={quantity}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
      />
    </div>
  );
}
