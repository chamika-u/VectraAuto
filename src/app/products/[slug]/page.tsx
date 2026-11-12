import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Package } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { CompatibilityBadge } from "@/components/fitment/compatibility-badge";
import { FitmentFinder } from "@/components/fitment/fitment-finder";
import { Reveal } from "@/components/ui/reveal";
import { formatLkr } from "@/lib/money";
import { resolveVehicleFromParams } from "@/server/catalog/fitment";
import { getProductDetail, getProductBySlug } from "@/server/catalog/repository";
import { loadCatalogSeed } from "@/server/catalog/seed";
import { getStore } from "@/server/storage/json-store";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadCatalogSeed();
  const product = getProductBySlug(catalog, slug);
  if (!product) return { title: "Part not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const raw = await searchParams;
  const query = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, first(value)]),
  );
  const { catalog, runtime } = await getStore().readSnapshot();
  const vehicle = resolveVehicleFromParams(catalog.vehicles, query);
  const product = getProductDetail(catalog, runtime, slug, vehicle);
  if (!product) notFound();
  // After notFound(), product is guaranteed non-null for TypeScript
  const p = product!;

  return (
    <div className="container">
      <div className="section-tight" style={{ paddingTop: 18 }}>
        <Link className="link-arrow" href="/products">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to catalog
        </Link>
      </div>

      <div className="detail-layout">
        <Reveal>
          <ProductGallery images={p.images} productName={p.name} />
        </Reveal>
        <Reveal delay={0.06}>
          <p className="eyebrow">{p.category.name}</p>
          <h1 className="detail-title">{p.name}</h1>
          <p className="detail-copy" style={{ marginTop: 14 }}>{p.shortDescription}</p>
          <p className="detail-price">{formatLkr(p.priceCents)}</p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <CompatibilityBadge compatibility={p.compatibility} />
            <span className="badge badge-neutral">
              <Package size={12} aria-hidden="true" />
              {p.availability === "available"
                ? `${p.availableQuantity} in stock`
                : "Out of stock"}
            </span>
            <span className="badge badge-neutral">SKU {p.sku}</span>
          </div>

          {p.compatibilityNote ? (
            <div
              className={`alert ${p.compatibility === "compatible" ? "alert-success" : "alert-warning"}`}
              style={{ marginTop: 18 }}
            >
              {p.compatibility === "compatible" ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <AlertTriangle size={16} aria-hidden="true" />
              )}
              <span>{p.compatibilityNote}</span>
            </div>
          ) : null}

          <div className="buy-box">
            <div className="buy-row">
              <div>
                <p className="field-hint" style={{ marginBottom: 5 }}>Part number</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{p.partNumber}</p>
              </div>
              <span className="stock-note">
                <span className={`stock-dot ${p.availability === "available" ? "" : "out"}`} />
                {p.availability === "available" ? "Ready to order" : "Currently unavailable"}
              </span>
            </div>
            <div style={{ marginTop: 16 }}>
              <AddToCartButton
                product={{
                  id: p.id,
                  slug: p.slug,
                  sku: p.sku,
                  name: p.name,
                  priceCents: p.priceCents,
                  imagePath: p.imagePath,
                  imageAlt: p.imageAlt,
                  availableStock: p.availableQuantity,
                }}
                compatibility={p.compatibility}
                size="md"
              />
            </div>
            <p className="field-hint" style={{ marginTop: 10 }}>
              Delivery is a flat LKR 500. Stock and price are rechecked when you place the order.
            </p>
          </div>

          <div style={{ marginTop: 26 }}>
            <h2 className="panel-title">Details</h2>
            <p className="detail-copy">{p.description}</p>
            <dl className="spec-list">
              {p.specifications.map((specification) => (
                <div className="spec-row" key={specification.label}>
                  <dt>{specification.label}</dt>
                  <dd>{specification.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div style={{ marginTop: 26 }}>
            <h2 className="panel-title">Fitment</h2>
            <p className="detail-copy">{p.fitmentSummary}</p>
            {p.fitmentApplications.length > 0 ? (
              <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                {p.fitmentApplications.map((application) => (
                  <li key={application.vehicleId}>
                    {application.displayName}
                    {application.notes ? ` — ${application.notes}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="field-hint">No prepared fitment applications are available for this part.</p>
            )}
          </div>
        </Reveal>
      </div>

      <section className="section" aria-labelledby="fitment-check-heading">
        <div className="section-heading">
          <div>
            <h2 id="fitment-check-heading" className="section-title">Check another vehicle</h2>
            <p className="section-copy">Your selection is saved for this browser and updates compatibility across the catalog.</p>
          </div>
        </div>
        <FitmentFinder vehicles={catalog.vehicles} redirectPath="/products" title="Change vehicle" />
      </section>
    </div>
  );
}
