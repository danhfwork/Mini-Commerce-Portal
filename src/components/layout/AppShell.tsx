import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/lib/auth/auth-store";
import { CartProvider } from "@/lib/cart/cart-store";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
