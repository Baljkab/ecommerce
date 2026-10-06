"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import OrderDeliveryBadge from "@/components/OrderDeliveryBadge";
import type { DeliveryStatus } from "@/lib/admin-orders";

type Order = {
  id: string;
  total_price: number;
  status: string;
  delivery_status: DeliveryStatus;
  province: string | null;
  district: string | null;
  khoroo: string | null;
  address_detail: string | null;
};

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getOrder() {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, total_price, status, delivery_status, province, district, khoroo, address_detail",
        )
        .eq("id", params.id)
        .maybeSingle();

      if (error) {
        setErrorMessage(error.message);
      } else if (!data) {
        setErrorMessage("Захиалга олдсонгүй.");
      } else {
        setOrder(data);
      }

      setLoading(false);
    }

    getOrder();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <p
          role="status"
          className="rounded-2xl border border-orange-100 bg-orange-50 px-8 py-5 text-sm font-medium text-slate-600"
        >
          Захиалгын мэдээллийг ачаалж байна...
        </p>
      </main>
    );
  }

  if (errorMessage || !order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Захиалга харах боломжгүй байна
          </h1>
          <p
            role="alert"
            className="mt-3 text-sm leading-6 break-words text-red-700"
          >
            {errorMessage || "Захиалга олдсонгүй."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-orange-50/70 to-white px-4 py-12 sm:px-6 sm:py-20">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-900/5">
        <div className="px-6 pt-10 pb-8 text-center sm:px-10 sm:pt-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-9 text-emerald-600"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>
          <h1 className="mt-7 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Захиалга амжилттай!
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Манай дэлгүүрийг сонгон үйлчлүүлсэн танд баярлалаа.
          </p>
        </div>

        <div className="mx-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 sm:mx-10 sm:p-6">
          <dl>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <dt className="text-sm font-semibold text-slate-600">
                Хүргэлтийн төлөв
              </dt>
              <dd>
                <OrderDeliveryBadge status={order.delivery_status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-slate-500">
                Захиалгын дугаар
              </dt>
              <dd className="mt-2 font-mono text-sm leading-6 font-medium break-all text-slate-800">
                {order.id}
              </dd>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-5">
              <dt className="text-sm font-semibold text-slate-600">Нийт дүн</dt>
              <dd className="text-2xl font-black break-all text-orange-600 tabular-nums sm:text-3xl">
                {Number(order.total_price).toLocaleString("mn-MN")}₮
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-6 pt-7 pb-8 sm:px-10 sm:pb-10">
          <Link
            href="/orders"
            className="mb-3 flex min-h-12 w-full items-center justify-center rounded-full border border-orange-200 px-6 py-3 text-sm font-bold text-orange-700 hover:bg-orange-50"
          >
            Миний захиалгуудыг харах
          </Link>
          <Link
            href="/products"
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            Үргэлжлүүлэн худалдаа хийх
          </Link>
          <Link
            href="/"
            className="mx-auto mt-4 flex min-h-11 w-fit items-center rounded-lg px-4 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </section>
    </main>
  );
}
