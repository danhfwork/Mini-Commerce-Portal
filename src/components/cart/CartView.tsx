"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { checkoutCart } from "@/lib/api/carts.api";
import { useAuth } from "@/lib/auth/auth-store";
import { useCart } from "@/lib/cart/cart-store";
import type { CartResponse, LocalCartItem } from "@/lib/types/cart";
import { formatCurrency } from "@/lib/utils/format";

export function CartView() {
  const { session } = useAuth();
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutResult, setCheckoutResult] = useState<CartResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    if (!session) {
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutResult(null);

    try {
      const result = await checkoutCart({
        userId: session.user.id,
        products: items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      });

      setCheckoutResult(result);
      clearCart();
    } catch {
      setCheckoutError(
        "Checkout failed. DummyJSON did not return a cart response.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (items.length === 0 && checkoutResult) {
    return (
      <CheckoutResultSummary
        result={checkoutResult}
        onClose={() => setCheckoutResult(null)}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-base font-semibold text-slate-950">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Add products from the catalog to prepare a checkout.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-3">
        {checkoutResult ? (
          <CheckoutResultSummary
            result={checkoutResult}
            onClose={() => setCheckoutResult(null)}
          />
        ) : null}

        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <aside className="h-fit rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold tracking-tight">Cart summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <SummaryRow label="Items" value={String(totals.totalItems)} />
          <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
          <SummaryRow
            label="Discount"
            value={`-${formatCurrency(totals.discountTotal)}`}
          />
          <div className="border-t border-slate-200 pt-3">
            <SummaryRow
              label="Discounted total"
              value={formatCurrency(totals.discountedTotal)}
              strong
            />
          </div>
        </dl>

        <div className="mt-5 space-y-2">
          {session ? (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="h-11 w-full cursor-pointer rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isCheckingOut ? "Submitting checkout..." : "Checkout"}
            </button>
          ) : (
            <Link
              href="/login?next=/cart"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Login to checkout
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              clearCart();
              setCheckoutResult(null);
              setCheckoutError(null);
            }}
            className="h-10 w-full cursor-pointer rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear cart
          </button>
        </div>

        {checkoutError ? (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {checkoutError}
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          DummyJSON checkout is simulated and does not create a permanent order
          or payment.
        </p>
      </aside>
    </div>
  );
}

function CheckoutResultSummary({
  result,
  onClose,
}: {
  result: CartResponse;
  onClose: () => void;
}) {
  return (
    <section className="rounded-md border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Simulated checkout complete
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-emerald-950">
            Cart response #{result.id}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-10 cursor-pointer rounded-md bg-emerald-800 px-4 text-sm font-medium text-white transition hover:bg-emerald-900"
        >
          Close
        </button>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <ResultField label="Total" value={formatCurrency(result.total)} />
        <ResultField
          label="Discounted total"
          value={formatCurrency(result.discountedTotal)}
        />
        <ResultField
          label="Total products"
          value={String(result.totalProducts)}
        />
        <ResultField
          label="Total quantity"
          value={String(result.totalQuantity)}
        />
      </dl>
    </section>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/70 p-3">
      <dt className="text-emerald-700">{label}</dt>
      <dd className="mt-1 font-semibold text-emerald-950">{value}</dd>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: LocalCartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}) {
  const lineSubtotal = item.price * item.quantity;

  return (
    <article className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[96px_1fr_auto]">
      <Link
        href={`/products/${item.productId}`}
        className="relative aspect-square overflow-hidden rounded-md bg-slate-100"
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-500">
            No image
          </div>
        )}
      </Link>

      <div className="min-w-0 space-y-2">
        <Link
          href={`/products/${item.productId}`}
          className="font-semibold text-slate-950 hover:underline"
        >
          {item.title}
        </Link>
        <p className="text-sm text-slate-600">
          Unit price: {formatCurrency(item.price)}
        </p>
        <p className="text-sm text-slate-600">
          Line total: {formatCurrency(lineSubtotal)}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-md border border-slate-300">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-9 w-9 cursor-pointer text-lg text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            aria-label={`Decrease quantity for ${item.title}`}
          >
            -
          </button>
          <input
            aria-label={`Quantity for ${item.title}`}
            type="number"
            min={1}
            value={item.quantity}
            onChange={(event) => {
              const nextQuantity = Number(event.target.value);

              if (Number.isInteger(nextQuantity)) {
                onUpdateQuantity(item.productId, nextQuantity);
              }
            }}
            className="h-9 w-14 border-x border-slate-300 text-center text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="h-9 w-9 cursor-pointer text-lg text-slate-700 transition hover:bg-slate-50"
            aria-label={`Increase quantity for ${item.title}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="cursor-pointer text-sm font-medium text-red-700 underline"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={strong ? "font-semibold text-slate-950" : "text-slate-600"}>
        {label}
      </dt>
      <dd className={strong ? "font-semibold text-slate-950" : "text-slate-950"}>
        {value}
      </dd>
    </div>
  );
}
