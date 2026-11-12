"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { CART_STORAGE_KEY } from "@/lib/constants";
import { cartReducer, createInitialCartState } from "@/lib/cart/cart-reducer";
import { cartSubtotalCents } from "@/lib/cart/cart-rules";
import type { CartAction, CartItem, CartState } from "@/lib/cart/types";

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  subtotalCents: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.unitPriceCents === "number" &&
    typeof item.quantity === "number" &&
    typeof item.availableStock === "number" &&
    typeof item.imagePath === "string"
  );
}

function readStoredCart(): { items: CartItem[]; updatedAt: string; storageAvailable: boolean } {
  if (typeof window === "undefined") {
    return { items: [], updatedAt: new Date().toISOString(), storageAvailable: true };
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [], updatedAt: new Date().toISOString(), storageAvailable: true };
    const parsed = JSON.parse(raw) as { items?: unknown; updatedAt?: unknown };
    const items = Array.isArray(parsed.items) ? parsed.items.filter(isCartItem) : [];
    return {
      items,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      storageAvailable: true,
    };
  } catch {
    return { items: [], updatedAt: new Date().toISOString(), storageAvailable: false };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, createInitialCartState);

  useEffect(() => {
    const stored = readStoredCart();
    dispatch({ type: "hydrate", payload: stored });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items: state.items, updatedAt: state.updatedAt }),
      );
    } catch {
      dispatch({ type: "markStorageUnavailable" });
    }
  }, [state.hydrated, state.items, state.updatedAt]);

  const addItem = useCallback((item: CartItem) => dispatch({ type: "add", payload: { item } }), []);
  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "setQuantity", payload: { productId, quantity } }),
    [],
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "remove", payload: { productId } }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    return {
      state,
      dispatch,
      itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
      subtotalCents: cartSubtotalCents(state.items),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [state, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider.");
  return value;
}
