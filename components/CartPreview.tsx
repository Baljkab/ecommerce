"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import CartStatus from "@/components/CartStatus";

export default function CartPreview() {
  const { items, totalPrice, removeFromCart, isLoading, isSaving, error } =
    useCart();

  return (
    <div className="invisible absolute top-full right-0 z-50 w-[380px] max-w-[calc(100vw-2rem)] pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
        <h2 className="font-bold">Таны сагс</h2>
        <CartStatus />

        {items.length === 0 ? (
          !isLoading &&
          !error && (
            <p className="mt-4 text-sm text-slate-500">Сагс хоосон байна.</p>
          )
        ) : (
          <>
            <div className="mt-4 max-h-72 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 border-b border-slate-100 pr-7 pb-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold break-words">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.quantity} ширхэг
                    </p>
                    <p className="mt-1 text-sm font-bold whitespace-nowrap text-orange-600">
                      {(item.price * item.quantity).toLocaleString("mn-MN")}₮
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    disabled={isLoading || isSaving}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full text-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-wait disabled:opacity-40"
                    aria-label={`${item.name} барааг сагснаас устгах`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="font-bold">
                Нийт: {totalPrice.toLocaleString("mn-MN")}₮
              </p>

              <Link
                href="/cart"
                className="mt-3 block rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                Сагс харах
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
