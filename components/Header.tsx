"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { getSupabaseClient } from "@/lib/supabase";
import CartPreview from "./CartPreview";

export default function Header() {
  const { totalQuantity } = useCart();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const updateUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user;
      const nextName =
        currentUser?.user_metadata?.full_name ??
        currentUser?.email?.split("@")[0] ??
        null;

      setUserName(nextName);
    };

    updateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      const nextName =
        currentUser?.user_metadata?.full_name ??
        currentUser?.email?.split("@")[0] ??
        null;

      setUserName(nextName);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUserName(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold tracking-wide text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition-transform duration-300 group-hover:rotate-6">
            E
          </span>
          <span className="transition-colors group-hover:text-orange-600">
            TechStore
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav
            aria-label="Үндсэн цэс"
            className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex"
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
                  <span className="ml-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <CartPreview />
            </div>
          </nav>

          {userName ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:block"
              >
                {userName}
              </Link>
              <Link href="/">
                <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600"
              >
                Гарах
              </button>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Нэвтрэх
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
