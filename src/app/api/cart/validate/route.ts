import { NextResponse } from "next/server";
import { cartValidationRequestSchema } from "@/lib/contracts/cart";
import { validateCart } from "@/server/cart/validate-cart";
import {
  errorResponse,
  jsonResponse,
  validationError,
  withRouteHandler,
  zodFieldErrors,
} from "@/server/http/handlers";
import { getStore } from "@/server/storage/json-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  return withRouteHandler("cart.validate", async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
    }

    const parsed = cartValidationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(zodFieldErrors(parsed.error.issues), "Some cart items are invalid.");
    }

    const result = await validateCart(getStore(), parsed.data);
    return jsonResponse(result);
  });
}
