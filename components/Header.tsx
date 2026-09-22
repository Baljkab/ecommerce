"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import CartPreview from "./CartPreview";

export default function Header() {
  const { totalQuantity } = useCart();
  return (
    <header className="border-oronge-600 bg-orenge-500 sticky top-0 z-50 border-b text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold tracking-wide text-slate-900"
        >
          <span className="shadow-oronge-600transition-transform flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950 shadow-lg duration-300 group-hover:rotate-6">
            E
          </span>
          <span className="transition-colors group-hover:text-orange-600">
            TechStore
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Үндсэн цэс"
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
          >
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
            >
              Нүүр
            </Link>
            <Link
              href="/products"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
            >
              Бүтээгдэхүүн
            </Link>
            <div className="group relative">
              <Link
                href="/cart"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
              >
                Сагс
                {totalQuantity > 0 && (
                  <span className="ml-2 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <CartPreview />
            </div>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </header>
  );
}
