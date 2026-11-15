import { NextRequest, NextResponse } from "next/server";
import { getAdminOrders } from "@/server/admin/service";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRouteHandler("admin.orders.list", async () => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const status = searchParams.get("status") || undefined;
    const paymentMethod = searchParams.get("paymentMethod") || undefined;

    const orders = await getAdminOrders({ query, status, paymentMethod });
    return jsonResponse({ orders, total: orders.length }, 200);
  });
}
