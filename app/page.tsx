import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 py-20 text-slate-900">
      <section
        className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xl shadow-slate-200/70 sm:px-12"
      >
        <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-orange-400" />
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-orange-300 uppercase">
          Таны онлайн худалдааны сонголт
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Манай дэлгүүр
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          Таны сонирхолтой барааг нэг дороос олж, хялбархан сонгоорой.
        </p>
        <Link href="/products">
          <button
            type="button"
            className="mt-8 rounded-full bg-orange-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-400/20 transition-all hover:-translate-y-1 hover:bg-orange-300 hover:shadow-orange-400/40"
          >
            Бараа үзэх
          </button>
        </Link>
      </section>
    </main>
  );
}
