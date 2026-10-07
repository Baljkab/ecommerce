"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
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
      const { error: signInError, data } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      const userId = data.user?.id;
      const { data: profile, error: profileError } = userId
        ? await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single()
        : { data: null, error: null };

      if (profileError) {
        console.error("Профайл татахад алдаа гарлаа:", profileError);
      }

      router.push(profile?.role === "admin" ? "/admin" : "/");
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
    <div>
      <h1 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        Нэвтрэх
      </h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        Бүртгэлдээ нэвтэрч сагсаа хадгалаарай.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-700">
          И-мэйл
          <span className="relative mt-2 block">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-orange-100 bg-orange-50 px-4 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              placeholder="name@example.com"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500"
            >
              <circle
                cx="12"
                cy="8"
                r="3.25"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M5.5 20v-1.25A5.75 5.75 0 0 1 11.25 13h1.5a5.75 5.75 0 0 1 5.75 5.75V20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Нууц үг
          <span className="relative mt-2 block">
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-orange-100 bg-orange-50 px-4 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              placeholder="Нууц үгээ оруулна уу"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8 10V7.5a4 4 0 0 1 8 0V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-orange-500 px-6 font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-slate-500">
        Нэвтэрснээр сонгосон бүтээгдэхүүнээ сагсандаа хадгалж захиалга хийх боломжтой.
      </p>
    </div>
  );
}
