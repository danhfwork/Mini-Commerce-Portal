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

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-emerald-100 bg-white transition duration-200 hover:border-emerald-300">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] bg-emerald-50"
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
          <div className="flex h-full items-center justify-center text-sm text-emerald-700">
            No image
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-white">
          {formatPercent(product.discountPercentage)} off
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase text-emerald-700">
            {product.category}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-2 text-base font-bold text-emerald-950 transition duration-200 hover:text-emerald-700"
          >
            {product.title}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800/80">
          <div>
            <p className="text-lg font-extrabold text-emerald-950">
              {formatCurrency(discountedPrice)}
            </p>
            <p className="text-xs line-through">{formatCurrency(product.price)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-emerald-900">
              Rating {product.rating.toFixed(1)}
            </p>
            <p className="text-xs">{stockLabel}</p>
          </div>
        </div>

        <AddToCartButton
          product={product}
          className="mt-auto inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-orange-500 px-3 text-sm font-bold text-white transition duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </article>
  );
}
