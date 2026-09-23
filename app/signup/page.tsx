"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [confirmPassword, setConfirmPassword]=useState("");
  const [error, setError]=useState("");
  const [success, setSuccess]=useState("");
  const [loading, setLoading]=useState(false);
  const router = useRouter();


  const handleSubmit = async (event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setError("");
    setSuccess("");

    if(password.length < 6){
      setError("Нууц үг хамгийн багадаа 6 тэмдэгттэй байна.");
    }

    if(password !== confirmPassword){
      setError("Нууц үг таарахгүй байна.");
    }

    setLoading(true);

    try{
      const supabase=getSupabaseClient();
      const {data, error: signUpError}=await supabase.auth.signUp({
        email, password, options: {
          data:{
            full_name: fullName,
          },
        },
      });

      if(signUpError){
        throw signUpError;
      }

      if(data.session){
        router.push("/");
        router.refresh();
        return;
      }

      setSuccess("Бүртгэл амжилттай үүслээ.");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch(err){
      setError(
        err instanceof Error ? err.message : "Бүртгэл үүсгэх үед алдаа гарлаа.",
      );
    } finally {
      setLoading(false);
    }

  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Бүртгүүлэх</h1>
        <p className="mt-2 text-sm text-slate-500">
          TechStore-д бүртгүүлж сагсаа хадгалаарай.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Нэр
            <input
              type="text"
              name="fullName"
              required
              value={fullName}
              onChange={(event)=>setFullName(event.target.value)}
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
              value={email}
              onChange={(event)=>setEmail(event.target.value)}
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
              onChange={(event)=>setPassword(event.target.value)}
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
              value={confirmPassword}
              onChange={(event)=>setConfirmPassword(event.target.value)}
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Нууц үгээ дахин оруулна уу"
            />
          </label>

          {error &&(
            <p className="rouded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-600">
              {error}
            </p>
          )}

          {success &&(
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading ? "Бүртгэж байна..." : "Бүртгэл үүссэх"}
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
