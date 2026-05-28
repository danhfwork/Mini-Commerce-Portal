import { apiRequest } from "@/lib/api/client";
import type {
  Product,
  ProductCategory,
  ProductListResponse,
} from "@/lib/types/product";

const PRODUCT_LIST_SELECT = [
  "id",
  "title",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "category",
  "thumbnail",
  "availabilityStatus",
].join(",");

type GetProductsParams = {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export async function getProducts({
  limit = 12,
  skip = 0,
  sortBy,
  order,
}: GetProductsParams = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: PRODUCT_LIST_SELECT,
  });

  if (sortBy && order) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return apiRequest<ProductListResponse>(`/products?${params.toString()}`, {
    cache: "no-store",
  });
}

export async function searchProducts(
  query: string,
  { limit = 12, skip = 0, sortBy, order }: GetProductsParams = {},
) {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    skip: String(skip),
    select: PRODUCT_LIST_SELECT,
  });

  if (sortBy && order) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return apiRequest<ProductListResponse>(
    `/products/search?${params.toString()}`,
    {
      cache: "no-store",
    },
  );
}

export async function getProductCategories() {
  return apiRequest<ProductCategory[]>("/products/categories", {
    cache: "no-store",
  });
}

export async function getProductsByCategory(
  slug: string,
  { limit = 12, skip = 0, sortBy, order }: GetProductsParams = {},
) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: PRODUCT_LIST_SELECT,
  });

  if (sortBy && order) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return apiRequest<ProductListResponse>(
    `/products/category/${encodeURIComponent(slug)}?${params.toString()}`,
    {
      cache: "no-store",
    },
  );
}

export async function getProductById(id: number) {
  return apiRequest<Product>(`/products/${id}`, {
    cache: "no-store",
  });
}
