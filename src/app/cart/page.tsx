import { CartView } from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-emerald-700">Cart</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950">
          Your cart
        </h1>
      </div>
      <CartView />
    </section>
  );
}
