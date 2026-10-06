import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type OrderInput = {
  requestId: string;
  address: Record<string, string>;
  items: { product_id: number; quantity: number }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseOrderInput(value: unknown): OrderInput {
  if (
    !isRecord(value) ||
    typeof value.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value.requestId,
    )
  ) {
    throw new Error("Захиалгын хүсэлтийн дугаар буруу байна.");
  }
  if (!isRecord(value.address))
    throw new Error("Хүргэлтийн мэдээллээ бөглөнө үү.");
  const address: Record<string, string> = {};
  for (const field of [
    "province",
    "district",
    "khoroo",
    "addressDetail",
    "phoneNumber",
    "email",
  ]) {
    const entry = value.address[field];
    if (typeof entry !== "string" || !entry.trim() || entry.length > 1000)
      throw new Error("Хүргэлтийн мэдээлэл дутуу эсвэл хэт урт байна.");
    address[field] = entry.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email))
    throw new Error("Имэйл хаягаа зөв оруулна уу.");
  if (
    !Array.isArray(value.items) ||
    value.items.length === 0 ||
    value.items.length > 100
  )
    throw new Error("Сагсанд 1–100 төрлийн бараа байх ёстой.");
  const quantities = new Map<number, number>();
  for (const item of value.items) {
    if (
      !isRecord(item) ||
      typeof item.product_id !== "number" ||
      !Number.isSafeInteger(item.product_id) ||
      item.product_id <= 0 ||
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > 10000
    )
      throw new Error("Барааны дугаар эсвэл тоо ширхэг буруу байна.");
    const quantity = (quantities.get(item.product_id) ?? 0) + item.quantity;
    if (quantity > 10000) throw new Error("Барааны тоо ширхэг хэт их байна.");
    quantities.set(item.product_id, quantity);
  }
  return {
    requestId: value.requestId,
    address,
    items: [...quantities]
      .sort(([a], [b]) => a - b)
      .map(([product_id, quantity]) => ({ product_id, quantity })),
  };
}

export function createOrderServerClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Серверийн тохиргоо дутуу байна.");
  // Every request gets its own user-scoped client. Never use a service-role key.
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function handleOrderPost(
  request: Request,
  createClientForToken: (
    token: string,
  ) => SupabaseClient = createOrderServerClient,
): Promise<Response> {
  const respond = (body: object, status: number) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token)
    return respond({ error: "Захиалга өгөхийн тулд нэвтэрнэ үү." }, 401);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return respond({ error: "JSON хүсэлт шаардлагатай." }, 415);
  try {
    const client = createClientForToken(token);
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser(token);
    if (authError || !user)
      return respond(
        { error: "Нэвтрэх эрх дууссан байна. Дахин нэвтэрнэ үү." },
        401,
      );
    let input: OrderInput;
    try {
      const body = await request.text();
      if (body.length > 32000)
        return respond({ error: "Хүсэлтийн хэмжээ хэт их байна." }, 413);
      input = parseOrderInput(JSON.parse(body));
    } catch (error) {
      return respond(
        {
          error:
            error instanceof SyntaxError
              ? "Хүсэлтийн бүтэц буруу байна."
              : error instanceof Error
                ? error.message
                : "Хүсэлт буруу байна.",
        },
        400,
      );
    }
    const { data, error } = await client.rpc("submit_order_once", {
      p_request_id: input.requestId,
      p_address: input.address,
      p_items: input.items,
    });
    if (error) {
      if (error.code === "P0001") return respond({ error: error.message }, 409);
      return respond(
        {
          error:
            "Захиалга хадгалагдсангүй. Серверийн холболт болон SQL тохиргоог шалгана уу.",
        },
        500,
      );
    }
    if (typeof data !== "string" || !data)
      return respond({ error: "Захиалгын дугаар буцаж ирсэнгүй." }, 500);
    return respond({ orderId: data }, 200);
  } catch {
    return respond(
      { error: "Сервертэй холбогдож чадсангүй. Дахин оролдоно уу." },
      503,
    );
  }
}
