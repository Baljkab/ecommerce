import { handleOrderPost } from "@/lib/server/order-api";

export async function POST(request: Request) {
  return handleOrderPost(request);
}
