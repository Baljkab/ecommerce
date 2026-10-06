export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-bold tracking-widest text-orange-500 uppercase">
          TechStore
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-5xl">
          Бидний тухай
        </h1>

        <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
          TechStore нь технологийн бүтээгдэхүүнийг хэрэглэгчдэд хялбар,
          найдвартай байдлаар хүргэх зорилготой онлайн дэлгүүр юм.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-orange-50 p-5">
            <h2 className="font-bold text-slate-900">Чанартай бараа</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Сонгогдсон технологийн бүтээгдэхүүнүүд.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Шуурхай хүргэлт</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Захиалгыг аюулгүй, хурдан хүргэнэ.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Хэрэглэгч төвтэй</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Танд хэрэгтэй сонголтыг хийхэд тусална.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}