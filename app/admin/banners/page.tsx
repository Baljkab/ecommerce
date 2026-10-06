"use client";

import { useEffect, useState } from "react";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
  type Banner,
  type BannerInput,
} from "@/lib/banners";
import BannerForm from "@/components/admin/BannerForm";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      setBanners(await getBanners());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Мэдээлэл татахад алдаа гарлаа.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Хуудас анх ачаалагдахад баннерын жагсаалтыг нэг удаа татна.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, []);

  async function handleCreate(input: BannerInput) {
    setBusy(true);
    setError("");
    try {
      await createBanner(input);
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Баннер нэмэхэд алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(input: BannerInput) {
    if (editingId === null) return;
    setBusy(true);
    setError("");
    try {
      await updateBanner(editingId, input);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Баннер шинэчлэхэд алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Энэ баннерыг устгахдаа итгэлтэй байна уу?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteBanner(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Баннер устгахад алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  const editingBanner = banners.find((banner) => banner.id === editingId);

  if (loading) {
    return <p className="text-slate-500">Ачаалж байна...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Нүүр хуудасны баннер
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Нүүр хуудасны hero carousel-д харагдах зурагнуудыг удирдана.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowAddForm((open) => !open);
          }}
          className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white transition-colors hover:bg-orange-600"
        >
          {showAddForm ? "Хаах" : "Шинэ баннер нэмэх"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {showAddForm && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Шинэ баннер</h2>
          <BannerForm submitLabel="Нэмэх" busy={busy} onSubmit={handleCreate} />
        </div>
      )}

      {editingBanner && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/40 p-6">
          <h2 className="font-bold text-slate-900">
            &quot;{editingBanner.title}&quot; засах
          </h2>
          <BannerForm
            submitLabel="Хадгалах"
            busy={busy}
            initialValues={{
              title: editingBanner.title,
              subtitle: editingBanner.subtitle,
              href: editingBanner.href,
              sortOrder: String(editingBanner.sortOrder),
              imageUrl: editingBanner.imageUrl,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-16 w-28 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-slate-900">{banner.title}</p>
              <p className="text-sm text-slate-500">
                {banner.subtitle || "—"} · {banner.href} · эрэмбэ:{" "}
                {banner.sortOrder}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(banner.id);
              }}
              className="font-semibold text-orange-600 hover:underline"
            >
              Засах
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(banner.id)}
              className="font-semibold text-red-500 hover:underline"
            >
              Устгах
            </button>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400">
            Баннер алга байна. Нэмэх хүртэл нүүр хуудсан дээр ангиллын
            бараагаар автоматаар бүрдсэн carousel харагдана.
          </p>
        )}
      </div>
    </div>
  );
}
