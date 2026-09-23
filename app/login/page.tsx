"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Нэвтрэх үед алдаа гарлаа.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Нэвтрэх</h1>
        <p className="mt-2 text-sm text-slate-500">
          Бүртгэлдээ нэвтэрч сагсаа хадгалаарай.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            И-мэйл
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Нууц үгээ оруулна уу"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-x-3">
          <p className="text-sm text-slate-500">Хэрвээ бүртгэл байхгүй бол?</p>
          <Link
            href="/signup"
            className="text-sm font-semibold text-orange-600 hover:underline"
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
