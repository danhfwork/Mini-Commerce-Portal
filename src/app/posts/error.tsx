"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type PostsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function PostsError({ error, reset }: PostsErrorProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Posts</p>
        <h1 className="text-3xl font-semibold tracking-tight">Read posts</h1>
      </div>
      <ErrorState
        title="Could not load posts"
        description={error.message || "The posts API request failed."}
        action={
          <button
            type="button"
            onClick={reset}
            className="h-10 cursor-pointer rounded-md bg-red-700 px-4 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Retry
          </button>
        }
      />
    </section>
  );
}
