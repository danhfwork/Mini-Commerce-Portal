"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type PostDetailErrorProps = {
  error: Error;
  reset: () => void;
};

export default function PostDetailError({ error, reset }: PostDetailErrorProps) {
  return (
    <ErrorState
      title="Could not load post"
      description={error.message || "The post detail API request failed."}
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
  );
}
