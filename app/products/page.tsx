import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

const collections = [
  {
    name: "Зөөврийн компьютер",
    href: "/collections/laptop",
    categorySlug: "laptop",
  },
  {
    name: "Тоглоомын компьютер",
    href: "/collections/gaming-pc",
    categorySlug: "gaming-pc",
  },
  {
    name: "Тоглоомын хулгана",
    href: "/collections/mouse",
    categorySlug: "mouse",
  },
  {
    name: "Дэлгэц",
    href: "/collections/diplay",
    categorySlug: "diplay",
  },
];

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const searchText =
    typeof params.q === "string"
      ? params.q.trim().slice(0, 100)
      : "";

  const products = await getProducts();

  const keyword = searchText.toLocaleLowerCase("mn-MN");

  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase("mn-MN").includes(keyword),
  );

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-7xl">
        {searchText ? (
          <>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-black sm:text-4xl">
                  Хайлтын үр дүн
                </h1>

                <p className="mt-3 break-words text-slate-500">
                  “{searchText}” — {filteredProducts.length} бүтээгдэхүүн
                  олдлоо.
                </p>
              </div>

              <Link
                href="/products"
                className="shrink-0 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-600"
              >
                Хайлт цэвэрлэх
              </Link>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <h2 className="text-xl font-bold">
                  Тохирох бүтээгдэхүүн олдсонгүй
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Барааны нэрээ шалгах эсвэл өөр үгээр хайж үзээрэй.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-flex rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-700"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="sr-only">Бүтээгдэхүүн</h1>

            {collections.map((collection) => {
              const collectionProducts = products.filter(
                (product) =>
                  product.categorySlug === collection.categorySlug,
              );

              return (
                <section
                  key={collection.categorySlug}
                  className="mb-14 last:mb-0"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl font-black sm:text-4xl">
                      {collection.name}
                    </h2>

                    <Link
                      href={collection.href}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-orange-600"
                    >
                      Бүгдийг үзэх
                      <span aria-hidden="true" className="text-xl">
                        →
                      </span>
                    </Link>
                  </div>

                  {collectionProducts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {collectionProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                      Энэ ангилалд одоогоор бараа байхгүй байна.
                    </p>
                  )}
                </section>
              );
            })}
          </>
        )}
      </section>
    </main>
  );
}