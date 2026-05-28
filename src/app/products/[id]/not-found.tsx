import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-medium text-slate-500">Product not found</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        We could not find that product
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The product may not exist in DummyJSON or the product ID is invalid.
      </p>
      <Link
        href="/products"
        className="mt-5 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Back to products
      </Link>
    </section>
  );
}
