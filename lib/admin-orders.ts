import type { SupabaseClient } from "@supabase/supabase-js";

export const deliveryStatuses = {
  pending: "Хүлээгдэж буй",
  shipping: "Хүргэгдэж буй",
  delivered: "Хүргэгдсэн",
} as const;

export type DeliveryStatus = keyof typeof deliveryStatuses;

export function isDeliveryStatus(value: string): value is DeliveryStatus {
  return Object.hasOwn(deliveryStatuses, value);
}

export type AdminOrder = {
  id: string;
  created_at: string;
  total_price: number;
  delivery_status: DeliveryStatus;
  province: string | null;
  district: string | null;
  khoroo: string | null;
  address_detail: string | null;
  phone_number: string | null;
  email: string | null;
  order_items: {
    product_id: number | null;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[];
};

export const ORDERS_PAGE_SIZE = 20;

export async function getAdminOrders(
  client: SupabaseClient,
  page: number,
  status: DeliveryStatus | "all",
  view: "active" | "history" = "active",
) {
  let query = client
    .from("orders")
    .select(
      "id, created_at, total_price, delivery_status, province, district, khoroo, address_detail, phone_number, email, order_items(product_id, product_name, unit_price, quantity)",
      { count: "exact" },
    );
  if (view === "history") {
    query = query.eq("delivery_status", "delivered");
  } else {
    query = query.in("delivery_status", ["pending", "shipping"]);

    if (status !== "all") {
      query = query.eq("delivery_status", status);
    }
  }
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * ORDERS_PAGE_SIZE, (page + 1) * ORDERS_PAGE_SIZE - 1);
  if (error) {
    throw new Error(
      "Захиалга татахад алдаа гарлаа. Админ эрх болон захиалгын SQL тохиргоог шалгаад дахин оролдоно уу.",
    );
  }
  return { orders: (data ?? []) as AdminOrder[], count: count ?? 0 };
}

export async function updateDeliveryStatus(
  client: SupabaseClient,
  orderId: string,
  previousStatus: DeliveryStatus,
  nextStatus: DeliveryStatus,
) {
  if (!isDeliveryStatus(nextStatus))
    throw new Error("Хүргэлтийн төлөв буруу байна.");
  const { error } = await client.rpc("admin_update_delivery_status", {
    p_order_id: orderId,
    p_previous_status: previousStatus,
    p_next_status: nextStatus,
  });
  if (error) {
    if (error.code === "P0002") {
      throw new Error(
        "Захиалга өөрчлөгдсөн эсвэл олдсонгүй. Жагсаалтыг шинэчлээд дахин оролдоно уу.",
      );
    }
    throw new Error(
      "Төлөв хадгалагдсангүй. Админ эрх болон холболтоо шалгаад дахин оролдоно уу.",
    );
  }
}
