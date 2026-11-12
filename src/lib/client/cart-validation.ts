import type { CartValidationRequest, CartValidationResponse } from "@/lib/contracts/cart";

export async function requestCartValidation(
  input: CartValidationRequest,
  signal?: AbortSignal,
): Promise<CartValidationResponse> {
  const response = await fetch("/api/cart/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .then((body: { error?: { message?: string } }) => body.error?.message)
      .catch(() => null);
    throw new Error(message ?? "The cart could not be validated.");
  }

  return (await response.json()) as CartValidationResponse;
}
