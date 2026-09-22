import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Нэвтрэх</h1>
        <p className="mt-2 text-sm text-slate-500">
          Бүртгэлдээ нэвтэрч сагсаа хадгалаарай.
        </p>

        <form className="mt-8 space-y-5">
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
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Нууц үгээ оруулна уу"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
          >
            Нэвтрэх
          </button>
        </form>
        <div className="mt-6 gap-x-3 flex item-center justify-center">
          <p className="gap-x-3">
            Хэрвээ бүртгэл байхгүй бол?
          </p>
          <Link
            href="/signup"
            className="font-semibold text-orange-600 hover:underline"
          >
            Бүртгүүлэх
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
        >
          Нүүр хуудас руу буцах
        </Link>
      </section>
    </main>
  );
}
