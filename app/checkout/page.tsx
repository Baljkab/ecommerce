"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { getSupabaseClient } from "@/lib/supabase";
import { createOrder } from "@/lib/orders";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, isLoading } = useCart();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | "">("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitLock = useRef(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("phone_number")
        .eq("id", session.user.id)
        .single();

      if (
        typeof profile?.phone_number === "number" &&
        Number.isSafeInteger(profile.phone_number)
      ) {
        setPhoneNumber(profile.phone_number);
      }
    }

    void loadProfile();
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!userId || submitLock.current) return;
    if (
      phoneNumber === "" ||
      !Number.isSafeInteger(phoneNumber) ||
      phoneNumber < 10_000_000 ||
      phoneNumber > 99_999_999
    ) {
      setError("Утасны дугаарыг 8 оронтой тоогоор оруулна уу.");
      return;
    }
    submitLock.current = true;

    setSubmitting(true);
    setError("");
    try {
      const supabase = getSupabaseClient();
      const orderId = await createOrder(
        supabase,
        userId,
        { province, district, khoroo, addressDetail, phoneNumber, email },
        items,
      );
      // The order is already committed; cart cleanup must not create a retry.
      try {
        await clearCart();
      } catch {
        /* Show the confirmed order regardless. */
      }
      router.push(`/orders/${orderId}`);
    } catch (err) {
      submitLock.current = false;
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "Захиалга өгөхөд алдаа гарлаа.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="p-10 text-center text-slate-500">Ачаалж байна...</p>;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-slate-500">Сагс хоосон байна.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900">Захиалга өгөх</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Хот/Аймаг
            <input
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Дүүрэг/Сум
            <input
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Хороо
            <input
              required
              value={khoroo}
              onChange={(e) => setKhoroo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Дэлгэрэнгүй хаяг
            <textarea
              required
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Утасны дугаар
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={8}
              value={phoneNumber}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 8);
                setPhoneNumber(digits ? Number(digits) : "");
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Имэйл
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Захиалж байна..." : "Захиалга баталгаажуулах"}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-bold text-slate-900">Захиалгын дэлгэрэнгүй</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString("mn-MN")}₮
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-lg font-bold text-slate-900">
              Нийт: {totalPrice.toLocaleString("mn-MN")}₮
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
