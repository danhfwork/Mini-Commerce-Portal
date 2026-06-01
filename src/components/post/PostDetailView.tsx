import Link from "next/link";
import { PostComments } from "@/components/post/PostComments";
import type { Comment, Post } from "@/lib/types/post";

type PostDetailViewProps = {
  post: Post;
  comments: Comment[];
};

export function PostDetailView({ post, comments }: PostDetailViewProps) {
  return (
    <section className="space-y-6">
      <Link href="/posts" className="inline-flex text-sm font-medium text-slate-700 underline">
        Back to posts
      </Link>

      <article className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {post.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
          <span>Author user #{post.userId}</span>
          <span>{post.views.toLocaleString()} views</span>
          <span>{post.reactions.likes.toLocaleString()} likes</span>
          <span>{post.reactions.dislikes.toLocaleString()} dislikes</span>
        </div>

        <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
          {post.body}
        </p>
      </article>

      <PostComments postId={post.id} initialComments={comments} />
    </section>
  );
}
