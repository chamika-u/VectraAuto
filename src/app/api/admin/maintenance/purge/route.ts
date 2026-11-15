import { NextResponse } from "next/server";
import { getStore } from "@/server/storage/json-store";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  return withRouteHandler("admin.maintenance.purge", async () => {
    const store = getStore();
    const result = await store.purgeNow();

    return jsonResponse(
      {
        success: true,
        removedOrders: result.removedOrders,
        removedIdempotency: result.removedIdempotency,
        timestamp: new Date().toISOString(),
      },
      200,
    );
  });
}
