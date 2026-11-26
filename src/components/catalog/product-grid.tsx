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
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          href={hrefForProduct?.(product)}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
