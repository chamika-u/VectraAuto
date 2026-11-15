import { NextResponse } from "next/server";
import { getAdminOverview } from "@/server/admin/service";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return withRouteHandler("admin.overview", async () => {
    const overview = await getAdminOverview();
    return jsonResponse(overview, 200);
  });
}
