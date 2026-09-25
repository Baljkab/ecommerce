"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartStatus() {
  const { isLoading, isSaving, isAuthenticated, error, reloadCart } = useCart();
  return (
    <div className="mt-3 space-y-2 text-sm">
      {isLoading && (
        <p role="status" className="text-slate-500">
          Сагсыг ачаалж байна...
        </p>
      )}
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void reloadCart()}
            disabled={isLoading || isSaving}
            className="mt-2 font-semibold underline disabled:opacity-50"
          >
            Дахин ачаалах
          </button>
        </div>
      )}
      {!isLoading && !isAuthenticated && !error && (
        <p className="text-slate-500">
          Энэ сагс зөвхөн энэ хөтөч дээр хадгалагдана. Бүртгэлдээ хадгалахын
          тулд{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 underline"
          >
            нэвтэрч
          </Link>{" "}
          бараагаа нэмээрэй.
        </p>
      )}
    </div>
  );
}
