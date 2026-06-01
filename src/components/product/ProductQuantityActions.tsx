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
    <div className="space-y-3 rounded-md border border-emerald-100 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="quantity" className="text-sm font-semibold text-emerald-900">
          Quantity
        </label>
        <div className="flex items-center rounded-md border border-emerald-200">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(value - 1, minQuantity))}
            className="h-10 w-10 cursor-pointer text-lg text-emerald-800 transition duration-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-emerald-700/30"
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
            className="h-10 w-16 border-x border-emerald-200 text-center text-sm text-emerald-950 outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(value + 1, maxQuantity))}
            className="h-10 w-10 cursor-pointer text-lg text-emerald-800 transition duration-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-emerald-700/30"
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
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-bold text-white transition duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );
}
