import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/server/storage/json-store";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRouteHandler("admin.maintenance.seed", async () => {
    let reset = false;
    try {
      const body = await request.json();
      reset = Boolean(body.reset);
    } catch {
      // default reset=false
    }

    const store = getStore();
    const snapshot = await store.initialize({ reset });

    return jsonResponse(
      {
        success: true,
        event: reset ? "seed.reset" : "seed.initialized",
        categoriesCount: snapshot.catalog.categories.length,
        productsCount: snapshot.catalog.products.length,
        vehiclesCount: snapshot.catalog.vehicles.length,
        fitmentApplicationsCount: snapshot.catalog.fitmentApplications.length,
        timestamp: new Date().toISOString(),
      },
      200,
    );
  });
}
