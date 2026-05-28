"use client";

import { useState } from "react";
import { addStoredCartItem, useOptionalCart } from "@/lib/cart/cart-store";
import type { Product } from "@/lib/types/product";

type AddToCartButtonProps = {
  product: Pick<
    Product,
    "id" | "title" | "thumbnail" | "price" | "discountPercentage"
  >;
  quantity?: number;
  className?: string;
};

export function AddToCartButton({
  product,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const cart = useOptionalCart();
  const [wasAdded, setWasAdded] = useState(false);

  return (
    <button
      type="button"
      className={
        className ??
        "h-10 cursor-pointer rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
      }
      onClick={() => {
        const cartItem = {
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          quantity,
        };

        if (cart) {
          cart.addItem(cartItem);
        } else {
          addStoredCartItem(cartItem);
        }

        setWasAdded(true);
        window.setTimeout(() => setWasAdded(false), 1400);
      }}
    >
      {wasAdded ? "Added" : "Add to cart"}
    </button>
  );
}
