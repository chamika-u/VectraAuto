import { emptyCartState, type CartState, type CartAction } from "./types";
import { clampQuantity, hasCapacity } from "./cart-rules";

function nowIso(): string {
  return new Date().toISOString();
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        items: action.payload.items,
        updatedAt: action.payload.updatedAt,
        hydrated: true,
        storageAvailable: action.payload.storageAvailable,
      };
    case "add": {
      const incoming = action.payload.item;
      if (!hasCapacity(state.items, incoming.productId)) return state;
      const quantity = clampQuantity(incoming.quantity, incoming.availableStock);
      if (quantity < 1) return state;
      const existing = state.items.find((item) => item.productId === incoming.productId);
      if (existing) {
        const nextQuantity = clampQuantity(existing.quantity + quantity, incoming.availableStock);
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === incoming.productId
              ? { ...incoming, quantity: nextQuantity, compatibility: item.compatibility }
              : item,
          ),
          updatedAt: nowIso(),
          validation: null,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...incoming, quantity }],
        updatedAt: nowIso(),
        validation: null,
      };
    }
    case "setQuantity": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: clampQuantity(action.payload.quantity, item.availableStock) }
            : item,
        ),
        updatedAt: nowIso(),
        validation: null,
      };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload.productId),
        updatedAt: nowIso(),
        validation: null,
      };
    case "clear":
      return { ...state, items: [], updatedAt: nowIso(), validation: null };
    case "applyValidation":
      return {
        ...state,
        items: action.payload.items,
        validation: {
          warnings: action.payload.warnings,
          canCheckout: action.payload.canCheckout,
          checkedAt: action.payload.checkedAt,
        },
      };
    case "markStorageUnavailable":
      return { ...state, storageAvailable: false };
    default:
      return state;
  }
}

export function createInitialCartState(): CartState {
  return { ...emptyCartState, updatedAt: new Date().toISOString() };
}
