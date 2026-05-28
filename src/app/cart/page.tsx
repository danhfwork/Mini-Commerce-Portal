import { CartView } from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Cart</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
      </div>
      <CartView />
    </section>
  );
}
