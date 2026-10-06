"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (profile?.role !== "admin") {
        router.replace("/");
        return;
      }

      setChecking(false);
    }

    void checkAdmin();
    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Шалгаж байна...</p>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-8 flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
        <Link
          href="/admin"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-orange-600"
        >
          Самбар
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-orange-600"
        >
          Бараа
        </Link>
        <Link
          href="/admin/banners"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-orange-600"
        >
          Баннер
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-orange-600"
        >
          Захиалга
        </Link>
      </nav>
      {children}
    </div>
  );
}
