import { ProductCard } from "@/components/catalog/product-card";
import type { ProductCard as ProductCardData } from "@/lib/contracts/catalog";

export function ProductGrid({
  products,
  hrefForProduct,
}: {
  products: ProductCardData[];
  hrefForProduct?: (product: ProductCardData) => string;
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          href={hrefForProduct?.(product)}
        />
      ))}
    </div>
  );
}
