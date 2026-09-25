"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { getSupabaseClient } from "@/lib/supabase";
import CartPreview from "@/components/CartPreview";

export default function Header() {
  const { totalQuantity } = useCart();
  const [userName, setUserName] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accountOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !accountRef.current?.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

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
      setAccountOpen(false);
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
    setSigningOut(true);
    setSignOutError("");
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserName(null);
      setAccountOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setSignOutError("Гарах үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
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
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
          >
            <Link
              href="/"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600 md:block"
            >
              Нүүр
            </Link>
            <Link
              href="/products"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600 md:block"
            >
              Бүтээгдэхүүн
            </Link>
            <div className="group relative">
              <Link
                href="/cart"
                className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
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
            <div
              ref={accountRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setAccountOpen(false);
                }
              }}
            >
              <button
                ref={accountButtonRef}
                type="button"
                aria-expanded={accountOpen}
                aria-controls="account-actions"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span className="max-w-32 truncate">{userName}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-4 w-4 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {accountOpen && (
                <div
                  id="account-actions"
                  className="absolute top-full right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={handleSignOut}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-wait disabled:opacity-60"
                  >
                    {signingOut ? "Гарч байна..." : "Гарах"}
                  </button>
                  {signOutError && (
                    <p role="alert" className="mt-2 text-xs text-red-600">
                      {signOutError}
                    </p>
                  )}
                </div>
              )}
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
