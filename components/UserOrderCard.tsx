import OrderDeliveryBadge from "@/components/OrderDeliveryBadge";
import type { AdminOrder } from "@/lib/admin-orders";

export default function UserOrderCard({ order }: { order: AdminOrder }) {
  const address = [
    order.province,
    order.district,
    order.khoroo && `${order.khoroo} хороо`,
    order.address_detail,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">Захиалга</h2>
          <p className="mt-1 font-mono text-xs break-all text-slate-500">
            {order.id}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(order.created_at).toLocaleString("mn-MN", {
              timeZone: "Asia/Ulaanbaatar",
            })}
          </p>
        </div>
        <OrderDeliveryBadge status={order.delivery_status} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-600">Нийт дүн</span>
        <span className="text-xl font-black text-orange-600">
          {Number(order.total_price).toLocaleString("mn-MN")}₮
        </span>
      </div>
      <details className="mt-4 border-t border-slate-100 pt-4">
        <summary className="cursor-pointer rounded-lg py-2 text-sm font-semibold text-slate-800 focus-visible:outline-2 focus-visible:outline-orange-500">
          Бараа, хүргэлтийн дэлгэрэнгүй
        </summary>
        <ul className="mt-3 divide-y divide-slate-100">
          {order.order_items.map((item, index) => (
            <li
              key={`${item.product_id}-${index}`}
              className="flex flex-wrap justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium break-words text-slate-900">
                  {item.product_name}
                </p>
                <p className="mt-1 text-slate-500">
                  {Number(item.unit_price).toLocaleString("mn-MN")}₮ ×{" "}
                  {item.quantity} ширхэг
                </p>
              </div>
              <p className="font-semibold text-slate-800">
                {(Number(item.unit_price) * item.quantity).toLocaleString(
                  "mn-MN",
                )}
                ₮
              </p>
            </li>
          ))}
        </ul>
        {order.order_items.length === 0 && (
          <p className="py-3 text-sm text-slate-500">
            Барааны мэдээлэл олдсонгүй.
          </p>
        )}
        <dl className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
          <div>
            <dt className="text-slate-500">Хүргэлтийн хаяг</dt>
            <dd className="mt-1 break-words whitespace-pre-wrap text-slate-900">
              {address || "Бүртгээгүй"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Утас</dt>
            <dd className="mt-1 break-words text-slate-900">
              {order.phone_number || "Бүртгээгүй"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Имэйл</dt>
            <dd className="mt-1 break-all text-slate-900">
              {order.email || "Бүртгээгүй"}
            </dd>
          </div>
        </dl>
      </details>
    </article>
  );
}
