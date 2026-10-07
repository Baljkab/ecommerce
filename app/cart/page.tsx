"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import CartItem from "@/components/CartItem";
import CartStatus from "@/components/CartStatus";

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
  const cartBusy = isLoading || isSaving;

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-10 text-slate-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-orange-600 uppercase">
              TechStore · Таны сонголт
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Таны сагс
            </h1>
            {items.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">
                Сонгосон бүтээгдэхүүнээ эндээс шалгаарай.
              </p>
            )}
          </div>

          {items.length > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                {totalQuantity}
              </span>
              ширхэг бүтээгдэхүүн
            </div>
          )}
        </header>

        <CartStatus />

        {items.length === 0 ? (
          <section className="mt-8 flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-9 w-9"
              >
                <path
                  d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </span>
            <h2 className="mt-6 text-xl font-bold text-slate-900">
              {isLoading || error
                ? "Сагсны мэдээлэл"
                : "Таны сагс хоосон байна"}
            </h2>
            {!isLoading && !error && (
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Таалагдсан бүтээгдэхүүнээ сонгоод сагсандаа нэмээрэй.
              </p>
            )}
            <Link
              href="/products"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </section>
        ) : (
          <div
            className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
            aria-busy={cartBusy}
          >
            <section
              aria-label="Сагсанд байгаа бүтээгдэхүүн"
              className="rounded-3xl border border-slate-200/80 bg-white px-4 shadow-sm sm:px-7"
            >
              <div className="flex items-center justify-between border-b border-slate-100 py-5">
                <h2 className="font-bold text-slate-900">
                  Бүтээгдэхүүнүүд
                </h2>
                <span className="text-xs font-medium text-slate-400">
                  {items.length} нэр төрөл
                </span>
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  disabled={cartBusy}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </section>

            <aside className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
              <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
                Захиалгын дүн
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-900">
                Төлбөрийн хураангуй
              </h2>

              <dl className="mt-6 space-y-4 border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-slate-500">Бүтээгдэхүүний тоо</dt>
                  <dd className="font-semibold text-slate-800">
                    {totalQuantity} ширхэг
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-slate-500">Төрөл</dt>
                  <dd className="font-semibold text-slate-800">
                    {items.length} бараа
                  </dd>
                </div>
              </dl>

              <div className="flex items-end justify-between gap-4 py-5">
                <p className="text-sm font-semibold text-slate-600">
                  Нийт дүн
                </p>
                <p className="text-2xl font-black tracking-tight text-orange-600">
                  {totalPrice.toLocaleString("mn-MN")}₮
                </p>
              </div>

              <Link
                href="/checkout"
                className="flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Захиалга өгөх
                <span aria-hidden="true" className="ml-2 text-lg">
                  →
                </span>
              </Link>
              <Link
                href="/products"
                className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700"
              >
                Үргэлжлүүлэн үзэх
              </Link>
              <button
                type="button"
                onClick={clearCart}
                disabled={cartBusy}
                className="mt-4 w-full py-2 text-xs font-semibold text-slate-400 transition-colors hover:text-red-500 disabled:cursor-wait disabled:opacity-50"
              >
                Сагс хоослох
              </button>
              <p className="mt-2 text-center text-xs leading-5 text-slate-400">
                Захиалгын мэдээллээ дараагийн алхамд оруулна.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
