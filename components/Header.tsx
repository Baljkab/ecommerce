import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-xl backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold tracking-wide text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition-transform duration-300 group-hover:rotate-6">
            E
          </span>
          <span className="transition-colors group-hover:text-cyan-300">
            Ecommerce
          </span>
        </Link>

        <nav
          aria-label="Үндсэн цэс"
          className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 p-1"
        >
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-cyan-300"
          >
            Нүүр
          </Link>
          <Link
            href="/products"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-cyan-300"
          >
            Бүтээгдэхүүн
          </Link>
          <Link
            href="/cart"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-cyan-300"
          >
            Сагс
          </Link>
        </nav>
      </div>
    </header>
  );
}
