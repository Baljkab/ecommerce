import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import { getAdminOrders, updateDeliveryStatus } from "../lib/admin-orders.ts";

function fixture(data, status = 200, headers = {}) {
  const requests = [];
  const client = createClient("https://orders-test.supabase.co", "test-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (input, init) => {
        requests.push({
          url: new URL(String(input)),
          body: init?.body ? JSON.parse(init.body) : undefined,
        });
        return new Response(data === null ? null : JSON.stringify(data), {
          status,
          headers: { "Content-Type": "application/json", ...headers },
        });
      },
    },
  });
  return { client, requests };
}

test("filters and paginates orders on the server with exact counts", async () => {
  const { client, requests } = fixture([], 200, {
    "Content-Range": "20-39/43",
  });
  const result = await getAdminOrders(client, 1, "shipping");
  assert.equal(result.count, 43);
  const query = requests[0].url.searchParams;
  assert.deepEqual(query.getAll("delivery_status"), [
    "in.(pending,shipping)",
    "eq.shipping",
  ]);
  assert.equal(query.get("offset"), "20");
  assert.equal(query.get("limit"), "20");
  assert.equal(query.get("order"), "created_at.desc,id.desc");
});

test("active orders exclude delivered orders before pagination", async () => {
  const { client, requests } = fixture([]);
  await getAdminOrders(client, 0, "all");
  assert.equal(
    requests[0].url.searchParams.get("delivery_status"),
    "in.(pending,shipping)",
  );
});

test("history only requests delivered orders even with a previous active filter", async () => {
  const { client, requests } = fixture([], 200, { "Content-Range": "*/0" });
  const result = await getAdminOrders(client, 0, "shipping", "history");
  assert.deepEqual(requests[0].url.searchParams.getAll("delivery_status"), [
    "eq.delivered",
  ]);
  assert.equal(result.count, 0);
});

test("status mutation includes previous status to detect concurrent changes", async () => {
  const { client, requests } = fixture(null, 204);
  await updateDeliveryStatus(client, "order-1", "pending", "shipping");
  assert.equal(
    requests[0].url.pathname,
    "/rest/v1/rpc/admin_update_delivery_status",
  );
  assert.deepEqual(requests[0].body, {
    p_order_id: "order-1",
    p_previous_status: "pending",
    p_next_status: "shipping",
  });
});

test("stale status cannot be reported as a successful save", async () => {
  const { client } = fixture({ code: "P0002", message: "conflict" }, 400);
  await assert.rejects(
    updateDeliveryStatus(client, "order-1", "pending", "delivered"),
    /Жагсаалтыг шинэчлээд/,
  );
});

test("permission failures and invalid statuses fail safely", async () => {
  const { client, requests } = fixture(
    { code: "42501", message: "denied" },
    403,
  );
  await assert.rejects(
    updateDeliveryStatus(client, "order-1", "pending", "invalid"),
    /төлөв буруу/,
  );
  assert.equal(requests.length, 0);
  await assert.rejects(
    updateDeliveryStatus(client, "order-1", "pending", "shipping"),
    /Төлөв хадгалагдсангүй/,
  );
  await assert.rejects(
    getAdminOrders(client, 0, "all"),
    /Захиалга татахад алдаа/,
  );
});
