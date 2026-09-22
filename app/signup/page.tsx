import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Бүртгүүлэх</h1>
        <p className="mt-2 text-sm text-slate-500">
          TechStore-д бүртгүүлж сагсаа хадгалаарай.
        </p>

        <form className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Нэр
            <input
              type="text"
              name="fullName"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Таны нэр"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            И-мэйл
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="name@example.com"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Нууц үг
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Хамгийн багадаа 6 тэмдэгт"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Нууц үг давтах
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Нууц үгээ дахин оруулна уу"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
          >
            Бүртгэл үүсгэх
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Бүртгэлтэй юу?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:underline"
          >
            Нэвтрэх
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
        >
          Нүүр хуудас руу буцах
        </Link>
      </section>
    </main>
  );
}
