"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-store";
import { useCart } from "@/lib/cart/cart-store";

export function Header() {
  const router = useRouter();
  const { session, isHydrated, logout } = useAuth();
  const { totals } = useCart();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/products" className="text-lg font-semibold">
            Mini Commerce Portal
          </Link>
          <AuthAction
            isHydrated={isHydrated}
            isCompact
            userName={session?.user.firstName}
            onLogout={handleLogout}
          />
        </div>

        <form action="/products" className="w-full lg:max-w-md" role="search">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search products"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </form>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/products"
            className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Cart ({totals.totalItems})
          </Link>
          {session ? (
            <Link
              href="/account"
              className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Account
            </Link>
          ) : null}
          <AuthAction
            isHydrated={isHydrated}
            userName={session?.user.firstName}
            onLogout={handleLogout}
          />
        </nav>
      </div>
    </header>
  );
}

function AuthAction({
  isHydrated,
  isCompact = false,
  userName,
  onLogout,
}: {
  isHydrated: boolean;
  isCompact?: boolean;
  userName?: string;
  onLogout: () => void;
}) {
  const visibilityClass = isCompact ? "lg:hidden" : "hidden lg:inline-flex";

  if (!isHydrated) {
    return (
      <span
        className={`${visibilityClass} h-9 w-20 animate-pulse rounded-md bg-slate-100`}
      />
    );
  }

  if (!userName) {
    return (
      <Link
        href="/login"
        className={`${visibilityClass} rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800`}
      >
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className={`${visibilityClass} cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50`}
    >
      Logout
    </button>
  );
}
