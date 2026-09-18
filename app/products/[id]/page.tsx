import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import Image from "next/image";
import ProductOptions from "@/components/ProductOptions";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductsDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto w-full">
        <Link
          href="/products"
          className="inline-flex px-6 py-6 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300 sm:px-10"
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
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-400">
              {product.description}
            </p>
            <p className="mt-8 text-3xl font-bold text-cyan-300">
              {product.price.toLocaleString("mn-MN")}₮
            </p>
            <ProductOptions sizes={product.size} stock={product.stock} />
          </div>
        </div>
      </section>
    </main>
  );
}
