import Image from "next/image";

type CartItemProps = {
  item: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };
  onRemove: (id: number) => void;
};

export default function CartItem({ item, onRemove }: CartItemProps) {
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
        <p className="mt-1 text-sm text-slate-500">
          Тоо ширхэг: {item.quantity}
        </p>
        <p className="mt-2 font-semibold text-orange-500">
          Үнэ: {(item.price * item.quantity).toLocaleString("mn-MN")}₮
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
