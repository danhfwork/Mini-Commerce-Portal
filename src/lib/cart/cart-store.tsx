"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartTotals, LocalCartItem } from "@/lib/types/cart";

const CART_STORAGE_KEY = "mini-commerce-cart";
const CART_CHANGE_EVENT = "mini-commerce-cart-change";

type AddCartItemInput = Omit<LocalCartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: LocalCartItem[];
  totals: CartTotals;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<LocalCartItem[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItemsState(readStoredCart());
    }, 0);

    function handleCartChange() {
      setItemsState(readStoredCart());
    }

    window.addEventListener(CART_CHANGE_EVENT, handleCartChange);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
    };
  }, []);

  const persistItems = useCallback((nextItems: LocalCartItem[]) => {
    persistCartItems(nextItems);
    setItemsState(nextItems);
  }, []);

  const addItem = useCallback(
    (item: AddCartItemInput) => {
      const quantity = Math.max(item.quantity ?? 1, 1);
      const existingItem = items.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItem) {
        persistItems(
          items.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          ),
        );
        return;
      }

      persistItems([...items, { ...item, quantity }]);
    },
    [items, persistItems],
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      persistItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(quantity, 1) }
            : item,
        ),
      );
    },
    [items, persistItems],
  );

  const removeItem = useCallback(
    (productId: number) => {
      persistItems(items.filter((item) => item.productId !== productId));
    },
    [items, persistItems],
  );

  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, totals, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function useOptionalCart() {
  return useContext(CartContext);
}

export function addStoredCartItem(item: AddCartItemInput) {
  const items = readStoredCart();
  const quantity = Math.max(item.quantity ?? 1, 1);
  const existingItem = items.find(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingItem) {
    persistCartItems(
      items.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem,
      ),
    );
    return;
  }

  persistCartItems([...items, { ...item, quantity }]);
}

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return [];
  }

  try {
    return JSON.parse(storedCart) as LocalCartItem[];
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function persistCartItems(nextItems: LocalCartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function calculateCartTotals(items: LocalCartItem[]): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountedTotal = items.reduce((sum, item) => {
    const discountedUnitPrice = item.price * (1 - item.discountPercentage / 100);
    return sum + discountedUnitPrice * item.quantity;
  }, 0);

  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discountedTotal,
    discountTotal: subtotal - discountedTotal,
  };
}
