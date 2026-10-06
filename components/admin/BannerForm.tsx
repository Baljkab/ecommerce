"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { BannerInput } from "@/lib/banners";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export type BannerFormValues = {
  title: string;
  subtitle: string;
  href: string;
  sortOrder: string;
  imageUrl: string;
};

const emptyValues: BannerFormValues = {
  title: "",
  subtitle: "",
  href: "/products",
  sortOrder: "0",
  imageUrl: "",
};

type BannerFormProps = {
  initialValues?: BannerFormValues;
  submitLabel: string;
  busy: boolean;
  onSubmit: (input: BannerInput) => Promise<void>;
  onCancel?: () => void;
};

export default function BannerForm({
  initialValues,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: BannerFormProps) {
  const [values, setValues] = useState<BannerFormValues>(
    initialValues ?? emptyValues,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function update<K extends keyof BannerFormValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImageToCloudinary(file);
      update("imageUrl", url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Зураг байршуулахад алдаа гарлаа.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit({
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      href: values.href.trim() || "/products",
      sort_order: Number(values.sortOrder) || 0,
      image_url: values.imageUrl.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">
        Гарчиг
        <input
          required
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Дэд гарчиг
        <input
          value={values.subtitle}
          onChange={(event) => update("subtitle", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Холбоос (жишээ нь /products)
        <input
          required
          value={values.href}
          onChange={(event) => update("href", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Эрэмбэ (жижиг тоо эхэнд гарна)
        <input
          required
          type="number"
          value={values.sortOrder}
          onChange={(event) => update("sortOrder", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700 sm:col-span-2">
        Баннерын зураг
        <div className="mt-1 flex items-center gap-4">
          {values.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.imageUrl}
              alt="Баннерын зураг"
              className="h-16 w-28 rounded-xl border border-slate-200 object-cover"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleImageSelect(event)}
              disabled={uploading}
              className="block text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {uploading && (
              <p className="mt-1 text-xs text-slate-500">
                Байршуулж байна...
              </p>
            )}
            {uploadError && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </label>

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy || uploading}
          className="rounded-full bg-orange-500 px-6 py-2 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Хадгалж байна..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Цуцлах
          </button>
        )}
      </div>
    </form>
  );
}
