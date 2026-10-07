import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItemData } from "@/types/product";

export type ShippingAddress = {
  province: string; // хот/аймаг
  district: string; // дүүрэг/сум
  khoroo: string; // хороо
  addressDetail: string; // дэлгэрэнгүй хаяг
  phoneNumber: number;
  email: string;
};

export type OrderSummary = {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

// Сагсны барааг "хадгалсан" (snapshot) үнэ/нэртэйгээр захиалга болгон үүсгэнэ.
export async function createOrder(
  client: SupabaseClient,
  userId: string,
  address: ShippingAddress,
  items: CartItemData[],
): Promise<string> {
  if (!userId) {
    throw new Error("Захиалга өгөхийн тулд нэвтэрнэ үү.");
  }

  if (items.length === 0) {
    throw new Error("Сагс хоосон байна.");
  }

  if (
    items.some(
      (item) => !Number.isSafeInteger(item.quantity) || item.quantity <= 0,
    )
  ) {
    throw new Error("Барааны тоо ширхэг буруу байна.");
  }

  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session || session.user.id !== userId) {
    throw new Error("Захиалга өгөхийн тулд дахин нэвтэрнэ үү.");
  }

  const payload = {
    address,
    items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  };
  const signature = JSON.stringify(payload);
  const storageKey = `pending-order:${userId}`;
  let requestId = crypto.randomUUID();
  // Keep the same request ID after an uncertain network response or page reload.
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
    if (saved?.signature === signature && typeof saved.requestId === "string") {
      requestId = saved.requestId;
    }
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ signature, requestId }),
    );
  } catch {
    throw new Error(
      "Захиалгыг найдвартай хадгалахын тулд браузерийн sessionStorage боломжтой байх шаардлагатай.",
    );
  }

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ...payload, requestId }),
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.";
    throw new Error(message);
  }
  if (
    !result ||
    typeof result !== "object" ||
    !("orderId" in result) ||
    typeof result.orderId !== "string"
  ) {
    throw new Error("Захиалгын дугаар буцаж ирсэнгүй.");
  }
  // Storage cleanup failure must not turn a successful order into a retry.
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    /* Keep the saved ID. */
  }
  return result.orderId;
}
