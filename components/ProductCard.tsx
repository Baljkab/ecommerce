import type { Product } from "@/types/product";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.025] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/[0.08]">
      <Link
        href={`/products/${product.id}`}
        aria-label={`${product.name} бүтээгдэхүүний дэлгэрэнгүй`}
        className="relative block overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/60"
      >
        <div className="relative aspect-[1.18]">
          <ProductImage src={product.imageUrl} alt={product.name} />
        </div>
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide backdrop-blur ${
            product.stock > 0
              ? "bg-emerald-50/90 text-emerald-700"
              : "bg-slate-900/80 text-white"
          }`}
        >
          {product.stock > 0 ? "Бэлэн" : "Дууссан"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold tracking-[0.16em] text-orange-600 uppercase">
          {product.category}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base leading-6 font-bold text-slate-900 transition-colors group-hover:text-orange-700">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">
              {product.price.toLocaleString("mn-MN")}₮
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Үлдэгдэл: {product.stock}
            </p>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            aria-label={`${product.name} дэлгэрэнгүй үзэх`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M3.5 10h13m0 0-5-5m5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
