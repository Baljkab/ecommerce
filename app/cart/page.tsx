"use client";

import Link from "next/link";
import CartItem from "@/components/CartItem";
import CartStatus from "@/components/CartStatus";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    totalQuantity,
    totalPrice,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    isLoading,
    isSaving,
    error,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-black text-slate-900">
          {isLoading || error ? "Таны сагс" : "Таны сагс хоосон байна"}
        </h1>
        <CartStatus />
        {!isLoading && !error && (
          <p className="mt-4 text-slate-500">
            Таалагдсан бүтээгдэхүүнээ сагсандаа нэмээрэй.
          </p>
        )}

        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
        >
          Бүтээгдэхүүн үзэх
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-slate-900">Таны сагс</h1>
        <p className="text-sm text-slate-500">
          Нийт {totalQuantity} ширхэг бүтээгдэхүүн
        </p>
      </div>

      <CartStatus />
      <div className="mt-8" aria-busy={isLoading || isSaving}>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            disabled={isLoading || isSaving}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-xl font-bold text-slate-900">
          Нийт: {totalPrice.toLocaleString("mn-MN")}₮
        </p>

        <div className="mt-5 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={clearCart}
            disabled={isLoading || isSaving}
            className="rounded-full bg-slate-100 px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-wait disabled:opacity-50"
          >
            Сагс хоослох
          </button>

          <Link
            href="/products"
            className="rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Үргэлжлүүлэн үзэх
          </Link>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-orange-500 px-6 py-3 font-bold text-white opacity-50"
          >
            Захиалга өгөх
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Захиалга өгөх боломж удахгүй нээгдэнэ.
        </p>
      </div>
    </main>
  );
}
