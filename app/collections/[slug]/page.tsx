import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategorySlug } from "@/lib/products";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const result = await getProductsByCategorySlug(slug);

  if (!result) {
    notFound();
  }

  const { category, products } = result;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-14 text-slate-900 sm:px-6 sm:py-16">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
      >
        ← Бүтээгдэхүүн рүү буцах
      </Link>

      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-10 rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
            Collection
          </p>
          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h1 className="text-3xl font-black sm:text-5xl">
              {category.name}
            </h1>
            <p className="text-sm text-slate-500">
              {products.length} төрлийн бүтээгдэхүүн байна.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-500">
              Энэ ангилалд одоогоор бараа байхгүй байна.
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
