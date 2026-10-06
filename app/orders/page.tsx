"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/ProfileSidebar";
import UserOrderCard from "@/components/UserOrderCard";
import { getSupabaseClient } from "@/lib/supabase";
import { getUserOrders, USER_ORDERS_PAGE_SIZE } from "@/lib/user-orders";
import type { AdminOrder } from "@/lib/admin-orders";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [name, setName] = useState("Хэрэглэгч");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const client = getSupabaseClient();
    async function loadOrders() {
      setLoading(true);
      setError("");
      setOrders([]);
      try {
        const {
          data: { user },
          error: authError,
        } = await client.auth.getUser();
        if (!active) return;
        if (!user) {
          router.replace("/login");
          return;
        }
        if (authError) throw new Error("Нэвтрэх эрхийг шалгаж чадсангүй.");
        setName(
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : user.email?.split("@")[0] || "Хэрэглэгч",
        );
        const result = await getUserOrders(client, user.id, page);
        if (!active) return;
        if (page > 0 && result.orders.length === 0) {
          setPage(page - 1);
          return;
        }
        setOrders(result.orders);
        setCount(result.count);
      } catch (err) {
        if (active) {
          setCount(0);
          setError(
            err instanceof Error
              ? err.message
              : "Захиалгын түүхийг татаж чадсангүй.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    // Fetch again after navigation, refresh, or an account change.
    void loadOrders();
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        active = false;
        setOrders([]);
        setCount(0);
        setName("Хэрэглэгч");
        setLoading(true);
        setPage(0);
        if (event === "SIGNED_OUT") router.replace("/login");
        else setRevision((value) => value + 1);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [page, revision, router]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav
        aria-label="Хуудасны зам"
        className="mb-6 flex gap-2 text-sm text-slate-500"
      >
        <Link href="/" className="hover:text-orange-600">
          Нүүр хуудас
        </Link>
        <span aria-hidden="true">›</span>
        <span>Миний захиалга</span>
      </nav>
      <div className="flex flex-col gap-8 lg:flex-row">
        <ProfileSidebar name={name} avatarUrl={null} />
        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Миний захиалга
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Өмнөх болон хүргэлт хүлээж буй захиалгууд.
              </p>
            </div>
            <button
              disabled={loading}
              onClick={() => setRevision((value) => value + 1)}
              className="min-h-11 rounded-full border border-slate-200 px-5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Шинэчлэх
            </button>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {loading ? (
            <p role="status" className="py-12 text-center text-slate-500">
              Захиалгуудыг ачаалж байна...
            </p>
          ) : !error && orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-slate-500">
                Та одоогоор захиалга хийгээгүй байна.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-block rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700"
              >
                Бүтээгдэхүүн үзэх
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <UserOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
          {!error && count > 0 && (
            <nav
              aria-label="Захиалгын хуудас"
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm"
            >
              <button
                disabled={loading || page === 0}
                onClick={() => setPage(page - 1)}
                className="min-h-11 rounded-xl border border-slate-200 px-4 disabled:opacity-40"
              >
                Өмнөх
              </button>
              <span>
                {page + 1} / {Math.ceil(count / USER_ORDERS_PAGE_SIZE)}
              </span>
              <button
                disabled={
                  loading || (page + 1) * USER_ORDERS_PAGE_SIZE >= count
                }
                onClick={() => setPage(page + 1)}
                className="min-h-11 rounded-xl border border-slate-200 px-4 disabled:opacity-40"
              >
                Дараах
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
