"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";
import { getSupabaseClient } from "@/lib/supabase";
import {
  deliveryStatuses,
  getAdminOrders,
  isDeliveryStatus,
  ORDERS_PAGE_SIZE,
  updateDeliveryStatus,
  type AdminOrder,
  type DeliveryStatus,
} from "@/lib/admin-orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<DeliveryStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const requestId = useRef(0);
  const [view, setView] = useState<"active" | "history">("active");

  const loadOrders = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await getAdminOrders(
        getSupabaseClient(),
        page,
        filter,
        view,
      );
      if (current !== requestId.current) return;
      if (page > 0 && result.orders.length === 0) {
        setPage(page - 1);
        return;
      }
      setOrders(result.orders);
      setCount(result.count);
    } catch (err) {
      if (current === requestId.current) {
        setOrders([]);
        setCount(0);
        setError(
          err instanceof Error ? err.message : "Захиалга татахад алдаа гарлаа.",
        );
      }
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [page, filter, view]);

  useEffect(() => {
    // The list is fetched again when the selected page or filter changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOrders();
    return () => {
      requestId.current += 1;
    };
  }, [loadOrders]);

  async function saveStatus(order: AdminOrder, status: DeliveryStatus) {
    if (savingId || order.delivery_status === status) return;
    setSavingId(order.id);
    setNotice("");
    setError("");
    try {
      await updateDeliveryStatus(
        getSupabaseClient(),
        order.id,
        order.delivery_status,
        status,
      );
      setOrders((current) =>
        current
          .map((row) =>
            row.id === order.id ? { ...row, delivery_status: status } : row,
          )
          .filter((row) =>
            view === "history"
              ? row.delivery_status === "delivered"
              : row.delivery_status !== "delivered" &&
                (filter === "all" || row.delivery_status === filter),
          ),
      );
      setNotice(
        `Захиалгын төлөвийг “${deliveryStatuses[status]}” болгож хадгаллаа.`,
      );
      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Төлөв хадгалахад алдаа гарлаа.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase">
            Admin · Захиалгын төв
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {view === "active" ? "Захиалга удирдах" : "Захиалгын түүх"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Захиалга, хүргэлтийн мэдээллийг хянаж, төлөвийг шинэчилнэ.
          </p>
        </div>
        <button
          onClick={() => {
            setNotice("");
            void loadOrders();
          }}
          disabled={loading || !!savingId}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/40 hover:text-orange-700 disabled:cursor-wait disabled:opacity-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          >
            <path
              d="M16 10a6 6 0 1 1-1.8-4.3M16 4v4h-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Жагсаалт шинэчлэх
        </button>
      </header>

      <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
        {(
          [
            ["active", "Идэвхтэй захиалга"],
            ["history", "Захиалгын түүх"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={view === value}
            disabled={loading || !!savingId}
            onClick={() => {
              setView(value);
              setPage(0);
              setFilter("all");
              setNotice("");
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:cursor-wait disabled:opacity-50 ${
              view === value
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:px-5">
        {view === "active" && (
          <label className="flex min-w-52 flex-col gap-2 text-xs font-bold text-slate-600">
            Төлөвөөр шүүх
            <select
              value={filter}
              disabled={loading || !!savingId}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "all" || isDeliveryStatus(value)) {
                  setFilter(value);
                  setPage(0);
                  setNotice("");
                }
              }}
              className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
            >
              <option value="all">Бүх идэвхтэй захиалга</option>

              {Object.entries(deliveryStatuses)
                .filter(([value]) => value !== "delivered")
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </select>
          </label>
        )}
        {!loading && !error && (
          <p className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
            Нийт {count.toLocaleString("mn-MN")} захиалга
          </p>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {loading ? (
        <div
          role="status"
          className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center text-sm font-medium text-slate-500 shadow-sm"
        >
          <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
          Захиалгуудыг ачаалж байна...
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={`${order.id}-${order.delivery_status}`}
              order={order}
              busy={!!savingId}
              onSave={saveStatus}
            />
          ))}
          {!error && orders.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7"
                >
                  <path
                    d="M5 7h14v13H5V7Zm3 0V5h8v2M8 11h8m-8 4h5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                {view === "history"
                  ? "Хүргэгдсэн захиалга одоогоор алга байна."
                  : "Энэ төлөвтэй идэвхтэй захиалга одоогоор алга байна."}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Шүүлтээ өөрчлөх эсвэл жагсаалтыг шинэчлээрэй.
              </p>
            </div>
          )}
        </div>
      )}
      <nav
        aria-label="Захиалгын хуудас"
        className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm shadow-sm"
      >
        <button
          disabled={page === 0 || loading || !!savingId}
          onClick={() => setPage(page - 1)}
          className="min-h-10 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Өмнөх
        </button>
        <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-600">
          {page + 1} / {Math.max(1, Math.ceil(count / ORDERS_PAGE_SIZE))}
        </span>
        <button
          disabled={
            (page + 1) * ORDERS_PAGE_SIZE >= count || loading || !!savingId
          }
          onClick={() => setPage(page + 1)}
          className="min-h-10 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Дараах
        </button>
      </nav>
    </div>
  );
}
