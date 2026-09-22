import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductPurchase from "@/components/ProductPurchase";
import { getProductById } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductsDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <section className="mx-auto w-full">
        <Link
          href="/products"
          className="inline-flex px-6 py-6 text-sm font-medium text-slate-500 transition-colors hover:text-orange-500 sm:px-10"
        >
          ← Бүтээгдэхүүн рүү буцах
        </Link>

        <div className="grid min-h-[calc(100vh-88px)] md:grid-cols-2">
          <div className="relative min-h-[420px] bg-white sm:min-h-[560px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-10 transition-transform duration-500 hover:scale-105 sm:p-16"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24">
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-amber-400">
              <span className="text-2xl tracking-tight">★★★★★</span>
              <span className="font-semibold text-slate-800">5.0</span>
            </div>
            <div className="mt-5 flex items-center justify-between border-y border-slate-200 py-3">
              <p className="text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
                {product.category}
              </p>
              <span className="rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                Шинэ
              </span>
            </div>
            <div className="mt-8 border-b border-slate-200 pb-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Бүтээгдэхүүний дэлгэрэнгүй:
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {product.description}
              </p>
            </div>
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>
    </main>
  );
}
