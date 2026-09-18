export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-xl font-bold tracking-wide text-slate-900">
            Ecommerce
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Чанартай бүтээгдэхүүн, найдвартай үйлчилгээ.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Холбоо барих
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              Gmail:{" "}
              <a
                href="mailto:baljkab518@gmail.com"
                className="text-slate-700 transition-colors hover:text-orange-600"
              >
                baljkab518@gmail.com
              </a>
            </p>
            <p>
              Утас: <span className="text-slate-700">XXXXXXXX</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        © 2026 Ecommerce. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
