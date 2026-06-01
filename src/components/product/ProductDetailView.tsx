import Image from "next/image";
import Link from "next/link";
import { ProductQuantityActions } from "@/components/product/ProductQuantityActions";
import type { Product } from "@/lib/types/product";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <section className="space-y-6">
      <Link
        href="/products"
        className="inline-flex text-sm font-semibold text-emerald-800 underline"
      >
        Back to products
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-md border border-emerald-100 bg-white">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-emerald-700">
                No image
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-md border border-emerald-100 bg-white"
                >
                  <Image
                    src={image}
                    alt={`${product.title} image ${index + 1}`}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-700">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950">
              {product.title}
            </h1>
            {product.brand ? (
              <p className="mt-2 text-sm text-emerald-800/80">
                Brand: {product.brand}
              </p>
            ) : null}
          </div>

          <div className="rounded-md border border-emerald-100 bg-white p-4">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-extrabold text-emerald-950">
                {formatCurrency(discountedPrice)}
              </p>
              <p className="pb-1 text-sm text-emerald-800/60 line-through">
                {formatCurrency(product.price)}
              </p>
              <p className="rounded-md bg-orange-50 px-2 py-1 text-sm font-bold text-orange-700">
                {formatPercent(product.discountPercentage)} off
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-emerald-800">
              <p>Rating {product.rating.toFixed(1)}</p>
              <p>{product.availabilityStatus ?? `${product.stock} in stock`}</p>
            </div>
          </div>

          {product.description ? (
            <p className="text-base leading-7 text-emerald-900/80">
              {product.description}
            </p>
          ) : null}

          {product.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <ProductQuantityActions
            product={product}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Warranty" value={product.warrantyInformation} />
        <InfoPanel title="Shipping" value={product.shippingInformation} />
        <InfoPanel title="Return policy" value={product.returnPolicy} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-emerald-950">
          Reviews
        </h2>
        {product.reviews?.length ? (
          <div className="grid gap-3">
            {product.reviews.map((review, index) => (
              <article
                key={`${review.reviewerEmail}-${review.date}-${index}`}
                className="rounded-md border border-emerald-100 bg-white p-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-emerald-950">
                    {review.reviewerName}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Rating {review.rating.toFixed(1)}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-emerald-200 bg-white p-6 text-sm text-emerald-800">
            No reviews available.
          </div>
        )}
      </section>
    </section>
  );
}

function InfoPanel({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-md border border-emerald-100 bg-white p-4">
      <h2 className="text-sm font-bold uppercase text-emerald-700">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-emerald-900/80">
        {value ?? "Not specified"}
      </p>
    </div>
  );
}
