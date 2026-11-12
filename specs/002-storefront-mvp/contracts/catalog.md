# Catalog and Storefront URL Contract

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12
**Type**: Browser-facing page and query contract

The catalog is rendered by the Next.js application. These URLs and query parameters are the public browsing contract for the MVP.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with brand, featured categories, featured products, and fitment finder entry point |
| `/products` | Full catalog with category, search, and fitment filters |
| `/products/[slug]` | Product detail with images, specifications, fitment, price, stock, and add-to-cart |
| `/cart` | Full cart page with quantity controls, totals, and checkout entry |
| `/checkout` | Checkout details, review, payment method, and place-order action |
| `/orders/[reference]` | Order confirmation for a successfully placed order; returns not-found after expiry or unknown reference |

## `/products` Query Parameters

| Parameter | Type | Rules |
|-----------|------|-------|
| `category` | string | Category slug; invalid values produce an empty state with a clear reset action |
| `q` | string | Case-insensitive search across product name, description, part number, and SKU; max 80 characters |
| `make` | string | Prepared vehicle make; used with `model`, `year`, and optional `engine`/`variant` |
| `model` | string | Prepared vehicle model for the selected make |
| `year` | integer | Prepared vehicle year for the selected make/model |
| `engine` | string | Optional prepared engine for the selected vehicle |
| `variant` | string | Optional prepared variant for the selected vehicle |
| `compatible` | `1` | When present with a complete vehicle selection, show only compatible products |

Parameter behavior:

- A complete vehicle selection is `make + model + year`; `engine` and `variant` are optional refinements.
- A partial vehicle selection must not silently filter results; the page shows guidance to complete or clear the selection.
- Invalid or unknown values produce an empty state or a clear reset path rather than a server error.
- Search and filters are combinable.
- The visitor's last complete vehicle selection is retained in the same browser and can be cleared from any catalog view.

## Catalog Page Response Shape

The rendered page consumes the following logical shapes. Field names are stable for tests and future API extraction.

```text
CatalogPage {
  categories: CategorySummary[]
  products: ProductCard[]
  vehicleSelection: VehicleSelection | null
  totalResults: integer
  emptyState: EmptyState | null
}

CategorySummary {
  id: string
  slug: string
  name: string
  imagePath: string | null
}

ProductCard {
  id: string
  slug: string
  name: string
  shortDescription: string
  priceCents: integer
  priceFormatted: string          // LKR display
  imagePath: string
  imageAlt: string
  availability: "available" | "out_of_stock"
  availableQuantity: integer
  compatibility: "compatible" | "incompatible" | "unknown" | null
}

VehicleSelection {
  vehicleId: string
  make: string
  model: string
  year: integer
  engine: string | null
  variant: string | null
  displayName: string
}

EmptyState {
  title: string
  message: string
  actionLabel: string
  actionHref: string
}
```

## Product Detail Response Shape

```text
ProductDetail {
  id: string
  sku: string
  partNumber: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: CategorySummary
  priceCents: integer
  priceFormatted: string
  images: ProductImage[]
  specifications: { label: string; value: string }[]
  availability: "available" | "out_of_stock"
  availableQuantity: integer
  fitmentSummary: string
  fitmentApplications: {
    vehicleId: string
    displayName: string
    notes: string | null
  }[]
  compatibility: "compatible" | "incompatible" | "unknown" | null
  compatibilityNote: string | null
}
```

## Fitment Finder Behavior

1. The visitor selects make, then model, then year, then an optional engine or variant when the prepared data offers one.
2. The selection resolves to a prepared vehicle identifier.
3. Product cards and detail pages show a compatibility badge when a vehicle is selected.
4. The catalog can be filtered to compatible products.
5. Changing or clearing the vehicle updates results immediately.
6. If the selection has no compatible products, the page shows a clear empty state with options to change or clear the vehicle.
7. Products without fitment data show `unknown`, never `compatible`.

## Error and Empty-State Contract

| State | Expected behavior |
|-------|-------------------|
| Unknown category or product slug | Friendly not-found page with a link back to the catalog |
| No search results | Empty state with the active query shown and a clear-filters action |
| No compatible products for the vehicle | Empty state with change-vehicle and clear-vehicle actions |
| Incomplete vehicle selection | Guidance state; no silent filtering |
| Product images unavailable | Intentional placeholder with preserved aspect ratio and alt text |
| Out-of-stock product | Availability label and disabled add-to-cart action |
| Inactive or removed product | Not listed; direct link resolves to not-found |

## Caching and Security Notes

- Catalog pages may be statically cached because the seed catalog changes only on deployment or reseeding.
- Compatibility for the selected vehicle is computed from the same prepared fitment data used by the server; no external fitment service is called.
- No customer or card data appears in catalog URLs.
