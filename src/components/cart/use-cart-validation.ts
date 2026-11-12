"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/cart/types";
import { requestCartValidation } from "@/lib/client/cart-validation";
import { useCart } from "@/components/cart/cart-provider";
import { useVehicleSelection } from "@/components/fitment/use-vehicle-selection";

function sameItems(a: CartItem[], b: CartItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => {
    const other = b[index];
    return (
      other &&
      item.productId === other.productId &&
      item.quantity === other.quantity &&
      item.unitPriceCents === other.unitPriceCents &&
      item.availableStock === other.availableStock &&
      item.compatibility === other.compatibility
    );
  });
}

export function useCartValidation() {
  const { state, dispatch } = useCart();
  const { vehicle } = useVehicleSelection();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.hydrated || state.items.length === 0) {
      setValidating(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setValidating(true);
      setError(null);
      try {
        const response = await requestCartValidation(
          {
            items: state.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              expectedUnitPriceCents: item.unitPriceCents,
            })),
            vehicleId: vehicle?.vehicleId ?? null,
          },
          controller.signal,
        );

        const updatedItems = state.items.map((item) => {
          const validated = response.items.find((entry) => entry.productId === item.productId);
          if (!validated) return item;
          return {
            ...item,
            slug: validated.slug || item.slug,
            sku: validated.sku || item.sku,
            name: validated.name || item.name,
            unitPriceCents: validated.unitPriceCents,
            availableStock: validated.availableStock,
            compatibility: validated.compatibility,
            imagePath: validated.imagePath || item.imagePath,
            imageAlt: validated.imageAlt || item.imageAlt,
          };
        });

        const itemsChanged = !sameItems(state.items, updatedItems);
        const validationChanged =
          !state.validation ||
          state.validation.canCheckout !== response.canCheckout ||
          JSON.stringify(state.validation.warnings) !== JSON.stringify(response.warnings);

        if (itemsChanged || validationChanged) {
          dispatch({
            type: "applyValidation",
            payload: {
              items: updatedItems,
              warnings: response.warnings,
              canCheckout: response.canCheckout,
              checkedAt: new Date().toISOString(),
            },
          });
        }
      } catch (caught) {
        if ((caught as Error).name !== "AbortError") {
          setError(caught instanceof Error ? caught.message : "The cart could not be validated.");
        }
      } finally {
        if (!controller.signal.aborted) setValidating(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [state.hydrated, state.items, state.validation, vehicle?.vehicleId, dispatch]);

  return { validating, error };
}
