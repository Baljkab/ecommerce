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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">Захиалгын дугаар</h2>
          <p className="mt-1 font-mono text-xs break-all text-slate-500">
            {order.id}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {new Date(order.created_at).toLocaleString("mn-MN", {
              timeZone: "Asia/Ulaanbaatar",
            })}
          </p>
        </div>
        <OrderDeliveryBadge status={order.delivery_status} />
      </div>
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        <section>
          <h3 className="font-bold text-slate-900">Хүргэлтийн мэдээлэл</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Утасны дугаар</dt>
              <dd className="mt-1 font-medium break-words text-slate-900">
                {order.phone_number || "Бүртгээгүй"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Имэйл</dt>
              <dd className="mt-1 break-all text-slate-900">
                {order.email || "Бүртгээгүй"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Хүргэх хаяг</dt>
              <dd className="mt-1 leading-6 break-words whitespace-pre-wrap text-slate-900">
                {address || "Хаяг бүртгээгүй"}
              </dd>
            </div>
          </dl>
        </section>
        <section className="min-w-0">
          <h3 className="font-bold text-slate-900">Захиалсан бараа</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {order.order_items.map((item, index) => (
              <li
                key={`${item.product_id}-${index}`}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium break-words text-slate-800">
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
          <div className="mt-3 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
            <span className="text-sm font-semibold text-slate-600">
              Нийт дүн
            </span>
            <span className="text-xl font-black text-orange-600">
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
        className="flex flex-wrap items-end gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:px-6"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-xs font-semibold text-slate-600">
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
          className="min-h-11 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Хадгалж байна..." : "Төлөв хадгалах"}
        </button>
      </form>
    </article>
  );
}
