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

  // Админ хэсэгт зориулж баннер тохируулсан бол тэрнийг,
  // эс тэгвэл ангилал тус бүрийн эхний барааг hero слайд болгоно.
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
    <main className="bg-white text-slate-900">
      <HeroCarousel slides={heroSlides} />

      {collections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          {collections.map(
            ({ category, products: categoryProducts }, collectionIndex) => (
              <RevealOnScroll
                key={category.id}
                delayMs={collectionIndex * 80}
                className="mt-16 first:mt-0"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.3em] text-orange-500 uppercase">
                      Collection
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {category.name}
                    </h2>
                  </div>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
                  >
                    Бүгдийг харах →
                  </Link>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryProducts
                    .slice(0, PRODUCTS_PER_COLLECTION)
                    .map((product, productIndex) => (
                      <RevealOnScroll
                        key={product.id}
                        delayMs={productIndex * 80}
                      >
                        <ProductCard product={product} />
                      </RevealOnScroll>
                    ))}
                </div>
              </RevealOnScroll>
            ),
          )}
        </section>
      )}
    </main>
  );
}
