"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import ProfileSidebar from "@/components/ProfileSidebar";
import { motion } from "motion/react";

type ProfileData = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

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

      // profiles хүснэгтээс full_name, phone_number, avatar_url-ыг унших
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("full_name, phone_number, avatar_url")
        .eq("id", session.user.id)
        .single();

      const currentName =
        profileRow?.full_name ??
        session.user.user_metadata?.full_name ??
        session.user.email?.split("@")[0] ??
        "Хэрэглэгч";

      setUserId(session.user.id);
      setProfile({
        fullName: currentName,
        email: session.user.email ?? "",
        avatarUrl: profileRow?.avatar_url ?? null,
      });
      setFirstName(currentName);
      setPhoneNumber(profileRow?.phone_number ?? "");
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!userId) return;

    setSaveError("");
    setSaved(false);
    if (!/^\d{8}$/.test(phoneNumber)) {
      setSaveError("Утасны дугаарыг 8 оронтой цифрээр оруулна уу.");
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: firstName, phone_number: Number(phoneNumber) })
        .eq("id", userId);
      if (error) throw error;

      // Header зэрэг session-оос уншдаг компонентуудыг ч синк хийх
      await supabase.auth.updateUser({ data: { full_name: firstName } });

      setProfile((current) =>
        current ? { ...current, fullName: firstName } : current,
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSaving(false);
    }
  }

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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {saved && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold text-emerald-700 shadow-lg"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            ✓
          </span>
          Амжилттай хадгалагдлаа
        </motion.div>
      )}

      <nav
        aria-label="Хөндлөн зам"
        className="flex items-center gap-2 text-sm text-slate-400"
      >
        <Link href="/" className="hover:text-orange-600">
          Нүүр хуудас
        </Link>
        <span>›</span>
        <span className="text-slate-700">Хувийн мэдээлэл</span>
      </nav>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <ProfileSidebar name={profile.fullName} avatarUrl={profile.avatarUrl} />

        <section className="flex-1">
          <h1 className="text-3xl font-black text-slate-900">
            Хувийн мэдээлэл
          </h1>

          <form
            noValidate
            onSubmit={handleSave}
            className="mt-8 grid gap-6 sm:grid-cols-2"
          >
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-slate-700"
              >
                Нэр<span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-900 focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-slate-700"
              >
                Утасны дугаар<span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                required
                minLength={8}
                maxLength={8}
                pattern="[0-9]{8}"
                placeholder="99112233"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value.replace(/\D/g, "").slice(0, 8),
                  )
                }
                className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-900 focus:border-orange-400 focus:outline-none"
              />
              {saveError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {saveError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Имэйл<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-slate-500"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-orange-500 px-6 py-4 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
              >
                {saving
                  ? "Хадгалж байна..."
                  : saved
                    ? "Хадгалагдлаа"
                    : "Хадгалах"}
              </button>
            </div>

            <div className="text-center sm:col-span-2">
              <button
                type="button"
                className="text-sm font-semibold text-slate-700 underline"
              >
                Нууц үг солих
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
