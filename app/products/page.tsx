import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Манай сонголт
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Бүтээгдэхүүн
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Танд хэрэгтэй, чанартай бараануудыг нэг дороос сонгоорой.
          </p>
        </div>

        <div className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
            <div
              key={product.id}
              className="group w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-xl shadow-slate-950/50 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-cyan-950/30"
            >
              <ProductCard product={product} />
            </div>
        ))}
        </div>
      </section>
    </main>
  );
}
