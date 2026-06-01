import Link from "next/link";
import type { Post } from "@/lib/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/posts?tag=${encodeURIComponent(tag)}`}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {tag}
          </Link>
        ))}
      </div>

      <Link
        href={`/posts/${post.id}`}
        className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-950 hover:underline"
      >
        {post.title}
      </Link>

      <p className="mt-2 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">
        {post.body}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
        <span>{post.views.toLocaleString()} views</span>
        <span>{post.reactions.likes.toLocaleString()} likes</span>
        <span>{post.reactions.dislikes.toLocaleString()} dislikes</span>
      </div>
    </article>
  );
}
