import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-oronge-600 bg-orenge-500 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold tracking-wide text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950 shadow-lg shadow-oronge-600transition-transform duration-300 group-hover:rotate-6">
            E
          </span>
          <span className="transition-colors group-hover:text-orange-600">
            TechStore
          </span>
        </Link>

        <nav
          aria-label="Үндсэн цэс"
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
        >
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
          >
            Нүүр
          </Link>
          <Link
            href="/products"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
          >
            Бүтээгдэхүүн
          </Link>
          <Link
            href="/cart"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-orange-600"
          >
            Сагс
          </Link>
        </nav>
      </div>
    </header>
  );
}
