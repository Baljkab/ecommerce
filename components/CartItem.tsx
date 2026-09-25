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
    <div className="flex gap-4 border-b border-slate-200 py-4">
      <div className="relative h-20 w-20 shrink-0 rounded-lg bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="rounded-lg object-contain p-2"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{item.name}</p>
        <p className="mt-1 text-sm text-slate-500">
          Нэгж үнэ: {item.price.toLocaleString("mn-MN")}₮
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            disabled={disabled || item.quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${item.name} барааны тоог хасах`}
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-medium text-slate-700">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            disabled={disabled || item.quantity >= item.stock}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-700 hover:bg-slate-200 disabled:cursor-wait disabled:opacity-40"
            aria-label={`${item.name} барааны тоог нэмэх`}
          >
            +
          </button>
        </div>
        <p className="mt-3 font-semibold text-orange-500">
          Дүн: {(item.price * item.quantity).toLocaleString("mn-MN")}₮
        </p>
        <p className="mt-1 text-xs text-emerald-600">
          Үлдэгдэл: {item.stock} ширхэг
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={disabled}
        className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full text-xl text-slate-500 hover:bg-red-50 hover:text-red-500 disabled:cursor-wait disabled:opacity-40"
        aria-label={`${item.name} барааг сагснаас устгах`}
      >
        ×
      </button>
    </div>
  );
}