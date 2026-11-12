import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CompatibilityBadge } from "@/components/fitment/compatibility-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { ProductCard as ProductCardData } from "@/lib/contracts/catalog";

export function ProductCard({
  product,
  href,
}: {
  product: ProductCardData;
  href?: string;
}) {
  const productHref = href ?? `/products/${product.slug}`;
  return (
    <article className="product-card">
      <Link href={productHref} className="product-media" aria-label={`View ${product.name}`}>
        <Image
          src={product.imagePath}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 760px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge tone={product.availability === "available" ? "dark" : "danger"}>
            {product.availability === "available" ? "In stock" : "Out of stock"}
          </Badge>
        </span>
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <CompatibilityBadge compatibility={product.compatibility} compact />
        </div>
        <h3 className="product-name">
          <Link href={productHref}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.shortDescription}</p>
        <div className="product-footer">
          <span className="price">{product.priceFormatted}</span>
          <span className="field-hint">{product.availableQuantity} available</span>
        </div>
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            sku: "",
            name: product.name,
            priceCents: product.priceCents,
            imagePath: product.imagePath,
            imageAlt: product.imageAlt,
            availableStock: product.availableQuantity,
          }}
          compatibility={product.compatibility}
        />
      </div>
    </article>
  );
}
