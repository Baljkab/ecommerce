import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import Link from "next/link";

export default function ProductsPage() {
  const collections = [
    {
      name: "Зөөврийн компьютер",
      href: "/collections/laptop",
    },
    {
      name: "Gaming PC",
      href: "/collections/gaming-pc",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <section className="mx-auto w-full max-w-7xl">
        {collections.map((collection) => {
          const collectionProducts = products.filter((product) =>
            collection.name === "Gaming PC"
              ? product.category === "Суурин компьютер"
              : product.category === collection.name,
          );

          return (
            <div key={collection.name} className="mb-14 last:mb-0">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-black sm:text-4xl">
                  {collection.name}
                </h1>

                <Link
                  href={collection.href}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-orange-600"
                >
                  Бүгдийг үзэх
                  <span className="text-xl">→</span>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {collectionProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}