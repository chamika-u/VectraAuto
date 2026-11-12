# Phase 1 Data Model: VectraAuto Storefront MVP

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12
**Source**: [spec.md](./spec.md) and [research.md](./research.md)

All monetary values are integer Sri Lankan rupee cents. All timestamps are ISO-8601 UTC strings. The catalog seed is read-only; inventory, orders, and idempotency records live in a mutable runtime store.

## Entity Overview

```text
Category 1 ─── N Product
Product  1 ─── N FitmentApplication
Vehicle  1 ─── N FitmentApplication
Product  1 ─── 1 Inventory
Order    1 ─── N OrderItem
Order    1 ─── 1 PaymentSummary
Order    1 ─── 0..1 VehicleSnapshot
IdempotencyRecord N ─── 1 Order
```

## Catalog Entities

### Category

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable unique identifier, e.g. `cat_brakes` |
| `slug` | string | Unique URL-safe slug |
| `name` | string | 1–80 characters |
| `description` | string | 0–300 characters |
| `imagePath` | string \| null | Local image path or null |
| `sortOrder` | integer | Non-negative; controls display order |

### Product

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable unique identifier |
| `sku` | string | Unique, uppercase, 3–40 characters |
| `partNumber` | string | Manufacturer part number; indexed for search, 1–60 characters |
| `slug` | string | Unique URL-safe slug |
| `name` | string | 1–140 characters |
| `shortDescription` | string | 1–200 characters |
| `description` | string | 1–4,000 characters |
| `categoryId` | string | Must reference an existing category |
| `priceCents` | integer | Greater than zero |
| `images` | ProductImage[] | At least one image or intentional placeholder |
| `specifications` | Specification[] | Key/value pairs, max 30 entries |
| `fitmentSummary` | string | Human-readable summary derived from applications, e.g. “Fits selected Toyota models, 2015–2020” |
| `status` | `"active"` \| `"inactive"` | Only active products are listed or purchasable |

**ProductImage**

| Field | Type | Rules |
|-------|------|-------|
| `path` | string | Local path under `public/products/` or a placeholder path |
| `alt` | string | Required, descriptive alternative text |
| `width` | integer | Positive; used to reserve layout space |
| `height` | integer | Positive; used to reserve layout space |

**Specification**

| Field | Type | Rules |
|-------|------|-------|
| `label` | string | 1–60 characters |
| `value` | string | 1–160 characters |

### Vehicle

Represents one prepared vehicle selection in the fitment finder. Each row is a unique combination of make, model, year, and optional engine/variant.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable unique identifier, e.g. `veh_toyota_vitz_2018_1kr` |
| `make` | string | 1–40 characters |
| `model` | string | 1–60 characters |
| `year` | integer | 1990–current year + 1 |
| `engine` | string \| null | Optional, e.g. `1.0L 1KR-FE` |
| `variant` | string \| null | Optional trim or market variant |
| `displayName` | string | Derived display label, e.g. `Toyota Vitz 2018 1.0L` |

Uniqueness: `(make, model, year, engine, variant)`.

### FitmentApplication

Maps a product to a prepared vehicle.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable unique identifier |
| `productId` | string | Must reference an active product |
| `vehicleId` | string | Must reference a prepared vehicle |
| `notes` | string \| null | Installation or compatibility note, max 300 characters |

Uniqueness: `(productId, vehicleId)`.

**Compatibility rule** for a selected vehicle:

1. If no vehicle is selected, no compatibility badge is shown.
2. If the product has zero fitment applications, return `unknown`.
3. If any application matches the selected vehicle, return `compatible`.
4. Otherwise return `incompatible`.

Products with `unknown` fitment must never be presented as compatible. Products marked `incompatible` require an explicit warning before being added to the cart.

## Runtime Entities

### Inventory

| Field | Type | Rules |
|-------|------|-------|
| `productId` | string | Must reference an active product |
| `quantity` | integer | Greater than or equal to zero |

Initial quantity comes from the catalog seed. Inventory is decremented only after a successful order transaction. A quantity of zero means the product is out of stock.

### Cart (client-side only)

The cart is not stored on the server. It is persisted in `localStorage` for the same browser and revalidated before checkout. If browser storage is unavailable, the cart remains in memory for the current session and the UI explains that it cannot be remembered.

| Field | Type | Rules |
|-------|------|-------|
| `items` | CartItem[] | Unique by `productId`; max 50 distinct products |
| `vehicle` | VehicleProfile \| null | Optional selected vehicle |
| `updatedAt` | string | ISO timestamp of the last change |

**CartItem**

| Field | Type | Rules |
|-------|------|-------|
| `productId` | string | References a catalog product |
| `quantity` | integer | 1–99 and not greater than the last known stock quantity |
| `unitPriceCents` | integer | Display snapshot only; server price wins at checkout |
| `compatibility` | `"compatible"` \| `"incompatible"` \| `"unknown"` \| null | Recomputed when the vehicle changes |

**VehicleProfile (client-side)**

| Field | Type | Rules |
|-------|------|-------|
| `vehicleId` | string | References a prepared vehicle |
| `make` | string | Must match the referenced vehicle |
| `model` | string | Must match the referenced vehicle |
| `year` | integer | Must match the referenced vehicle |
| `engine` | string \| null | Must match the referenced vehicle when present |
| `variant` | string \| null | Must match the referenced vehicle when present |

The selected vehicle is retained across reloads in the same browser and can be changed or cleared at any time.

### CustomerContact

| Field | Type | Rules |
|-------|------|-------|
| `fullName` | string | 2–100 characters |
| `phone` | string | Required; Sri Lankan mobile or landline format, normalized for storage |
| `email` | string | Required; valid email format, max 254 characters |

