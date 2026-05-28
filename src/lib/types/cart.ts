export type LocalCartItem = {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
};

export type CartTotals = {
  totalItems: number;
  subtotal: number;
  discountedTotal: number;
  discountTotal: number;
};

export type CartResponse = {
  id: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal?: number;
    discountedPrice?: number;
    thumbnail: string;
  }>;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};
