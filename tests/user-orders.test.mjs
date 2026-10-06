import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import { getUserOrders } from "../lib/user-orders.ts";

function fixture(status = 200) {
  const requests = [];
  const client = createClient("https://history-test.supabase.co", "test-key", {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (input) => {
        requests.push(new URL(String(input)));
        return new Response(
          JSON.stringify(status === 200 ? [] : { message: "denied" }),
          {
            status,
            headers: {
              "Content-Type": "application/json",
              "Content-Range": "*/0",
            },
          },
        );
      },
    },
  });
  return { client, requests };
}

test("history always scopes requests to the current owner and includes all delivery statuses", async () => {
  const { client, requests } = fixture();
  const result = await getUserOrders(client, "user-a", 1);
  const query = requests[0].searchParams;
  assert.equal(query.get("user_id"), "eq.user-a");
  assert.equal(query.has("delivery_status"), false);
  assert.equal(query.get("offset"), "10");
  assert.equal(query.get("limit"), "10");
  assert.equal(query.get("order"), "created_at.desc,id.desc");
  assert.deepEqual(result, { orders: [], count: 0 });
});

test("a missing user cannot trigger an unfiltered history request", async () => {
  const { client, requests } = fixture();
  await assert.rejects(getUserOrders(client, ""), /нэвтэрнэ/);
  assert.equal(requests.length, 0);
});

test("query failures are shown as errors rather than an empty history", async () => {
  const { client } = fixture(403);
  await assert.rejects(getUserOrders(client, "user-a"), /татаж чадсангүй/);
});
