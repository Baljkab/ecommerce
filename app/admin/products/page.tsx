"use client";

import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getCategories,
  updateProduct,
  type AdminProductRow,
  type Category,
  type ProductInput,
} from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormKey, setEditFormKey] = useState(0);
  const editFormRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [productRows, categoryRows] = await Promise.all([
        getAdminProducts(),
        getCategories(),
      ]);
      setProducts(productRows);
      setCategories(categoryRows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Мэдээлэл татахад алдаа гарлаа.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Хуудас анх ачаалагдахад барааны жагсаалтыг нэг удаа татна.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, []);

  useEffect(() => {
    if (editingId === null) return;
    editFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [editingId, editFormKey]);

  async function handleCreate(input: ProductInput) {
    setBusy(true);
    setError("");
    try {
      await createProduct(input);
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Бараа нэмэхэд алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(input: ProductInput) {
    if (editingId === null) return;
    setBusy(true);
    setError("");
    try {
      await updateProduct(editingId, input);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Бараа шинэчлэхэд алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Энэ барааг устгахдаа итгэлтэй байна уу?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Бараа устгахад алдаа гарлаа.",
      );
    } finally {
      setBusy(false);
    }
  }

  const editingProduct = products.find((product) => product.id === editingId);

  if (loading) {
    return <p className="text-slate-500">Ачаалж байна...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Бараа удирдах</h1>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowAddForm((open) => !open);
          }}
          className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white transition-colors hover:bg-orange-600"
        >
          {showAddForm ? "Хаах" : "Шинэ бараа нэмэх"}
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
          <h2 className="font-bold text-slate-900">Шинэ бараа</h2>
          <ProductForm
            categories={categories}
            submitLabel="Нэмэх"
            busy={busy}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {editingProduct && (
        <div
          ref={editFormRef}
          className="mt-6 scroll-mt-24 rounded-2xl border border-orange-200 bg-orange-50/40 p-6"
        >
          <h2 className="font-bold text-slate-900">
            &quot;{editingProduct.name}&quot; засах
          </h2>
          <ProductForm
            key={`${editingProduct.id}-${editFormKey}`}
            categories={categories}
            submitLabel="Хадгалах"
            busy={busy}
            initialValues={{
              name: editingProduct.name,
              description: editingProduct.description,
              price: String(editingProduct.price),
              stock: String(editingProduct.stock),
              categoryId: editingProduct.categoryId
                ? String(editingProduct.categoryId)
                : "",
              imageUrl: editingProduct.imageUrl,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Нэр</th>
              <th className="px-4 py-3">Ангилал</th>
              <th className="px-4 py-3">Үнэ</th>
              <th className="px-4 py-3">Үлдэгдэл</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {product.categoryName}
                </td>
                <td className="px-4 py-3 text-slate-900">
                  {product.price.toLocaleString("mn-MN")}₮
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock === 0
                        ? "font-semibold text-red-500"
                        : "text-emerald-600"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(product.id);
                      setEditFormKey((key) => key + 1);
                    }}
                    className="mr-3 font-semibold text-orange-600 hover:underline"
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(product.id)}
                    className="font-semibold text-red-500 hover:underline"
                  >
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Бараа алга байна.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
