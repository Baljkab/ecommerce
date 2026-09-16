import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Ecommerce
        </Link>

        <nav aria-label="Үндсэн цэс" className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Нүүр
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Бүтээгдэхүүн
          </Link>
          <Link
            href="/cart"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Сагс
          </Link>
        </nav>
      </div>
    </header>
  );
}
