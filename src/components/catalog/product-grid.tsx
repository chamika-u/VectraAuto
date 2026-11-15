import { ProductCard } from "@/components/catalog/product-card";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import type { ProductCard as ProductCardData } from "@/lib/contracts/catalog";

export function ProductGrid({
  products,
  hrefForProduct,
}: {
  products: ProductCardData[];
  hrefForProduct?: (product: ProductCardData) => string;
}) {
  return (
    <Stagger className="product-grid">
      {products.map((product, index) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} href={hrefForProduct?.(product)} priority={index < 4} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
