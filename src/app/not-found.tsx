import { EmptyState } from "@/components/catalog/empty-state";

export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState
        title="That page could not be found"
        message="The part or page may have moved, or the link may be outdated. Continue browsing the catalog to find what you need."
        actionLabel="Browse all parts"
        actionHref="/products"
        secondaryLabel="Go home"
        secondaryHref="/"
      />
    </div>
  );
}
