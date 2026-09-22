import Image from "next/image";

type CartItemProps = {
  item: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    stock: number;
  };
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
};

export default function CartItem({ item, onRemove, onIncrease, onDecrease }: CartItemProps) {
  return (
    <div className="flex gap-4 border-b border-slate-200 py-4">
      <div className="relative h-20 w-20 rounded-lg bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="rounded-lg object-contain p-2"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{item.name}</p>
        <div>
          <button 
            type="button"
            onClick={()=> onDecrease(item.id)}
            disabled={item.quantity === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={'${item.name} Бараа хасах'}
          >
            -
          </button>
          <span className="min-w-24 text-center text-sm text-slate-500">
            Тоо ширхэг: {item.quantity}
          </span>
          <button
            type="button"
            onClick={()=> onIncrease(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${item.name} барааны тоо нэмэх`}
          >
            +
          </button>
        </div>
        <p className="mt-2 font-semibold text-orange-500">
          Үнэ: {(item.price * item.quantity).toLocaleString("mn-MN")}₮
        </p>
        <p className="mt-1 text-xs text-emerald-600">
          Үлдэгдэл: {item.stock} ширхэг
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="self-center text-xl text-slate-500 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
}
