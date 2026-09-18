import type { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg shadow-orange-200/70">
      <div className="relative h-56 w-full bg-white">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 200vw, (max-width: 1024px) 50vw, 530vw"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {product.description}
        </p>
        <p className="mt-4 text-lg font-bold text-orange-600">
          Үнэ: {product.price.toLocaleString("mn-MN")}₮
        </p>
        <Link
          href={`/products/${product.id}`}
          className="mt-4 inline-block rounded-full bg-orange-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-400/20 transition-all hover:-translate-y-1 hover:bg-orange-300 hover:shadow-orange-400/40"
        >
          Дэлэгрэнгүй мэдээлэл
        </Link>
      </div>
    </article>
  );
}
