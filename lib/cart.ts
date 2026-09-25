import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItemData } from "@/types/product";

export const guestCartStorageKey = "cart-display-stock-v4";

type DatabaseCartRow = {
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  } | null;
};

export function readGuestCart(): CartItemData[] {
  const value: unknown = JSON.parse(
    window.localStorage.getItem(guestCartStorageKey) ?? "[]",
  );
  if (!Array.isArray(value))
    throw new Error("Түр сагсны мэдээллийг уншиж чадсангүй.");
  return value.filter((item): item is CartItemData => {
    if (!item || typeof item !== "object") return false;
    return (
      Number.isSafeInteger(item.id) &&
      typeof item.name === "string" &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      typeof item.imageUrl === "string" &&
      Number.isSafeInteger(item.quantity) &&
      item.quantity > 0 &&
      Number.isSafeInteger(item.stock) &&
      item.stock >= 0
    );
  });
}

export function saveGuestCart(items: CartItemData[]) {
  window.localStorage.setItem(guestCartStorageKey, JSON.stringify(items));
}

export function getCartErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    if (error.code === "42501") {
      return "Сагсыг хадгалах эрх хүрэлцэхгүй байна. Дахин нэвтэрч оролдоно уу.";
    }
    if (error.code === "23503") {
      return "Энэ бүтээгдэхүүн олдсонгүй. Хуудсаа шинэчлээд дахин оролдоно уу.";
    }
  }
  return "Сагсны мэдээллийг шинэчилж чадсангүй. Холболтоо шалгаад дахин оролдоно уу.";
}

export async function readDatabaseCart(
  client: SupabaseClient,
  userId: string,
): Promise<CartItemData[]> {
  const { data, error } = await client
    .from("cart_items")
    .select("quantity, product:products(id, name, price, image_url, stock)")
    .eq("user_id", userId)
    .order("id")
    .overrideTypes<DatabaseCartRow[], { merge: false }>();
  if (error) throw error;
  return (data ?? []).map(({ quantity, product }) => {
    if (!product) throw new Error("Сагсны бүтээгдэхүүнийг уншиж чадсангүй.");
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      stock: product.stock,
      quantity,
    };
  });
}

// The quantity comparison prevents concurrent tabs from overwriting each other.
export async function changeDatabaseQuantity(
  client: SupabaseClient,
  userId: string,
  productId: number,
  delta: number,
  createIfMissing = false,
) {
  if (
    !Number.isSafeInteger(delta) ||
    delta === 0 ||
    (createIfMissing && delta < 1)
  ) {
    throw new Error("Тоо ширхэг буруу байна.");
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data: current, error: readError } = await client
      .from("cart_items")
      .select("quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle()
      .overrideTypes<{ quantity: number }, { merge: false }>();
    if (readError) throw readError;

    if (!current) {
      if (!createIfMissing) return;
      const { error } = await client.from("cart_items").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        product_id: productId,
        quantity: delta,
      });
      if (error?.code === "23505") continue;
      if (error) throw error;
      return;
    }

    const quantity = Math.max(1, current.quantity + delta);
    if (quantity === current.quantity) return;
    const { data, error } = await client
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("quantity", current.quantity)
      .select("id");
    if (error) throw error;
    if (data?.length) return;
  }
  throw new Error("Сагсны тоо өөрчлөгдсөн байна. Дахин оролдоно уу.");
}

export async function removeDatabaseCartItems(
  client: SupabaseClient,
  userId: string,
  productId?: number,
) {
  const deletion = client.from("cart_items").delete().eq("user_id", userId);
  if (productId !== undefined) deletion.eq("product_id", productId);
  const { error } = await deletion;
  if (error) throw error;

  // RLS can filter out a DELETE without returning an error. Verify it took effect.
  const verification = client
    .from("cart_items")
    .select("id")
    .eq("user_id", userId);
  if (productId !== undefined) verification.eq("product_id", productId);
  const { data, error: readError } = await verification;
  if (readError) throw readError;
  if (data?.length) throw new Error("Сагснаас устгаж чадсангүй.");
}
