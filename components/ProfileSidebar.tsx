"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

type ProfileSidebarProps = {
  name: string;
  avatarUrl: string | null;
};

type IconName =
  | "user"
  | "heart"
  | "bag"
  | "question"
  | "gift"
  | "pin"
  | "logout";

const navItems: { key: IconName; label: string }[] = [
  { key: "user", label: "Хувийн мэдээлэл" },
  { key: "heart", label: "Хадгалсан бараа" },
  { key: "bag", label: "Миний захиалга" },
  { key: "question", label: "Тусламж" },
  { key: "gift", label: "Бэлгийн карт" },
  { key: "pin", label: "Хvргэлтийн хаяг" },
];

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    user: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    heart:
      "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
    bag: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z",
    question:
      "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
    gift: "M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
    pin: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
    logout:
      "M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75",
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 shrink-0"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileSidebar({
  name,
  avatarUrl,
}: ProfileSidebarProps) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-6 lg:w-72">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-orange-100">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Профайл зураг"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold text-orange-500">
              {name.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
        <div>
          <p className="font-bold text-slate-900">{name}</p>
          <p className="text-sm font-semibold text-orange-500">0 оноо</p>
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {navItems.map((item) => {
          const isActive = item.key === "user";
          return (
            <button
              key={item.key}
              type="button"
              disabled={!isActive}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "flex w-full items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900"
                  : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              }
            >
              <NavIcon name={item.key} />
              {item.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
        >
          <NavIcon name="logout" />
          {signingOut ? "Гарч байна..." : "Гарах"}
        </button>
      </nav>
    </aside>
  );
}
