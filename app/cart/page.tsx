"use client";

import Link from "next/link";
import CartItem from "@/components/CartItem";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, removeFromCart, totalPrice, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-black">Таны сагс хоосон байна</h1>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
        >
          Бүтээгдэхүүн үзэх
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-black">Таны сагс</h1>

      <div className="mt-8">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xl font-bold">
          Нийт: {totalPrice.toLocaleString("mn-MN")}₮
        </p>

        <div className="mt-5 flex gap-4">
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full bg-slate-100 px-6 py-3 font-bold transition-colors hover:bg-slate-200"
          >
            Сагс хоослох
          </button>

          <button
            type="button"
            className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Захиалга өгөх
          </button>
        </div>
      </div>
    </main>
  );
}