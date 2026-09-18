"use client";

import { useState } from "react";

type ProductOptionsProps = {
  sizes: Record<string, number>;
};

export default function ProductOptions({
  sizes,
}: ProductOptionsProps) {
  const [productSizes, setProductSizes] = useState(sizes);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const selectedStock = selectedSize
    ? productSizes[selectedSize] ?? 0
    : 0;

  function handleAddToCart() {
    if (!selectedSize) {
      alert("Эхлээд размер сонгоно уу.");
      return;
    }

    if (selectedStock <= 0) {
      alert("Энэ размер дууссан байна.");
      return;
    }

    setProductSizes((currentSizes) => ({
      ...currentSizes,
      [selectedSize]: currentSizes[selectedSize] - 1,
    }));
  }

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-white">
        Размер сонгох
      </h2>

      <div className="mt-3 flex flex-wrap gap-3">
        {Object.entries(productSizes).map(([size, stock]) => (
          <button
            key={size}
            type="button"
            disabled={stock === 0}
            onClick={() => setSelectedSize(size)}
            className={
              selectedSize === size
                ? "rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
                : "rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            }
          >
            {size}
          </button>
        ))}
      </div>

      {selectedSize && (
        <p className="mt-4 text-sm text-slate-400">
          Сонгосон размер:{" "}
          <span className="font-semibold text-white">
            {selectedSize}
          </span>
          <br />
          Үлдэгдэл:{" "}
          <span className="font-semibold text-cyan-300">
            {selectedStock} ширхэг
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedSize || selectedStock === 0}
        className="mt-8 w-full rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Сагсанд нэмэх
      </button>
    </div>
  );
}