import { apiRequest } from "@/lib/api/client";
import type {
  AddCommentRequest,
  Comment,
  CommentListResponse,
  Post,
  PostListResponse,
  PostTag,
} from "@/lib/types/post";

const POST_LIST_SELECT = [
  "id",
  "title",
  "body",
  "tags",
  "reactions",
  "views",
  "userId",
].join(",");

type GetPostsParams = {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

function buildPostListParams({
  limit = 9,
  skip = 0,
  sortBy,
  order,
}: GetPostsParams = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: POST_LIST_SELECT,
  });

  if (sortBy && order) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return params;
}

export async function getPosts(options: GetPostsParams = {}) {
  const params = buildPostListParams(options);

  return apiRequest<PostListResponse>(`/posts?${params.toString()}`, {
    cache: "no-store",
  });
}

export async function searchPosts(
  query: string,
  options: GetPostsParams = {},
) {
  const params = buildPostListParams(options);
  params.set("q", query);

  return apiRequest<PostListResponse>(`/posts/search?${params.toString()}`, {
    cache: "no-store",
  });
}

export async function getPostTags() {
  return apiRequest<PostTag[]>("/posts/tags", {
    cache: "no-store",
  });
}

export async function getPostsByTag(
  slug: string,
  options: GetPostsParams = {},
) {
  const params = buildPostListParams(options);

  return apiRequest<PostListResponse>(
    `/posts/tag/${encodeURIComponent(slug)}?${params.toString()}`,
    {
      cache: "no-store",
    },
  );
}

export async function getPostById(id: number) {
  return apiRequest<Post>(`/posts/${id}`, {
    cache: "no-store",
  });
}

export async function getPostComments(id: number) {
  return apiRequest<CommentListResponse>(`/posts/${id}/comments`, {
    cache: "no-store",
  });
}

export async function addComment(request: AddCommentRequest) {
  return apiRequest<Comment>("/comments/add", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
