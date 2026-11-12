import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/catalog/empty-state";
import { FitmentFinder } from "@/components/fitment/fitment-finder";
import { Reveal } from "@/components/ui/reveal";
import { buildVehicleQuery, resolveVehicleFromParams } from "@/server/catalog/fitment";
import {
  getCategoryBySlug,
  listProducts,
} from "@/server/catalog/repository";
import { getStore } from "@/server/storage/json-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop parts",
  description: "Browse automobile parts by category, search term, or vehicle fitment.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, first(value)]),
  );
  const { catalog, runtime } = await getStore().readSnapshot();
  const categorySlug = params.category;
  const category = categorySlug ? getCategoryBySlug(catalog, categorySlug) : undefined;
  const vehicle = resolveVehicleFromParams(catalog.vehicles, params);
  const query = params.q ?? "";
  const compatibleOnly = params.compatible === "1" && Boolean(vehicle);
  const hasPartialVehicle = Boolean(params.make || params.model || params.year) && !vehicle;
  const vehicleParams = vehicle ? buildVehicleQuery(vehicle) : new URLSearchParams();
  const products =
    categorySlug && !category
      ? []
      : listProducts(catalog, runtime, {
          categorySlug,
          query,
          vehicle,
          compatibleOnly,
        });
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  function categoryHref(slug?: string): string {
    const next = new URLSearchParams();
    if (slug) next.set("category", slug);
    if (query) next.set("q", query);
    vehicleParams.forEach((value, key) => next.set(key, value));
    if (compatibleOnly) next.set("compatible", "1");
    const value = next.toString();
    return value ? `/products?${value}` : "/products";
  }

  function compatibleHref(): string {
    const next = new URLSearchParams();
    if (categorySlug) next.set("category", categorySlug);
    if (query) next.set("q", query);
    vehicleParams.forEach((value, key) => next.set(key, value));
    if (!compatibleOnly) next.set("compatible", "1");
    const value = next.toString();
    return value ? `/products?${value}` : "/products";
  }

  const emptyTitle = categorySlug && !category ? "That category is not available" : "No parts found";
  const emptyMessage =
    categorySlug && !category
      ? "The category link may be outdated. Browse the full catalog to continue."
      : query
        ? `No parts match “${query}”. Try a different name, part number, or SKU.`
        : compatibleOnly
          ? "No compatible parts are available for this vehicle yet. Change or clear the vehicle to browse everything."
          : "There are no parts in this view yet. Clear the filters to see the full catalog.";

  return (
    <div className="container">
      <section className="section-tight" style={{ paddingTop: 38 }}>
        <p className="eyebrow"><SlidersHorizontal size={14} aria-hidden="true" /> Catalog</p>
        <div className="section-heading" style={{ marginBottom: 10 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Parts that fit the way you drive.
            </h1>
            <p className="section-copy">
              Use search, categories, or the fitment finder. Compatibility results update from the
              prepared vehicle data.
            </p>
          </div>
        </div>
      </section>

      <div className="catalog-layout" style={{ paddingBottom: 52 }}>
        <aside>
          <div className="panel filter-panel" aria-label="Catalog filters">
            <h2>Browse</h2>
            <div className="filter-group">
              <Link className="filter-link" href={categoryHref()} data-active={!categorySlug}>
                <span>All parts</span>
                <span>{catalog.products.filter((product) => product.status === "active").length}</span>
              </Link>
              {categories.map((entry) => (
                <Link
                  key={entry.id}
                  className="filter-link"
                  href={categoryHref(entry.slug)}
                  data-active={entry.slug === categorySlug}
                >
                  <span>{entry.name}</span>
                </Link>
              ))}
            </div>

            {vehicle ? (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                <span>
                  <strong>{vehicle.displayName}</strong>
                  <br />
                  Your saved vehicle.
                </span>
              </div>
            ) : null}
            {hasPartialVehicle ? (
              <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                <span>Complete make, model, and year to check fitment.</span>
              </div>
            ) : null}

            <FitmentFinder
              vehicles={catalog.vehicles}
              redirectPath="/products"
              title={vehicle ? "Change vehicle" : "Fitment finder"}
            />
          </div>
        </aside>

        <section aria-label="Products">
          <div className="catalog-toolbar">
            <form className="search-form" action="/products" method="get" role="search">
              {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
              {vehicleParams.get("make") ? <input type="hidden" name="make" value={vehicleParams.get("make") ?? ""} /> : null}
              {vehicleParams.get("model") ? <input type="hidden" name="model" value={vehicleParams.get("model") ?? ""} /> : null}
              {vehicleParams.get("year") ? <input type="hidden" name="year" value={vehicleParams.get("year") ?? ""} /> : null}
              {vehicleParams.get("engine") ? <input type="hidden" name="engine" value={vehicleParams.get("engine") ?? ""} /> : null}
              {vehicleParams.get("variant") ? <input type="hidden" name="variant" value={vehicleParams.get("variant") ?? ""} /> : null}
              {compatibleOnly ? <input type="hidden" name="compatible" value="1" /> : null}
              <label className="sr-only" htmlFor="catalog-search">Search parts</label>
              <input
                id="catalog-search"
                className="input"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search name, part number, or SKU"
              />
              <button className="button button-primary" type="submit">
                <Search size={16} aria-hidden="true" />
                Search
              </button>
            </form>
            <span className="result-count">
              {products.length} part{products.length === 1 ? "" : "s"}
            </span>
          </div>

          {vehicle ? (
            <div className="catalog-toolbar" style={{ marginBottom: 14 }}>
              <Link
                className={`button button-sm ${compatibleOnly ? "button-primary" : "button-secondary"}`}
                href={compatibleHref()}
              >
                {compatibleOnly ? "Showing compatible only" : "Show compatible only"}
              </Link>
              <Link className="link-arrow" href="/products">
                Clear filters
              </Link>
            </div>
          ) : null}

          {products.length === 0 ? (
            <EmptyState
              title={emptyTitle}
              message={emptyMessage}
              actionLabel="Browse all parts"
              actionHref="/products"
            />
          ) : (
            <Reveal>
              <ProductGrid
                products={products}
                hrefForProduct={(product) => {
                  const next = new URLSearchParams(vehicleParams);
                  const value = next.toString();
                  return `/products/${product.slug}${value ? `?${value}` : ""}`;
                }}
              />
            </Reveal>
          )}
        </section>
      </div>
    </div>
  );
}
