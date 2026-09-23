"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

type ProfileData = {
  full_name: string | null;
  email: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = getSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const currentEmail = session.user.email ?? "Unknown";
      const currentName =
        session.user.user_metadata?.full_name ??
        session.user.email?.split("@")[0] ??
        "Хэрэглэгч";

      setProfile({
        full_name: currentName,
        email: currentEmail,
      });

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-slate-600">Түр хүлээнэ үү...</p>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Профайл
        </p>

        <h1 className="mt-4 text-3xl font-black text-slate-900">
          {profile.full_name}
        </h1>

        <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-5">
          <div>
            <p className="text-sm text-slate-500">Имэйл</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {profile.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Төлөв</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">
              Нэвтэрсэн
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