### DeliveryDetails

| Field | Type | Rules |
|-------|------|-------|
| `addressLine1` | string | 3–160 characters |
| `addressLine2` | string \| null | Optional, max 160 characters |
| `city` | string | 2–80 characters |
| `postalCode` | string | 5 digits for the MVP |
| `notes` | string \| null | Optional delivery note, max 500 characters |

### PaymentSummary

| Field | Type | Rules |
|-------|------|-------|
| `method` | `"cod"` \| `"simulated_card"` | Required |
| `status` | `"cod_pending"` \| `"simulated_demo"` | Derived from method; no real charge is recorded |
| `cardDataStored` | boolean | Always `false`; no card values are transmitted or persisted |

Simulated card number, expiry, and CVC are validated only in the browser and are never part of this entity or any server request.

### Order

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | UUID v4, internal unique identifier |
| `reference` | string | Unique, unguessable customer-facing reference, e.g. `VA-20261112-7K3M9Q2F` |
| `idempotencyKey` | string | UUID v4 supplied by the client; unique |
| `customer` | CustomerContact | Required |
| `delivery` | DeliveryDetails | Required |
| `vehicle` | VehicleSnapshot \| null | Snapshot of the selected vehicle used at purchase |
| `items` | OrderItem[] | At least one item |
| `subtotalCents` | integer | Sum of item line totals |
| `deliveryFeeCents` | integer | Flat fee from settings; non-negative |
| `grandTotalCents` | integer | `subtotalCents + deliveryFeeCents` |
| `payment` | PaymentSummary | Required |
| `status` | `"confirmed"` | MVP orders are confirmed immediately |
| `createdAt` | string | ISO timestamp |
| `expiresAt` | string | `createdAt + 30 days`; used by retention purge |

**OrderItem**

| Field | Type | Rules |
|-------|------|-------|
| `productId` | string | Product identifier at the time of purchase |
| `sku` | string | Snapshot |
| `partNumber` | string | Snapshot |
| `name` | string | Snapshot |
| `quantity` | integer | Greater than zero |
| `unitPriceCents` | integer | Server price at the time of purchase |
| `lineTotalCents` | integer | `quantity × unitPriceCents` |
| `compatibility` | `"compatible"` \| `"incompatible"` \| `"unknown"` \| null | Snapshot of the selected-vehicle result |

**VehicleSnapshot**

| Field | Type | Rules |
|-------|------|-------|
| `vehicleId` | string | Prepared vehicle identifier used at purchase |
| `displayName` | string | Snapshot label |
| `make` | string | Snapshot |
| `model` | string | Snapshot |
| `year` | integer | Snapshot |
| `engine` | string \| null | Snapshot |
| `variant` | string \| null | Snapshot |

### IdempotencyRecord

| Field | Type | Rules |
|-------|------|-------|
| `key` | string | UUID v4; unique |
| `orderId` | string | References the created order |
| `createdAt` | string | ISO timestamp |
| `expiresAt` | string | Same retention boundary as the order |

A duplicate request with the same key returns the existing order instead of creating a new one.

## Storage Layout

### `data/catalog.seed.json`

```text
{
  "schemaVersion": 1,
  "currency": "LKR",
  "deliveryFeeCents": 50000,
  "retentionDays": 30,
  "categories": [Category],
  "products": [Product],
  "vehicles": [Vehicle],
  "fitmentApplications": [FitmentApplication]
}
```

### `data/runtime.store.json`

```text
{
  "schemaVersion": 1,
  "inventory": { "<productId>": <quantity> },
  "orders": [Order],
  "idempotency": [IdempotencyRecord]
}
```

The runtime store is generated from the seed on first run and is excluded from version control. Writes use a temporary file followed by an atomic rename while holding the store mutex.

## Order Placement Transaction

1. Acquire the runtime-store mutex.
2. Purge expired orders and idempotency records.
3. If the idempotency key already exists, return the existing order.
4. Load the current catalog and runtime store.
5. Validate every item: product exists and is active, quantity is a positive integer, current stock is sufficient, and the server price is used.
6. If any item fails, reject the entire order with a conflict describing the affected items. No stock changes occur.
7. Build the order snapshot and calculate subtotal, delivery fee, and grand total.
8. Decrement inventory for every item, ensuring no quantity becomes negative.
9. Add the order and idempotency record to a new runtime-store object.
10. Write the new store object atomically.
11. Release the mutex and return the confirmation data.

## State Transitions

### Cart

`empty → active → checkout-pending → empty` after a successful order.

### Compatibility

`unknown` when fitment data is absent; otherwise `compatible` or `incompatible` for the selected vehicle.

### Order

`confirmed` → `expired` when the 30-day retention boundary is reached. Expired orders are deleted from the runtime store, which also removes the associated customer and delivery data and idempotency record.

### Inventory

`quantity > 0` → available; `quantity = 0` → out of stock. Inventory only decreases in this MVP; restocking is manual.

## Validation Summary

- Product `priceCents` must be a positive integer; stock must be a non-negative integer.
- Quantity must be an integer from 1 to the available stock and never more than 99 per line.
- Checkout requires valid name, phone, email, address, city, and 5-digit postal code.
- Payment method must be `cod` or `simulated_card`.
- Simulated card fields are validated in the browser only and must never appear in a server payload or stored order.
- Order totals must satisfy `grandTotalCents = subtotalCents + deliveryFeeCents`.
- Every order item must have `lineTotalCents = quantity × unitPriceCents`.
- Idempotency keys must be unique; duplicate keys must return the original order.
- Orders and idempotency records must be deleted after 30 days.
