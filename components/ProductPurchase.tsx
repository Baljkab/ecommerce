"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import CartStatus from "@/components/CartStatus";
import type { Product } from "@/types/product";

type ProductPurchaseProps = {
  product: Product;
};

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading, isSaving } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const totalPrice = product.price * quantity;
  function increaseQuantity() {
    setQuantity((currentQuantity) => Math.min(product.stock, currentQuantity + 1));
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }



  async function handleAddToCart() {
    setIsAdded(false);
    const saved = await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      stock: product.stock,
    });
    if (!saved) return;
    setIsAdded(true);
    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }

  return (
    <>
      <div className="mt-6 border-b border-slate-200 py-4">
        <p className="text-sm text-slate-500 italic">Үнэ:</p>
        <p className="mt-2 text-4xl font-black tracking-tight text-slate-900">
          {totalPrice.toLocaleString("mn-MN")}₮
        </p>
        <p className="mt-2 text-sm text-slate-400 italic">(НӨАТ ороогүй дүн)</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="px-5 py-3 text-lg text-slate-600 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Тоо ширхэг хасах"
          >
            −
          </button>
          <span className="min-w-8 text-center text-slate-800">{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="px-5 py-3 text-lg text-slate-600 transition-colors hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Тоо ширхэг нэмэх"
          >
            +
          </button>
        </div>
        <span className="text-sm font-medium text-emerald-600">
          Үлдэгдэл: {product.stock} ширхэг
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isLoading || isSaving}
          className="rounded-full bg-slate-100 px-6 py-4 font-bold text-slate-800 transition-colors hover:bg-slate-200 disabled:cursor-wait disabled:opacity-50"
        >
          {isSaving
            ? "Хадгалж байна..."
            : isAdded
              ? "Сагсанд нэмэгдлээ"
              : "Сагсанд нэмэх"}
        </button>
        <Link
          href="/cart"
          className="rounded-full bg-orange-500 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-orange-600"
        >
          Сагс харах
        </Link>
      </div>
      <CartStatus />
    </>
  );
}
