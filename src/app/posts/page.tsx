import { PostControls } from "@/components/post/PostControls";
import { PostGrid } from "@/components/post/PostGrid";
import { PostPagination } from "@/components/post/PostPagination";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getPostTags,
  getPosts,
  getPostsByTag,
  searchPosts,
} from "@/lib/api/posts.api";
import {
  getSkipForPage,
  normalizePage,
  POSTS_PER_PAGE,
} from "@/lib/utils/pagination";

export const dynamic = "force-dynamic";

type PostsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    tag?: string | string[];
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;

  return <PostsContent searchParams={params} />;
}

async function PostsContent({
  searchParams,
}: {
  searchParams: Awaited<PostsPageProps["searchParams"]>;
}) {
  const currentPage = normalizePage(searchParams.page);
  const selectedTag = getSingleParam(searchParams.tag);
  const searchQuery = getSingleParam(searchParams.q)?.trim();
  const sort = parseSortParam(getSingleParam(searchParams.sort));
  const mode = searchQuery ? "search" : selectedTag ? "tag" : "default";
  const skip = getSkipForPage(currentPage, POSTS_PER_PAGE);
  const [tags, postList] = await Promise.all([
    getPostTags(),
    searchQuery
      ? searchPosts(searchQuery, {
          limit: POSTS_PER_PAGE,
          skip,
          sortBy: sort.sortBy,
          order: sort.order,
        })
      : selectedTag
        ? getPostsByTag(selectedTag, {
            limit: POSTS_PER_PAGE,
            skip,
            sortBy: sort.sortBy,
            order: sort.order,
          })
        : getPosts({
            limit: POSTS_PER_PAGE,
            skip,
            sortBy: sort.sortBy,
            order: sort.order,
          }),
  ]);
  const hasPosts = postList.posts.length > 0;
  const paginationQuery =
    mode === "search"
      ? { q: searchQuery, sort: sort.value }
      : mode === "tag"
        ? { tag: selectedTag, sort: sort.value }
        : { sort: sort.value };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Posts</p>
          <h1 className="text-3xl font-semibold tracking-tight">Read posts</h1>
        </div>
        <p className="text-sm text-slate-600">
          Showing {postList.posts.length} of {postList.total} posts
        </p>
      </div>

      <PostControls
        tags={tags}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        sortBy={sort.sortBy}
        order={sort.order}
        selectedSort={sort.value}
        mode={mode}
      />

      {hasPosts ? (
        <>
          <PostGrid posts={postList.posts} />
          <PostPagination
            currentPage={currentPage}
            total={postList.total}
            limit={POSTS_PER_PAGE}
            query={paginationQuery}
          />
        </>
      ) : (
        <EmptyState
          title="No posts found"
          description="DummyJSON returned an empty post list for the current mode."
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

  const allowedSorts = new Set(["title:asc", "title:desc", "views:desc", "id:desc"]);

  if (!allowedSorts.has(value)) {
    return {};
  }

  const [sortBy, order] = value.split(":") as [string, "asc" | "desc"];

  return {
    value,
    sortBy,
    order,
  };
}
