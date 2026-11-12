import type { Compatibility } from "../contracts/catalog";
import type { CartWarning } from "../contracts/cart";

export type CartItem = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  unitPriceCents: number;
  imagePath: string;
  imageAlt: string;
  availableStock: number;
  quantity: number;
  compatibility: Compatibility | null;
};

export type CartPersistedState = {
  items: CartItem[];
  updatedAt: string;
};

export type CartValidationState = {
  warnings: CartWarning[];
  canCheckout: boolean;
  checkedAt: string;
};

export type CartState = CartPersistedState & {
  hydrated: boolean;
  storageAvailable: boolean;
  validation: CartValidationState | null;
};

export type CartAction =
  | { type: "hydrate"; payload: { items: CartItem[]; updatedAt: string; storageAvailable: boolean } }
  | { type: "add"; payload: { item: CartItem } }
  | { type: "setQuantity"; payload: { productId: string; quantity: number } }
  | { type: "remove"; payload: { productId: string } }
  | { type: "clear" }
  | { type: "applyValidation"; payload: CartValidationState & { items: CartItem[] } }
  | { type: "markStorageUnavailable" };

export const emptyCartState: CartState = {
  items: [],
  updatedAt: new Date(0).toISOString(),
  hydrated: false,
  storageAvailable: true,
  validation: null,
};
