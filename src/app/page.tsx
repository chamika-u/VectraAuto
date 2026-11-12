import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Truck } from "lucide-react";
import { FitmentFinder } from "@/components/fitment/fitment-finder";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { buildVehicleQuery, resolveVehicleFromParams } from "@/server/catalog/fitment";
import { getFeaturedProducts } from "@/server/catalog/repository";
import { getStore } from "@/server/storage/json-store";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const stringParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  const { catalog, runtime } = await getStore().readSnapshot();
  const vehicle = resolveVehicleFromParams(catalog.vehicles, stringParams);
  const featured = getFeaturedProducts(catalog, runtime, vehicle, 8);
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const vehicleParams = vehicle ? buildVehicleQuery(vehicle) : new URLSearchParams();

  return (
    <>
      <div className="container">
        <section className="hero">
          <Reveal>
            <p className="eyebrow">
              <BadgeCheck size={14} aria-hidden="true" />
              Sri Lanka&apos;s parts showcase
            </p>
            <h1 className="hero-title">
              The right part.
              <br />
              <span>First time.</span>
            </h1>
            <p className="hero-copy">
              Browse a curated catalog of automobile parts, confirm fitment for your vehicle,
              and check out in minutes. Cash on Delivery and a clearly labelled demo card flow
              are ready for the showcase.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/products">
                Shop all parts
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" href="#fitment">
                Find my fitment
              </Link>
            </div>
            <div className="hero-proof">
              <span><ShieldCheck size={16} aria-hidden="true" /> Fitment-first catalog</span>
              <span><Truck size={16} aria-hidden="true" /> Flat LKR 500 delivery</span>
              <span><Search size={16} aria-hidden="true" /> Search by part number</span>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="fitment-anchor">
            <div id="fitment">
              <FitmentFinder vehicles={catalog.vehicles} />
            </div>
          </Reveal>
        </section>

        <section className="section" aria-labelledby="categories-heading">
          <div className="section-heading">
            <div>
              <h2 id="categories-heading" className="section-title">Shop by system</h2>
              <p className="section-copy">
                Start with the system you need. Every product page shows stock, specifications,
                and a clear compatibility result for your saved vehicle.
              </p>
            </div>
            <Link className="link-arrow" href="/products">
              View catalog <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <Reveal>
            <div className="category-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="category-card"
                >
                  {category.imagePath ? (
                    <Image src={category.imagePath} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
                  ) : null}
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section" aria-labelledby="featured-heading">
          <div className="section-heading">
            <div>
              <h2 id="featured-heading" className="section-title">
                {vehicle ? `Popular for your ${vehicle.make}` : "Featured parts"}
              </h2>
              <p className="section-copy">
                {vehicle
                  ? `Compatibility is checked against your saved ${vehicle.displayName}.`
                  : "A selection of parts our showcase customers ask for most."}
              </p>
            </div>
            <Link className="link-arrow" href={vehicle ? `/products?${vehicleParams.toString()}` : "/products"}>
              Shop all <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid
            products={featured}
            hrefForProduct={(product) => {
              const query = vehicleParams.toString();
              return `/products/${product.slug}${query ? `?${query}` : ""}`;
            }}
          />
        </section>

        <section className="section-tight" aria-label="Store promise">
          <div className="section-band">
            <h2>Confidence before the checkout.</h2>
            <p>
              Fitment is resolved from prepared vehicle data, stock is rechecked at order placement,
              and every order gets a unique reference. Simulated card details stay in your browser
              and are never sent to the server.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
