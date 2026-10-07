"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Category, ProductInput } from "@/lib/products";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
};

const emptyValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
};

type ProductFormProps = {
  categories: Category[];
  initialValues?: ProductFormValues;
  submitLabel: string;
  busy: boolean;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel?: () => void;
};

export default function ProductForm({
  categories,
  initialValues,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? emptyValues,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [priceError, setPriceError] = useState("");

  function update<K extends keyof ProductFormValues>(key: K, value: string) {
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
    setFormError("");

    const price = Number(values.price);
    if (!Number.isSafeInteger(price) || price < 1 || price > 100000000) {
      setPriceError("1-100'000'000 хооронд үний дүн оруулна уу.");
      return;
    }
    setPriceError("");

    if (!values.imageUrl.trim()) {
      setFormError("Барааны зураг оруулна уу.");
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      category_id: values.categoryId ? Number(values.categoryId) : null,
      image_url: values.imageUrl.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">
        Нэр
        <input
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Ангилал
        <select
          value={values.categoryId}
          onChange={(event) => update("categoryId", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        >
          <option value="">Ангилалгүй</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Үнэ (₮)
        <input
          required
          type="number"
          value={values.price}
          onChange={(event) => {
            update("price", event.target.value);
            setPriceError("");
          }}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
        {priceError && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {priceError}
          </p>
        )}
      </label>

      <label className="text-sm font-medium text-slate-700">
        Үлдэгдэл
        <input
          required
          type="number"
          min={0}
          value={values.stock}
          onChange={(event) => update("stock", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
      </label>

      <label className="text-sm font-medium text-slate-700 sm:col-span-2">
        Бүтээгдэхүүний зураг
        <div className="mt-1 flex items-center gap-4">
          {values.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.imageUrl}
              alt="Барааны зураг"
              className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
            />
          )}
          {formError && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {formError}
            </p>
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
              <p className="mt-1 text-xs text-slate-500">Байршуулж байна...</p>
            )}
            {uploadError && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </label>

      <label className="text-sm font-medium text-slate-700 sm:col-span-2">
        Тайлбар
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-orange-400"
        />
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
