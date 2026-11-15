import { NextRequest, NextResponse } from "next/server";
import { getAdminVehicles } from "@/server/admin/service";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRouteHandler("admin.vehicles.list", async () => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const vehicles = await getAdminVehicles(query);
    return jsonResponse({ vehicles, total: vehicles.length }, 200);
  });
}
