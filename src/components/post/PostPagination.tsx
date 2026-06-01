import Link from "next/link";
import { getTotalPages } from "@/lib/utils/pagination";

type PostPaginationProps = {
  currentPage: number;
  total: number;
  limit: number;
  query?: Record<string, string | undefined>;
};

function buildPostsHref(
  page: number,
  query: Record<string, string | undefined> = {},
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const queryString = params.toString();
  return queryString ? `/posts?${queryString}` : "/posts";
}

export function PostPagination({
  currentPage,
  total,
  limit,
  query,
}: PostPaginationProps) {
  const totalPages = getTotalPages(total, limit);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Post pagination"
      className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {isFirstPage ? (
          <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-400">
            Previous
          </span>
        ) : (
          <Link
            href={buildPostsHref(currentPage - 1, query)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Previous
          </Link>
        )}

        {isLastPage ? (
          <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-400">
            Next
          </span>
        ) : (
          <Link
            href={buildPostsHref(currentPage + 1, query)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
