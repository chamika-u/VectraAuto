import { NextRequest, NextResponse } from "next/server";
import { getAdminOrder, updateOrderStatus, type AdminOrderStatus } from "@/server/admin/service";
import { withRouteHandler, jsonResponse, errorResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ reference: string }> },
): Promise<NextResponse> {
  const { reference } = await context.params;
  return withRouteHandler("admin.orders.get", async () => {
    const order = await getAdminOrder(reference);
    if (!order) {
      return errorResponse(404, "NOT_FOUND", `Order ${reference} was not found.`);
    }
    return jsonResponse({ order }, 200);
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reference: string }> },
): Promise<NextResponse> {
  const { reference } = await context.params;
  return withRouteHandler("admin.orders.update", async () => {
    let body: { status?: string };
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "BAD_REQUEST", "Invalid JSON payload.");
    }

    const validStatuses: AdminOrderStatus[] = [
      "confirmed",
      "processing",
      "dispatched",
      "delivered",
      "cancelled",
    ];

    if (!body.status || !validStatuses.includes(body.status as AdminOrderStatus)) {
      return errorResponse(
        400,
        "INVALID_STATUS",
        `Status must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const updated = await updateOrderStatus(reference, body.status as AdminOrderStatus);
    if (!updated) {
      return errorResponse(404, "NOT_FOUND", `Order ${reference} was not found.`);
    }

    return jsonResponse({ order: updated }, 200);
  });
}
