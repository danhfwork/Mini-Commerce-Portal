import { notFound } from "next/navigation";
import { PostDetailView } from "@/components/post/PostDetailView";
import { ApiError } from "@/lib/api/client";
import { getPostById, getPostComments } from "@/lib/api/posts.api";
import type { Comment, Post } from "@/lib/types/post";

type PostDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) {
    notFound();
  }

  let post: Post;
  let comments: Comment[];

  try {
    const [postResponse, commentsResponse] = await Promise.all([
      getPostById(postId),
      getPostComments(postId),
    ]);

    post = postResponse;
    comments = commentsResponse.comments;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return <PostDetailView post={post} comments={comments} />;
}
