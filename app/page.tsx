import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import HeroCarousel from "@/components/HeroCarousel";
import type { HeroSlide } from "@/components/HeroCarousel";
import { getCategories, getProducts } from "@/lib/products";
import { getBanners } from "@/lib/banners";

const PRODUCTS_PER_COLLECTION = 4;

export default async function Home() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
  ]);

  const collections = categories
    .map((category) => ({
      category,
      products: products.filter(
        (product) => product.categorySlug === category.slug,
      ),
    }))
    .filter((collection) => collection.products.length > 0);

  const heroSlides: HeroSlide[] =
    banners.length > 0
      ? banners.map((banner) => ({
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          imageUrl: banner.imageUrl,
          href: banner.href,
        }))
      : collections
          .map(({ category, products: categoryProducts }) => {
            const featured = categoryProducts[0];
            if (!featured) return null;
            return {
              id: featured.id,
              title: featured.name,
              subtitle: category.name,
              imageUrl: featured.imageUrl,
              href: `/products/${featured.id}`,
            };
          })
          .filter((slide): slide is HeroSlide => slide !== null);

  return (
    <main className="overflow-hidden bg-[#f7f8fa] pb-20 text-slate-900">
      <HeroCarousel slides={heroSlides} />

      <section
        aria-label="Дэлгүүрийн мэдээлэл"
        className="relative z-10 mx-auto -mt-5 grid max-w-7xl gap-3 px-4 sm:-mt-7 sm:grid-cols-3 sm:px-6"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-900/[0.04] sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M4 6.75h16M4 12h16M4 17.25h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Сонголтоо олоорой</p>
            <p className="mt-1 text-xs text-slate-500">
              {categories.length} ангиллаас хайх
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-900/[0.04] sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M5 7.25h14v12H5v-12ZM8 7.25V5.5h8v1.75M8.5 11h7M8.5 14.5h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Бүтээгдэхүүнээ судлаарай
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {products.length} бүтээгдэхүүний мэдээлэл
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-900/[0.04] sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Хялбар захиалга</p>
            <p className="mt-1 text-xs text-slate-500">
              Сагсандаа нэмж захиалах
            </p>
          </div>
        </div>
      </section>

      {collections.length > 0 && (
        <section
          id="collections"
          className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-6 sm:pt-24"
        >
          <RevealOnScroll>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-orange-600 uppercase">
                  Өөрт тохирохыг сонго
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Аль ангиллыг сонирхож байна?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Ангиллаа сонгоод хэрэгтэй төхөөрөмж, дагалдах хэрэгслээ
                  хурдан олоорой.
                </p>
              </div>
              <Link
                href="/products"
                className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-orange-600"
              >
                Бүх бүтээгдэхүүн
                <span aria-hidden="true" className="text-lg">
                  →
                </span>
              </Link>
            </div>
          </RevealOnScroll>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map(({ category, products: categoryProducts }, index) => (
              <RevealOnScroll key={category.id} delayMs={Math.min(index * 70, 280)}>
                <Link
                  href={`/collections/${category.slug}`}
                  className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-900/[0.05] sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 text-sm font-black text-orange-700 transition-colors group-hover:from-orange-500 group-hover:to-amber-400 group-hover:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm leading-5 font-bold text-slate-900">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {categoryProducts.length} бүтээгдэхүүн
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all group-hover:bg-orange-500 group-hover:text-white"
                  >
                    →
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      {collections.length > 0 && (
        <div className="mx-auto mt-20 max-w-7xl px-4 sm:mt-24 sm:px-6">
          {collections.map(
            ({ category, products: categoryProducts }, collectionIndex) => (
              <RevealOnScroll
                key={category.id}
                delayMs={Math.min(collectionIndex * 60, 240)}
                className={collectionIndex > 0 ? "mt-20 sm:mt-24" : ""}
              >
                <section aria-labelledby={`collection-${category.id}`}>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase">
                        Ангилал {String(collectionIndex + 1).padStart(2, "0")}
                      </p>
                      <h2
                        id={`collection-${category.id}`}
                        className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
                      >
                        {category.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        {categoryProducts.length} бүтээгдэхүүнээс сонгоорой
                      </p>
                    </div>
                    <Link
                      href={`/collections/${category.slug}`}
                      className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-orange-200 hover:text-orange-700"
                    >
                      Ангиллыг үзэх
                      <span aria-hidden="true" className="text-base">
                        →
                      </span>
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categoryProducts
                      .slice(0, PRODUCTS_PER_COLLECTION)
                      .map((product, productIndex) => (
                        <RevealOnScroll
                          key={product.id}
                          delayMs={productIndex * 70}
                        >
                          <ProductCard product={product} />
                        </RevealOnScroll>
                      ))}
                  </div>
                </section>
              </RevealOnScroll>
            ),
          )}
        </div>
      )}

      {collections.length === 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-black text-slate-950">
            Бүтээгдэхүүн удахгүй нэмэгдэнэ
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Одоогоор харуулах ангилал алга байна.
          </p>
        </section>
      )}
    </main>
  );
}
