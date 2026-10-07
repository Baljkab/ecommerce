"use client";

import { useState } from "react";
import OrderDeliveryBadge from "@/components/OrderDeliveryBadge";
import {
  deliveryStatuses,
  isDeliveryStatus,
  type AdminOrder,
  type DeliveryStatus,
} from "@/lib/admin-orders";

export default function OrderCard({
  order,
  busy,
  onSave,
}: {
  order: AdminOrder;
  busy: boolean;
  onSave: (order: AdminOrder, status: DeliveryStatus) => Promise<void>;
}) {
  const [selected, setSelected] = useState(order.delivery_status);
  const address = [
    order.province,
    order.district,
    order.khoroo && `${order.khoroo} хороо`,
    order.address_detail,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03] transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-900/[0.06]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-slate-50/80 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em] text-orange-600 uppercase">
            Захиалгын дугаар
          </p>
          <h2 className="mt-2 inline-flex max-w-full rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs break-all text-slate-700">
            {order.id}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 text-slate-400"
            >
              <path
                d="M6.5 2.5v3m7-3v3M3.5 7h13m-12-3h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {new Date(order.created_at).toLocaleString("mn-MN", {
              timeZone: "Asia/Ulaanbaatar",
            })}
          </p>
        </div>
        <OrderDeliveryBadge status={order.delivery_status} />
      </header>
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl bg-slate-50/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M10 17s5-4.1 5-8a5 5 0 1 0-10 0c0 3.9 5 8 5 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle
                  cx="10"
                  cy="9"
                  r="1.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Хүргэлтийн мэдээлэл
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Холбоо барих ба хаяг
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="border-b border-slate-200/70 pb-3">
              <dt className="text-xs font-medium text-slate-500">
                Утасны дугаар
              </dt>
              <dd className="mt-1.5 font-semibold text-slate-900">
                {order.phone_number || "Бүртгээгүй"}
              </dd>
            </div>
            <div className="border-b border-slate-200/70 pb-3">
              <dt className="text-xs font-medium text-slate-500">Имэйл</dt>
              <dd className="mt-1.5 break-all font-medium text-slate-900">
                {order.email || "Бүртгээгүй"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Хүргэх хаяг
              </dt>
              <dd className="mt-1.5 leading-6 break-words whitespace-pre-wrap font-medium text-slate-800">
                {address || "Хаяг бүртгээгүй"}
              </dd>
            </div>
          </dl>
        </section>
        <section className="min-w-0 rounded-2xl border border-slate-100 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Захиалсан бараа
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {order.order_items.length} нэр төрөл
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-700">
              Захиалга
            </span>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {order.order_items.map((item, index) => (
              <li
                key={`${item.product_id}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-semibold break-words text-slate-800">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {Number(item.unit_price).toLocaleString("mn-MN")}₮ ×{" "}
                    {item.quantity} ширхэг
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-slate-900 tabular-nums">
                  {(Number(item.unit_price) * item.quantity).toLocaleString(
                    "mn-MN",
                  )}
                  ₮
                </span>
              </li>
            ))}
          </ul>
          {order.order_items.length === 0 && (
            <p className="mt-3 text-sm text-amber-700">
              Барааны мэдээлэл олдсонгүй.
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-orange-50/70 px-4 py-3">
            <span className="text-xs font-bold text-slate-600">Нийт дүн</span>
            <span className="text-lg font-black text-orange-700">
              {Number(order.total_price).toLocaleString("mn-MN")}₮
            </span>
          </div>
        </section>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSave(order, selected);
        }}
        className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-end sm:p-5 sm:px-6"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-xs font-bold text-slate-600 sm:max-w-sm">
          Хүргэлтийн төлөв
          <select
            value={selected}
            disabled={busy}
            onChange={(event) => {
              if (isDeliveryStatus(event.target.value))
                setSelected(event.target.value);
            }}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-2 focus:outline-orange-500 disabled:opacity-60"
          >
            {Object.entries(deliveryStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={busy || selected === order.delivery_status}
          className="min-h-11 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white shadow-sm shadow-orange-600/20 transition-all hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {busy ? "Хадгалж байна..." : "Төлөв хадгалах"}
        </button>
      </form>
    </article>
  );
}
