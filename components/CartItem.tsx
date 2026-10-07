import Image from "next/image";
import type { CartItemData } from "@/types/product";

type CartItemProps = {
  item: CartItemData;
  disabled?: boolean;
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
};

export default function CartItem({
  item,
  disabled = false,
  onRemove,
  onIncrease,
  onDecrease,
}: CartItemProps) {
  return (
    <article className="relative flex flex-col gap-4 border-b border-slate-100 py-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-orange-50/60 sm:h-28 sm:w-28">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain p-3"
          sizes="112px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="pr-10 text-base font-bold text-slate-900 sm:pr-0">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Нэгж үнэ: {item.price.toLocaleString("mn-MN")}₮
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => onDecrease(item.id)}
                disabled={disabled || item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`${item.name} барааны тоог хасах`}
              >
                −
              </button>
              <span className="min-w-9 text-center text-sm font-bold tabular-nums text-slate-800">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onIncrease(item.id)}
                disabled={disabled || item.quantity >= item.stock}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`${item.name} барааны тоог нэмэх`}
              >
                +
              </button>
            </div>
            <p className="text-xs font-medium text-emerald-600">
              Үлдэгдэл: {item.stock} ширхэг
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-base font-black text-slate-900 sm:text-right">
            {(item.price * item.quantity).toLocaleString("mn-MN")}₮
          </p>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-40"
            aria-label={`${item.name} барааг сагснаас устгах`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M4.5 6h11m-9.5 0 .5 10h7l.5-10M8 6V4h4v2m-3 3v4m2-4v4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Устгах
          </button>
        </div>
      </div>
    </article>
  );
}
