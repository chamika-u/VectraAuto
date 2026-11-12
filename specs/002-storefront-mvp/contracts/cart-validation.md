# Cart Validation Contract

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12
**Type**: HTTP JSON endpoint

The cart is held in the browser. Before checkout and when the cart is restored, the client asks the server to revalidate prices, stock, and fitment. The server is the source of truth for all totals.

## Endpoint

`POST /api/cart/validate`

## Request

**Headers**

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

**Body**

```json
{
  "items": [
    {
      "productId": "prod_brake_pad_front",
      "quantity": 2,
      "expectedUnitPriceCents": 1250000
    }
  ],
  "vehicleId": "veh_toyota_vitz_2018_1kr"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `items` | array | 1–50 items; unique by `productId` |
| `items[].productId` | string | Required; must reference an active product |
| `items[].quantity` | integer | Required; 1–99 |
| `items[].expectedUnitPriceCents` | integer | Optional; used to detect a price change for the visitor |
| `vehicleId` | string \| null | Optional; must reference a prepared vehicle |

Unknown fields are rejected. Card data is never accepted by this endpoint.

## Success Response — `200 OK`

```json
{
  "items": [
    {
      "productId": "prod_brake_pad_front",
      "slug": "front-brake-pads-toyota-vitz",
      "sku": "VA-BRK-001",
      "name": "Front Brake Pad Set",
      "quantity": 2,
      "unitPriceCents": 1250000,
      "lineTotalCents": 2500000,
      "availableStock": 8,
      "availability": "available",
      "priceChanged": false,
      "compatibility": "compatible",
      "imagePath": "/products/brake-pad-front.jpg",
      "imageAlt": "Front brake pad set"
    }
  ],
  "subtotalCents": 2500000,
  "deliveryFeeCents": 50000,
  "grandTotalCents": 2550000,
  "warnings": [],
  "canCheckout": true
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `items[].availability` | `"available"` \| `"out_of_stock"` \| `"insufficient_stock"` | Current purchasability |
| `items[].priceChanged` | boolean | True when the current server price differs from `expectedUnitPriceCents` |
| `items[].compatibility` | `"compatible"` \| `"incompatible"` \| `"unknown"` \| null | Result for the supplied vehicle, or null when no vehicle is supplied |
| `warnings` | Warning[] | Visitor-actionable messages |
| `canCheckout` | boolean | True only when every item is available, within stock, and has no blocking warning |

**Warning**

```json
{
  "code": "PRICE_CHANGED",
  "productId": "prod_brake_pad_front",
  "message": "The price of Front Brake Pad Set changed to LKR 12,500.00."
}
```

Warning codes:

| Code | Meaning |
|------|---------|
| `PRICE_CHANGED` | Current price differs from the cart snapshot |
| `OUT_OF_STOCK` | Product is no longer available |
| `INSUFFICIENT_STOCK` | Requested quantity exceeds available stock |
| `PRODUCT_UNAVAILABLE` | Product is inactive or missing |
| `FITMENT_INCOMPATIBLE` | Selected vehicle is incompatible; the visitor must confirm before ordering |
| `FITMENT_UNKNOWN` | Fitment cannot be verified for the selected vehicle |

## Error Response — `400 Bad Request`

Used for malformed JSON, invalid field types, duplicate product IDs, or out-of-range quantities.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some cart items are invalid.",
    "fields": {
      "items[0].quantity": "Quantity must be between 1 and 99."
    }
  }
}
```

## Error Response — `500 Internal Server Error`

```json
{
  "error": {
    "code": "STORE_UNAVAILABLE",
    "message": "The cart could not be validated right now. Please try again."
  }
}
```

## Behavior Rules

- The endpoint never changes stock or creates an order.
- The server re-reads the current catalog and inventory; client-provided prices are advisory only.
- Duplicate `productId` entries are rejected rather than merged.
- If the store cannot be read, return `500` and let the client keep the cart and offer retry.
- Responses must use `Cache-Control: no-store`.
- The endpoint must not log customer or card data. It receives neither.
