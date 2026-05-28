import { ProductControls } from "@/components/product/ProductControls";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPagination } from "@/components/product/ProductPagination";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/lib/api/products.api";
import {
  getSkipForPage,
  normalizePage,
  PRODUCTS_PER_PAGE,
} from "@/lib/utils/pagination";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    category?: string | string[];
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return <ProductsContent searchParams={params} />;
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: Awaited<ProductsPageProps["searchParams"]>;
}) {
  const currentPage = normalizePage(searchParams.page);
  const selectedCategory = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category;
  const searchQuery = getSingleParam(searchParams.q)?.trim();
  const sort = parseSortParam(getSingleParam(searchParams.sort));
  const mode = searchQuery ? "search" : selectedCategory ? "category" : "default";
  const skip = getSkipForPage(currentPage, PRODUCTS_PER_PAGE);
  const [categories, productList] = await Promise.all([
    getProductCategories(),
    searchQuery
      ? searchProducts(searchQuery, {
          limit: PRODUCTS_PER_PAGE,
          skip,
          sortBy: sort.sortBy,
          order: sort.order,
        })
      : selectedCategory
      ? getProductsByCategory(selectedCategory, {
          limit: PRODUCTS_PER_PAGE,
          skip,
          sortBy: sort.sortBy,
          order: sort.order,
        })
      : getProducts({
          limit: PRODUCTS_PER_PAGE,
          skip,
          sortBy: sort.sortBy,
          order: sort.order,
        }),
  ]);
  const hasProducts = productList.products.length > 0;
  const paginationQuery =
    mode === "search"
      ? { q: searchQuery, sort: sort.value }
      : mode === "category"
        ? { category: selectedCategory, sort: sort.value }
        : { sort: sort.value };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Products</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Browse products
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          Showing {productList.products.length} of {productList.total} products
        </p>
      </div>

      <ProductControls
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        sortBy={sort.sortBy}
        order={sort.order}
        selectedSort={sort.value}
        mode={mode}
      />

      {hasProducts ? (
        <>
          <ProductGrid products={productList.products} />
          <ProductPagination
            currentPage={currentPage}
            total={productList.total}
            limit={PRODUCTS_PER_PAGE}
            query={paginationQuery}
          />
        </>
      ) : (
        <EmptyState
          title="No products found"
          description="DummyJSON returned an empty product list for the current mode."
        />
      )}
    </section>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSortParam(value: string | undefined): {
  value?: string;
  sortBy?: string;
  order?: "asc" | "desc";
} {
  if (!value) {
    return {};
  }

  const [sortBy, order] = value.split(":");

  if (!sortBy || (order !== "asc" && order !== "desc")) {
    return {};
  }

  return {
    value,
    sortBy,
    order,
  };
}
