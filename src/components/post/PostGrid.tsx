import { PostCard } from "@/components/post/PostCard";
import type { Post } from "@/lib/types/post";

type PostGridProps = {
  posts: Post[];
};

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
