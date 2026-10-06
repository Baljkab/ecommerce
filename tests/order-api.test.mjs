import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import { handleOrderPost, parseOrderInput } from "../lib/server/order-api.ts";

const input = {
  requestId: "12345678-1234-4234-8234-123456789012",
  address: {
    province: "Улаанбаатар",
    district: "Баянзүрх",
    khoroo: "1",
    addressDetail: "Байр 1",
    phoneNumber: "99112233",
    email: "test@example.com",
  },
  items: [{ product_id: 1, quantity: 2 }],
};
function request(body = input, token = "test-token") {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}
function factory(authStatus = 200, rpcStatus = 200) {
  const calls = [];
  const create = (token) =>
    createClient("https://test.supabase.co", "test-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { Authorization: `Bearer ${token}` },
        fetch: async (url, init) => {
          const auth = String(url).includes("/auth/v1/user");
          calls.push({
            url: String(url),
            body: init?.body ? JSON.parse(init.body) : null,
          });
          const status = auth ? authStatus : rpcStatus;
          const body =
            status >= 400
              ? {
                  code: auth ? "bad_jwt" : "P0001",
                  message: "Үлдэгдэл хүрэлцэхгүй байна.",
                }
              : auth
                ? {
                    id: "user-a",
                    aud: "authenticated",
                    email: "test@example.com",
                  }
                : "order-1";
          return new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
          });
        },
      },
    });
  return { create, calls };
}

test("missing authentication is rejected without accessing the database", async () => {
  const { create, calls } = factory();
  assert.equal((await handleOrderPost(request(input, ""), create)).status, 401);
  assert.equal(calls.length, 0);
});
test("invalid authentication cannot invoke the order function", async () => {
  const { create, calls } = factory(401);
  assert.equal((await handleOrderPost(request(), create)).status, 401);
  assert.equal(calls.length, 1);
});
test("invalid quantities fail before a write", async () => {
  const { create, calls } = factory();
  assert.equal(
    (
      await handleOrderPost(
        request({ ...input, items: [{ product_id: 1, quantity: -2 }] }),
        create,
      )
    ).status,
    400,
  );
  assert.equal(calls.length, 1);
});
test("server strips forged prices and user IDs and forwards idempotency key", async () => {
  const { create, calls } = factory();
  const response = await handleOrderPost(
    request({
      ...input,
      userId: "victim",
      total_price: 1,
      items: [{ product_id: 1, quantity: 2, price: 1 }],
    }),
    create,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { orderId: "order-1" });
  assert.deepEqual(calls[1].body, {
    p_request_id: input.requestId,
    p_address: input.address,
    p_items: input.items,
  });
  assert.match(calls[1].url, /submit_order_once/);
});
test("stock conflicts return a user-visible conflict response", async () => {
  const { create } = factory(200, 400);
  const response = await handleOrderPost(request(), create);
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /Үлдэгдэл/);
});
test("normalization merges duplicates and sorts product IDs", () => {
  const result = parseOrderInput({
    ...input,
    items: [
      { product_id: 2, quantity: 1 },
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 3 },
    ],
  });
  assert.deepEqual(result.items, [
    { product_id: 1, quantity: 2 },
    { product_id: 2, quantity: 4 },
  ]);
  assert.throws(() => parseOrderInput({ ...input, address: {} }), /Хүргэлтийн/);
});
