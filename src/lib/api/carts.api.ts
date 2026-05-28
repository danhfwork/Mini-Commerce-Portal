import { apiRequest } from "@/lib/api/client";
import type { CartResponse } from "@/lib/types/cart";

export type CheckoutProduct = {
  id: number;
  quantity: number;
};

export type CheckoutRequest = {
  userId: number;
  products: CheckoutProduct[];
};

export async function checkoutCart(request: CheckoutRequest) {
  return apiRequest<CartResponse>("/carts/add", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
