export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-xl font-bold tracking-wide text-white">
            Ecommerce
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Чанартай бүтээгдэхүүн, найдвартай үйлчилгээ.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Холбоо барих
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              Gmail:{" "}
              <a
                href="mailto:baljkab518@gmail.com"
                className="text-slate-200 transition-colors hover:text-cyan-300"
              >
                baljkab518@gmail.com
              </a>
            </p>
            <p>
              Утас: <span className="text-slate-200">XXXXXXXX</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        © 2026 Ecommerce. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
