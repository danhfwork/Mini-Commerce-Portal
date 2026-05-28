import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const stockLabel =
    product.availabilityStatus ?? (product.stock > 0 ? "In stock" : "Out of stock");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] bg-slate-100"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.category}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-2 text-base font-semibold text-slate-950 hover:underline"
          >
            {product.title}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-950">
              {formatCurrency(product.price)}
            </p>
            <p>{formatPercent(product.discountPercentage)} off</p>
          </div>
          <div className="text-right">
            <p>Rating {product.rating.toFixed(1)}</p>
            <p>{stockLabel}</p>
          </div>
        </div>

        <AddToCartButton
          product={product}
          className="mt-auto inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
        />
      </div>
    </article>
  );
}
