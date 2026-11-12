import { EmptyState } from "@/components/catalog/empty-state";

export function CartEmpty() {
  return (
    <EmptyState
      title="Your cart is empty"
      message="Browse the catalog, choose a part, and add it to your cart to begin checkout."
      actionLabel="Browse parts"
      actionHref="/products"
    />
  );
}

