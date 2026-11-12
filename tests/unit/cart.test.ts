import { describe, expect, it } from "vitest";
import { cartReducer, createInitialCartState } from "@/lib/cart/cart-reducer";
import { clampQuantity, cartSubtotalCents, canAddToCart } from "@/lib/cart/cart-rules";
import type { CartItem } from "@/lib/cart/types";

describe("cart rules and reducer", () => {
  const item1: CartItem = {
    productId: "prod_1",
    slug: "front-pads",
    sku: "VA-BRK-001",
    name: "Front Pads",
    unitPriceCents: 1250000,
    imagePath: "/pad.svg",
    imageAlt: "Front pads",
    availableStock: 5,
    quantity: 1,
    compatibility: "compatible",
  };

  it("clamps quantity between 1 and available stock", () => {
    expect(clampQuantity(0, 5)).toBe(1);
    expect(clampQuantity(3, 5)).toBe(3);
    expect(clampQuantity(10, 5)).toBe(5);
    expect(clampQuantity(-2, 5)).toBe(1);
  });

  it("determines if item can be added to cart", () => {
    expect(canAddToCart(5)).toBe(true);
    expect(canAddToCart(0)).toBe(false);
  });

  it("calculates cart subtotal correctly", () => {
    const items: CartItem[] = [
      { ...item1, quantity: 2, unitPriceCents: 100000 },
      { ...item1, productId: "prod_2", quantity: 1, unitPriceCents: 50000 },
    ];
    expect(cartSubtotalCents(items)).toBe(250000);
  });

  it("adds an item to empty cart", () => {
    const state = createInitialCartState();
    const next = cartReducer(state, { type: "add", payload: { item: item1 } });
    expect(next.items).toHaveLength(1);
    expect(next.items[0].quantity).toBe(1);
  });

  it("increments quantity when existing item is added again", () => {
    const state = { ...createInitialCartState(), items: [{ ...item1, quantity: 2 }] };
    const next = cartReducer(state, { type: "add", payload: { item: { ...item1, quantity: 1 } } });
    expect(next.items[0].quantity).toBe(3);
  });

  it("updates item quantity with clamp to stock", () => {
    const state = { ...createInitialCartState(), items: [{ ...item1, quantity: 2 }] };
    const next = cartReducer(state, {
      type: "setQuantity",
      payload: { productId: "prod_1", quantity: 10 },
    });
    expect(next.items[0].quantity).toBe(5); // stock is 5
  });

  it("removes an item from cart", () => {
    const state = { ...createInitialCartState(), items: [item1] };
    const next = cartReducer(state, { type: "remove", payload: { productId: "prod_1" } });
    expect(next.items).toHaveLength(0);
  });

  it("clears cart items", () => {
    const state = { ...createInitialCartState(), items: [item1] };
    const next = cartReducer(state, { type: "clear" });
    expect(next.items).toHaveLength(0);
  });
});
