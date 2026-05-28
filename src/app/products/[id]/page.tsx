import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ApiError } from "@/lib/api/client";
import { getProductById } from "@/lib/api/products.api";
import type { Product } from "@/lib/types/product";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    notFound();
  }

  let product: Product;

  try {
    product = await getProductById(productId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return <ProductDetailView product={product} />;
}
