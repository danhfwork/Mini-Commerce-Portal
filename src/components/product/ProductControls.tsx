"use client";

import Link from "next/link";
import { ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ProductCategory } from "@/lib/types/product";

type ProductControlsProps = {
  categories: ProductCategory[];
  selectedCategory?: string;
  searchQuery?: string;
  sortBy?: string;
  order?: string;
  selectedSort?: string;
  mode: "search" | "category" | "default";
};

const sortOptions = [
  { label: "Title A-Z", sortBy: "title", order: "asc" },
  { label: "Title Z-A", sortBy: "title", order: "desc" },
  { label: "Price low to high", sortBy: "price", order: "asc" },
  { label: "Price high to low", sortBy: "price", order: "desc" },
  { label: "Rating high to low", sortBy: "rating", order: "desc" },
];

export function ProductControls({
  categories,
  selectedCategory,
  searchQuery,
  sortBy,
  order,
  selectedSort,
  mode,
}: ProductControlsProps) {
  const router = useRouter();
  const searchDebounceRef = useRef<number | null>(null);
  const currentSort = selectedSort ?? (sortBy && order ? `${sortBy}:${order}` : "");
  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory,
  )?.name;
  const selectedSortLabel = sortOptions.find(
    (option) => `${option.sortBy}:${option.order}` === currentSort,
  )?.label;

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value.trim();

    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      const params = new URLSearchParams();

      if (nextQuery) {
        params.set("q", nextQuery);
      }

      if (currentSort) {
        params.set("sort", currentSort);
      }

      const queryString = params.toString();
      router.replace(queryString ? `/products?${queryString}` : "/products");
    }, 350);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextSort = event.target.value;
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("q", searchQuery);
    } else if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (nextSort) {
      params.set("sort", nextSort);
    }

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  }

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="product-search"
            className="text-sm font-medium text-slate-700"
          >
            Search
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="product-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products"
              className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label
            htmlFor="product-sort"
            className="text-sm font-medium text-slate-700"
          >
            Sort
          </label>
          <div className="mt-2 flex gap-2">
            <select
              id="product-sort"
              name="sort"
              defaultValue={currentSort}
              onChange={handleSortChange}
              className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Recommended</option>
              {sortOptions.map((option) => (
                <option
                  key={`${option.sortBy}:${option.order}`}
                  value={`${option.sortBy}:${option.order}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center">
        <p className="text-sm font-medium text-slate-700">Category</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/products"
            className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm transition ${
              mode === "default"
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          {categories.map((category) => {
            const isSelected =
              mode === "category" && category.slug === selectedCategory;
            const categoryParams = new URLSearchParams({
              category: category.slug,
            });

            if (currentSort) {
              categoryParams.set("sort", currentSort);
            }

            return (
              <Link
                key={category.slug}
                href={`/products?${categoryParams.toString()}`}
                className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm transition ${
                  isSelected
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <span>
          Viewing:{" "}
          <strong className="font-semibold text-slate-950">
            {getViewingLabel({
              mode,
              searchQuery,
              selectedCategoryName,
              selectedSortLabel,
            })}
          </strong>
        </span>
        {mode !== "default" || currentSort ? (
          <Link href="/products" className="font-medium text-slate-950 underline">
            Clear
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function getViewingLabel({
  mode,
  searchQuery,
  selectedCategoryName,
  selectedSortLabel,
}: {
  mode: ProductControlsProps["mode"];
  searchQuery?: string;
  selectedCategoryName?: string;
  selectedSortLabel?: string;
}) {
  if (mode === "search" && searchQuery) {
    return selectedSortLabel
      ? `Search results for "${searchQuery}" sorted by ${selectedSortLabel}`
      : `Search results for "${searchQuery}"`;
  }

  if (mode === "category") {
    if (!selectedCategoryName) {
      return "Selected category";
    }

    return selectedSortLabel
      ? `Category: ${selectedCategoryName} sorted by ${selectedSortLabel}`
      : `Category: ${selectedCategoryName}`;
  }

  if (selectedSortLabel) {
    return `All items sorted by ${selectedSortLabel}`;
  }

  return "All items";
}
