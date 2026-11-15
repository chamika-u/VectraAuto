import { NextRequest, NextResponse } from "next/server";
import { getAdminProducts } from "@/server/admin/service";
import { withRouteHandler, jsonResponse } from "@/server/http/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRouteHandler("admin.products.list", async () => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const stockStatus = (searchParams.get("stockStatus") as "all" | "in_stock" | "low_stock" | "out_of_stock") || undefined;

    const products = await getAdminProducts({ query, categoryId, stockStatus });
    return jsonResponse({ products, total: products.length }, 200);
  });
}
