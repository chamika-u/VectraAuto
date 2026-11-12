import { NextRequest, NextResponse } from "next/server";
import { updateProductDetails, updateProductStock } from "@/server/admin/service";
import { withRouteHandler, jsonResponse, errorResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return withRouteHandler("admin.products.update", async () => {
    let body: {
      priceCents?: number;
      stock?: number;
      status?: "active" | "inactive";
      isFeatured?: boolean;
      name?: string;
    };
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "BAD_REQUEST", "Invalid JSON payload.");
    }

    if (body.stock !== undefined && typeof body.stock === "number") {
      await updateProductStock(id, body.stock);
    }

    const updated = await updateProductDetails(id, body);
    if (!updated) {
      return errorResponse(404, "NOT_FOUND", `Product ${id} was not found.`);
    }

    return jsonResponse({ product: updated }, 200);
  });
}
