import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItemData } from "@/types/product";

export type ShippingAddress = {
  province: string;       // хот/аймаг
  district: string;       // дүүрэг/сум
  khoroo: string;         // хороо
  addressDetail: string;  // дэлгэрэнгүй хаяг
  phoneNumber: string;
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
      (item) =>
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0,
    )
  ) {
    throw new Error("Барааны тоо ширхэг буруу байна.");
  }

  const { data, error } = await client.rpc(
    "create_order_with_stock",
    {
      p_address: address,
      p_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    },
  );

  if (error) {
    throw new Error(
      error.code === "P0001"
        ? error.message
        : "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    );
  }

  if (typeof data !== "string" || !data) {
    throw new Error("Захиалгын дугаар буцаж ирсэнгүй.");
  }

  return data;
}