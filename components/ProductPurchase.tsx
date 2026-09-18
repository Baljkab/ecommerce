"use client";

import { useState } from "react";

type ProductPurchaseProps = {
  price: number;
};

export default function ProductPurchase({ price }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const totalPrice = price * quantity;

  function increaseQuantity() {
    setQuantity((currentQuantity) => currentQuantity + 1);
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  return (
    <>
      <div className="mt-6 border-b border-slate-200 py-4">
        <p className="text-sm italic text-slate-500">Үнэ:</p>
        <p className="mt-2 text-4xl font-black tracking-tight text-slate-900">
          {totalPrice.toLocaleString("mn-MN")}₮
        </p>
        <p className="mt-2 text-sm italic text-slate-400">
          (НӨАТ ороогүй дүн)
        </p>
      </div>

      <div className="mt-6 flex items-center gap-4 border-b border-slate-200 pb-6 text-white">
        <div className="flex items-center rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={decreaseQuantity}
            className="px-5 py-3 text-lg text-slate-600 transition-colors hover:text-orange-500"
            aria-label="Тоо ширхэг хасах"
          >
            -
          </button>
          <span className="min-w-8 text-center text-slate-800">{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            className="px-5 py-3 text-lg text-slate-600 transition-colors hover:text-orange-600"
            aria-label="Тоо ширхэг нэмэх"
          >
            +
          </button>
        </div>
        <span className="text-sm italic text-slate-400">Үлдэгдэлтэй</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-full bg-slate-100 px-6 py-4 font-bold text-slate-800 transition-colors hover:bg-slate-200"
        >
          Сагслах
        </button>
        <button
          type="button"
          className="rounded-full bg-orange-500 px-6 py-4 font-bold text-white transition-colors hover:bg-orange-600"
        >
          Худалдан авах
        </button>
      </div>
    </>
  );
}
