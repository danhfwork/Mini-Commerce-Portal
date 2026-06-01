import Link from "next/link";

export default function PostNotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-medium text-slate-500">Post not found</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        We could not find that post
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The post may not exist in DummyJSON or the post ID is invalid.
      </p>
      <Link
        href="/posts"
        className="mt-5 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Back to posts
      </Link>
    </section>
  );
}
