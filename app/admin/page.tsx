"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats, type DashboardStats } from "@/lib/products";

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setStats(await getDashboardStats());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Статистик татахад алдаа гарлаа.",
        );
      }
    }
    void loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Админ самбар</h1>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Нийт бараа" value={stats?.totalProducts} />
        <StatCard label="Нийт үлдэгдэл" value={stats?.totalStock} />
        <StatCard label="Дууссан бараа" value={stats?.outOfStockCount} />
        <StatCard label="Ангилал" value={stats?.totalCategories} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/orders"
          className="rounded-2xl border border-orange-200 bg-orange-50 p-6 hover:border-orange-400"
        >
          <p className="font-bold text-slate-900">Захиалга удирдах</p>
          <p className="mt-1 text-sm text-slate-500">
            Захиалга, хүргэлтийн мэдээлэл харах, төлөв өөрчлөх
          </p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-orange-300"
        >
          <p className="font-bold text-slate-900">Бараа удирдах</p>
          <p className="mt-1 text-sm text-slate-500">
            Бүтээгдэхүүн нэмэх, засах, устгах
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value ?? "…"}</p>
    </div>
  );
}
