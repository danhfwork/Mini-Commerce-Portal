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
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-lg font-extrabold text-emerald-950"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-sm font-black text-white">
              MC
            </span>
            <span>Mini Commerce</span>
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
            className="h-11 w-full rounded-md border border-emerald-200 bg-emerald-50/60 px-4 text-sm text-emerald-950 outline-none transition duration-200 placeholder:text-emerald-800/50 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </form>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/products"
            className="rounded-md px-3 py-2 text-emerald-800 transition duration-200 hover:bg-emerald-50 hover:text-emerald-950"
          >
            Products
          </Link>
          <Link
            href="/posts"
            className="rounded-md px-3 py-2 text-emerald-800 transition duration-200 hover:bg-emerald-50 hover:text-emerald-950"
          >
            Posts
          </Link>
          <Link
            href="/cart"
            className="rounded-md bg-orange-500 px-3 py-2 text-white transition duration-200 hover:bg-orange-600"
          >
            Cart ({totals.totalItems})
          </Link>
          {session ? (
            <Link
              href="/account"
              className="rounded-md px-3 py-2 text-emerald-800 transition duration-200 hover:bg-emerald-50 hover:text-emerald-950"
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
        className={`${visibilityClass} h-9 w-20 animate-pulse rounded-md bg-emerald-100`}
      />
    );
  }

  if (!userName) {
    return (
      <Link
        href="/login"
        className={`${visibilityClass} rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-800`}
      >
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className={`${visibilityClass} cursor-pointer rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 transition duration-200 hover:bg-emerald-50`}
    >
      Logout
    </button>
  );
}
