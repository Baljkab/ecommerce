import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import {
  changeDatabaseQuantity,
  getCartErrorMessage,
  readDatabaseCart,
  removeDatabaseCartItems,
  readGuestCart,
  saveGuestCart,
} from "../lib/cart.ts";

// Exercise the real Supabase query builder while replacing only HTTP transport.
function fixture(responses) {
  const requests = [];
  const client = createClient("https://cart-test.supabase.co", "test-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (input, init) => {
        requests.push({
          url: new URL(String(input)),
          method: init?.method,
          body: init?.body ? JSON.parse(init.body) : undefined,
        });
        const response = responses.shift();
        assert.ok(response, "Unexpected database request");
        return new Response(JSON.stringify(response.data ?? null), {
          status: response.status ?? 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  });
  return { client, requests };
}

function assertOwner(request, id = "user-a") {
  assert.equal(request.url.pathname, "/rest/v1/cart_items");
  assert.equal(request.url.searchParams.get("user_id"), `eq.${id}`);
}

test("loads current product details and only the requested user's cart", async () => {
  const { client, requests } = fixture([
    {
      data: [
        {
          quantity: 2,
          product: {
            id: 7,
            name: "Хулгана",
            price: 100000,
            image_url: "/mouse.png",
            stock: 8,
          },
        },
      ],
    },
  ]);
  assert.deepEqual(await readDatabaseCart(client, "user-a"), [
    {
      id: 7,
      name: "Хулгана",
      price: 100000,
      imageUrl: "/mouse.png",
      stock: 8,
      quantity: 2,
    },
  ]);
  assertOwner(requests[0]);
});

test("inserts product ID and quantity for the authenticated owner", async () => {
  const { client, requests } = fixture([{ data: [] }, { status: 201 }]);
  await changeDatabaseQuantity(client, "user-a", 7, 3, true);
  assertOwner(requests[0]);
  assert.equal(requests[1].method, "POST");
  const { id, ...body } = requests[1].body;
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.deepEqual(body, { user_id: "user-a", product_id: 7, quantity: 3 });
});

test("adding an existing product increments rather than replaces its quantity", async () => {
  const { client, requests } = fixture([
    { data: [{ quantity: 2 }] },
    { data: [{ id: "row" }] },
  ]);
  await changeDatabaseQuantity(client, "user-a", 7, 3, true);
  assert.equal(requests[1].method, "PATCH");
  assert.deepEqual(requests[1].body, { quantity: 5 });
  assertOwner(requests[1]);
  assert.equal(requests[1].url.searchParams.get("product_id"), "eq.7");
  assert.equal(requests[1].url.searchParams.get("quantity"), "eq.2");
});

test("retries concurrent insertion without creating duplicate rows", async () => {
  const { client, requests } = fixture([
    { data: [] },
    { status: 409, data: { code: "23505", message: "unique violation" } },
    { data: [{ quantity: 4 }] },
    { data: [{ id: "row" }] },
  ]);
  await changeDatabaseQuantity(client, "user-a", 7, 2, true);
  assert.deepEqual(requests[3].body, { quantity: 6 });
});

test("re-reads on concurrent quantity change instead of overwriting it", async () => {
  const { client, requests } = fixture([
    { data: [{ quantity: 2 }] },
    { data: [] },
    { data: [{ quantity: 5 }] },
    { data: [{ id: "row" }] },
  ]);
  await changeDatabaseQuantity(client, "user-a", 7, 1);
  assert.deepEqual(requests[3].body, { quantity: 6 });
  assert.equal(requests[3].url.searchParams.get("quantity"), "eq.5");
});

test("decrementing one never writes a zero quantity", async () => {
  const { client, requests } = fixture([{ data: [{ quantity: 1 }] }]);
  await changeDatabaseQuantity(client, "user-a", 7, -1);
  assert.equal(requests.length, 1);
});

test("does not recreate an item removed in another tab when changing quantity", async () => {
  const { client, requests } = fixture([{ data: [] }]);
  await changeDatabaseQuantity(client, "user-a", 7, 1);
  assert.equal(requests.length, 1);
});

test("surfaces RLS write failures instead of reporting success", async () => {
  const { client } = fixture([
    { data: [] },
    {
      status: 403,
      data: { code: "42501", message: "private database details" },
    },
  ]);
  await assert.rejects(changeDatabaseQuantity(client, "user-a", 7, 1, true), {
    code: "42501",
  });
  assert.match(getCartErrorMessage({ code: "42501" }), /эрх/);
  assert.doesNotMatch(getCartErrorMessage(new Error("secret")), /secret/);
});

test("deletes only the specified user's product and verifies removal", async () => {
  const { client, requests } = fixture([{ data: [] }, { data: [] }]);
  await removeDatabaseCartItems(client, "user-a", 7);
  for (const request of requests) {
    assertOwner(request);
    assert.equal(request.url.searchParams.get("product_id"), "eq.7");
  }
  assert.equal(requests[0].method, "DELETE");
});

test("clear cart never issues an unfiltered delete", async () => {
  const { client, requests } = fixture([{ data: [] }, { data: [] }]);
  await removeDatabaseCartItems(client, "user-b");
  for (const request of requests) assertOwner(request, "user-b");
  assert.equal(requests[0].url.searchParams.has("product_id"), false);
});

test("detects a DELETE silently blocked by RLS", async () => {
  const { client } = fixture([
    { data: [] },
    { data: [{ id: "still-present" }] },
  ]);
  await assert.rejects(removeDatabaseCartItems(client, "user-a", 7));
});

test("guest storage keeps valid items and rejects malformed JSON", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  let stored = "[]";
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: () => stored,
        setItem: (_key, value) => {
          stored = value;
        },
      },
    },
  });
  try {
    const item = {
      id: 7,
      name: "Хулгана",
      price: 100,
      imageUrl: "/mouse.png",
      stock: 4,
      quantity: 2,
    };
    saveGuestCart([item]);
    assert.deepEqual(readGuestCart(), [item]);
    stored = JSON.stringify([item, { ...item, quantity: -1 }, null]);
    assert.deepEqual(readGuestCart(), [item]);
    stored = "invalid json";
    assert.throws(() => readGuestCart());
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
