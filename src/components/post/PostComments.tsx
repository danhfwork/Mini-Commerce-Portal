"use client";

import { FormEvent, useState } from "react";
import { addComment } from "@/lib/api/posts.api";
import { useAuth } from "@/lib/auth/auth-store";
import type { Comment } from "@/lib/types/post";

type PostCommentsProps = {
  postId: number;
  initialComments: Comment[];
};

const DEMO_USER_ID = 5;

export function PostComments({ postId, initialComments }: PostCommentsProps) {
  const { session, isHydrated } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextBody = body.trim();

    if (!nextBody || isSubmitting) {
      return;
    }

    const user = session?.user;
    const userId = user?.id ?? DEMO_USER_ID;
    const temporaryId = -Date.now();
    const optimisticComment: Comment = {
      id: temporaryId,
      body: nextBody,
      postId,
      likes: 0,
      user: {
        id: userId,
        username: user?.username ?? "emmaj",
        fullName: user ? `${user.firstName} ${user.lastName}` : "Emma Miller",
      },
    };

    setComments((currentComments) => [optimisticComment, ...currentComments]);
    setBody("");
    setError(null);
    setIsSubmitting(true);

    try {
      const createdComment = await addComment({
        body: nextBody,
        postId,
        userId,
      });

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === temporaryId ? createdComment : comment,
        ),
      );
    } catch {
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== temporaryId),
      );
      setBody(nextBody);
      setError("Could not add the comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Discussion</p>
          <h2 className="text-xl font-semibold tracking-tight">Comments</h2>
        </div>
        <p className="text-sm text-slate-600">{comments.length} comments</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-md border border-slate-200 bg-white p-4"
      >
        <div>
          <label htmlFor="comment-body" className="text-sm font-medium text-slate-700">
            Add a comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            placeholder="Share a response"
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-6 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
          DummyJSON simulates comment creation and does not persist new comments
          after refresh or navigation.
        </p>

        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Posting as{" "}
            <span className="font-medium text-slate-700">
              {isHydrated && session
                ? `${session.user.firstName} ${session.user.lastName}`
                : "DummyJSON demo user"}
            </span>
          </p>
          <button
            type="submit"
            disabled={!body.trim() || isSubmitting}
            className="h-10 cursor-pointer rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      {comments.length ? (
        <div className="grid gap-3">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium text-slate-950">
                    {comment.user.fullName}
                  </h3>
                  <p className="text-sm text-slate-500">@{comment.user.username}</p>
                </div>
                <p className="text-sm text-slate-500">
                  {(comment.likes ?? 0).toLocaleString()} likes
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {comment.body}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No comments available.
        </div>
      )}
    </section>
  );
}
