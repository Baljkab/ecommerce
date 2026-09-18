import type { Product } from "@/types/product";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Үнэ: {product.price}</p>
      <Link
        href={`/products/${product.id}`}
        className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition-all hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-cyan-400/40"
      >
        дэлэгрэнгүй мэдээлэл
      </Link>
    </article>
  );
}
