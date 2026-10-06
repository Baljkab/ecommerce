import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminOrder } from "./admin-orders";

export const USER_ORDERS_PAGE_SIZE = 10;

export async function getUserOrders(
  client: SupabaseClient,
  userId: string,
  page = 0,
) {
  if (!userId) throw new Error("Захиалгаа харахын тулд нэвтэрнэ үү.");
  const { data, count, error } = await client
    .from("orders")
    .select(
      "id, created_at, total_price, delivery_status, province, district, khoroo, address_detail, phone_number, email, order_items(product_id, product_name, unit_price, quantity)",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(
      page * USER_ORDERS_PAGE_SIZE,
      (page + 1) * USER_ORDERS_PAGE_SIZE - 1,
    );
  if (error)
    throw new Error("Захиалгын түүхийг татаж чадсангүй. Дахин оролдоно уу.");
  return { orders: (data ?? []) as AdminOrder[], count: count ?? 0 };
}
