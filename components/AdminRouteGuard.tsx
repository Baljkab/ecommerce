"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

// Admin эрхтэй хэрэглэгчийг зөвхөн /admin доторх хуудсуудад байлгана.
export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let active = true;
    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

    async function checkRole() {
      if (isAdminRoute) {
        if (active) setBlocked(false);
        return;
      }

      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (active) setBlocked(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (profile?.role === "admin") {
        setBlocked(true);
        router.replace("/admin");
      } else {
        setBlocked(false);
      }
    }

    void checkRole();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (blocked) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Шилжүүлж байна...</p>
      </main>
    );
  }

  return <>{children}</>;
}
