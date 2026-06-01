"use client";

import Link from "next/link";
import { ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import type { PostTag } from "@/lib/types/post";

type PostControlsProps = {
  tags: PostTag[];
  selectedTag?: string;
  searchQuery?: string;
  sortBy?: string;
  order?: string;
  selectedSort?: string;
  mode: "search" | "tag" | "default";
};

const sortOptions = [
  { label: "Title A-Z", sortBy: "title", order: "asc" },
  { label: "Title Z-A", sortBy: "title", order: "desc" },
  { label: "Most viewed", sortBy: "views", order: "desc" },
  { label: "Newest first", sortBy: "id", order: "desc" },
];

export function PostControls({
  tags,
  selectedTag,
  searchQuery,
  sortBy,
  order,
  selectedSort,
  mode,
}: PostControlsProps) {
  const router = useRouter();
  const searchDebounceRef = useRef<number | null>(null);
  const currentSort = selectedSort ?? (sortBy && order ? `${sortBy}:${order}` : "");
  const selectedTagName = tags.find((tag) => tag.slug === selectedTag)?.name;
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
      router.replace(queryString ? `/posts?${queryString}` : "/posts");
    }, 350);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextSort = event.target.value;
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("q", searchQuery);
    } else if (selectedTag) {
      params.set("tag", selectedTag);
    }

    if (nextSort) {
      params.set("sort", nextSort);
    }

    const queryString = params.toString();
    router.push(queryString ? `/posts?${queryString}` : "/posts");
  }

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="post-search" className="text-sm font-medium text-slate-700">
            Search
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="post-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search posts"
              className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label htmlFor="post-sort" className="text-sm font-medium text-slate-700">
            Sort
          </label>
          <div className="mt-2 flex gap-2">
            <select
              id="post-sort"
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
        <p className="text-sm font-medium text-slate-700">Tag</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href={currentSort ? `/posts?sort=${encodeURIComponent(currentSort)}` : "/posts"}
            className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm transition ${
              mode === "default"
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          {tags.map((tag) => {
            const isSelected = mode === "tag" && tag.slug === selectedTag;
            const tagParams = new URLSearchParams({
              tag: tag.slug,
            });

            if (currentSort) {
              tagParams.set("sort", currentSort);
            }

            return (
              <Link
                key={tag.slug}
                href={`/posts?${tagParams.toString()}`}
                className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm transition ${
                  isSelected
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tag.name}
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
              selectedTagName,
              selectedSortLabel,
            })}
          </strong>
        </span>
        {mode !== "default" || currentSort ? (
          <Link href="/posts" className="font-medium text-slate-950 underline">
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
  selectedTagName,
  selectedSortLabel,
}: {
  mode: PostControlsProps["mode"];
  searchQuery?: string;
  selectedTagName?: string;
  selectedSortLabel?: string;
}) {
  if (mode === "search" && searchQuery) {
    return selectedSortLabel
      ? `Search results for "${searchQuery}" sorted by ${selectedSortLabel}`
      : `Search results for "${searchQuery}"`;
  }

  if (mode === "tag") {
    if (!selectedTagName) {
      return "Selected tag";
    }

    return selectedSortLabel
      ? `Tag: ${selectedTagName} sorted by ${selectedSortLabel}`
      : `Tag: ${selectedTagName}`;
  }

  if (selectedSortLabel) {
    return `All posts sorted by ${selectedSortLabel}`;
  }

  return "All posts";
}
