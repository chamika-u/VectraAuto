import { NextResponse } from "next/server";
import { logEvent } from "@/server/logging/logger";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export function jsonResponse<T>(
  body: T,
  status = 200,
  headers: Record<string, string> = {},
): NextResponse<T> {
  return NextResponse.json(body, {
    status,
    headers: { ...noStoreHeaders, ...headers },
  });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
): NextResponse {
  return jsonResponse(
    {
      error: {
        code,
        message,
        ...extra,
      },
    },
    status,
  );
}

export function validationError(fields: Record<string, string>, message = "Please correct the highlighted fields."): NextResponse {
  return errorResponse(400, "VALIDATION_ERROR", message, { fields });
}

export function zodFieldErrors(issues: { path: (string | number)[]; message: string }[]): Record<string, string> {
  return Object.fromEntries(
    issues.map((issue) => [issue.path.join(".") || "form", issue.message]),
  );
}

export async function withRouteHandler<T>(
  event: string,
  handler: () => Promise<NextResponse<T>>,
): Promise<NextResponse<T> | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    logEvent("error", `${event}.failed`, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse(
      500,
      "STORE_UNAVAILABLE",
      "The store could not complete the request right now. Please try again.",
    );
  }
}
