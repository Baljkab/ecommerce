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
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {view === "active" ? "Захиалга удирдах" : "Захиалгын түүх"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Захиалга, хүргэлтийн мэдээллийг хянаж, төлөвийг шинэчилнэ.
          </p>
        </div>
        <button
          onClick={() => {
            setNotice("");
            void loadOrders();
          }}
          disabled={loading || !!savingId}
          className="min-h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          Жагсаалт шинэчлэх
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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
            className={`rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50 ${
              view === value
                ? "bg-orange-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="my-6 flex flex-wrap items-end justify-between gap-4">
        {view === "active" && (
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
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
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 focus:outline-2 focus:outline-orange-500"
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
          <p className="text-sm text-slate-500">Нийт {count} захиалга</p>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {loading ? (
        <p role="status" className="py-12 text-center text-slate-500">
          Захиалгуудыг ачаалж байна...
        </p>
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
            <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              {view === "history"
                ? "Хүргэгдсэн захиалга одоогоор алга байна."
                : "Энэ төлөвтэй идэвхтэй захиалга одоогоор алга байна."}
            </p>
          )}
        </div>
      )}
      <nav
        aria-label="Захиалгын хуудас"
        className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm"
      >
        <button
          disabled={page === 0 || loading || !!savingId}
          onClick={() => setPage(page - 1)}
          className="min-h-11 rounded-xl border border-slate-200 px-4 disabled:opacity-40"
        >
          Өмнөх
        </button>
        <span>
          {page + 1} / {Math.max(1, Math.ceil(count / ORDERS_PAGE_SIZE))}
        </span>
        <button
          disabled={
            (page + 1) * ORDERS_PAGE_SIZE >= count || loading || !!savingId
          }
          onClick={() => setPage(page + 1)}
          className="min-h-11 rounded-xl border border-slate-200 px-4 disabled:opacity-40"
        >
          Дараах
        </button>
      </nav>
    </div>
  );
}
