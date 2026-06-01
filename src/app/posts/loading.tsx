import { PostGridSkeleton } from "@/components/post/PostGridSkeleton";
import { LoadingState } from "@/components/ui/LoadingState";

export default function PostsLoading() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Posts</p>
        <h1 className="text-3xl font-semibold tracking-tight">Read posts</h1>
      </div>
      <LoadingState label="Loading posts..." />
      <PostGridSkeleton />
    </section>
  );
}
