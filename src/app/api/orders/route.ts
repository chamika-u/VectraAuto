import { NextResponse } from "next/server";
import { idempotencyKeySchema, orderRequestSchema } from "@/lib/contracts/orders";
import { placeOrder } from "@/server/orders/place-order";
import {
  errorResponse,
  jsonResponse,
  validationError,
  withRouteHandler,
  zodFieldErrors,
} from "@/server/http/handlers";
import { logEvent } from "@/server/logging/logger";
import { getStore } from "@/server/storage/json-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  return withRouteHandler("orders.place", async () => {
    const idempotencyHeader = request.headers.get("Idempotency-Key");
    const keyResult = idempotencyKeySchema.safeParse(idempotencyHeader);
    if (!keyResult.success) {
      return validationError(
        { "Idempotency-Key": "A valid UUID v4 Idempotency-Key header is required." },
        "Please refresh checkout and try again.",
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
    }

    const parsed = orderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(zodFieldErrors(parsed.error.issues));
    }

    const result = await placeOrder(getStore(), keyResult.data, parsed.data);
    if (result.status === 400) {
      return validationError(result.fields);
    }
    if (result.status === 409) {
      return errorResponse(
        409,
        result.conflict.code,
        result.conflict.message,
        { items: result.conflict.items },
      );
    }

    logEvent("info", "orders.placed", {
      reference: result.order.reference,
      itemCount: result.order.items.length,
      totalCents: result.order.grandTotalCents,
      paymentMethod: result.order.payment.method,
    });
    return jsonResponse({ order: result.order }, result.status);
  });
}
