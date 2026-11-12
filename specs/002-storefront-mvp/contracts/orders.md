# Order Placement Contract

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12
**Type**: HTTP JSON endpoint

This contract covers order placement, idempotent retries, stock conflicts, and the confirmation page. The server is authoritative for prices, stock, fees, order references, and totals.

## Endpoint

`POST /api/orders`

## Request

**Headers**

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |
| `Idempotency-Key` | Yes | Client-generated UUID v4 for this checkout attempt |

**Body**

```json
{
  "customer": {
    "fullName": "Nimal Perera",
    "phone": "0712345678",
    "email": "nimal@example.com"
  },
  "delivery": {
    "addressLine1": "123 Galle Road",
    "addressLine2": null,
    "city": "Colombo",
    "postalCode": "00300",
    "notes": "Call before delivery"
  },
  "vehicleId": "veh_toyota_vitz_2018_1kr",
  "items": [
    {
      "productId": "prod_brake_pad_front",
      "quantity": 2,
      "expectedUnitPriceCents": 1250000
    }
  ],
  "payment": {
    "method": "cod"
  }
}
```

| Field | Type | Rules |
|-------|------|-------|
| `customer.fullName` | string | Required; 2–100 characters |
| `customer.phone` | string | Required; Sri Lankan mobile or landline format |
| `customer.email` | string | Required; valid email; max 254 characters |
| `delivery.addressLine1` | string | Required; 3–160 characters |
| `delivery.addressLine2` | string \| null | Optional; max 160 characters |
| `delivery.city` | string | Required; 2–80 characters |
| `delivery.postalCode` | string | Required; 5 digits |
| `delivery.notes` | string \| null | Optional; max 500 characters |
| `vehicleId` | string \| null | Optional; must reference a prepared vehicle |
| `items` | array | 1–50 items; unique by `productId` |
| `items[].productId` | string | Required; active product |
| `items[].quantity` | integer | Required; 1–99 and within current stock |
| `items[].expectedUnitPriceCents` | integer | Optional; used to detect a price change before placing the order |
| `payment.method` | `"cod"` \| `"simulated_card"` | Required |

**Payment boundary**: The request never accepts card number, expiry, CVC, or any other card field. Simulated card fields are validated in the browser and are not transmitted. If a request contains unknown card-like fields, reject it with `400`.

Unknown top-level or nested fields are rejected. The server must not log the request body.

## Success Response — `201 Created`

```json
{
  "order": {
    "reference": "VA-20261112-7K3M9Q2F",
    "status": "confirmed",
    "createdAt": "2026-11-12T10:15:30.000Z",
    "items": [
      {
        "productId": "prod_brake_pad_front",
        "sku": "VA-BRK-001",
        "partNumber": "04465-0D040",
        "name": "Front Brake Pad Set",
        "quantity": 2,
        "unitPriceCents": 1250000,
        "lineTotalCents": 2500000,
        "compatibility": "compatible"
      }
    ],
    "delivery": {
      "addressLine1": "123 Galle Road",
      "addressLine2": null,
      "city": "Colombo",
      "postalCode": "00300",
      "notes": "Call before delivery"
    },
    "vehicle": {
      "vehicleId": "veh_toyota_vitz_2018_1kr",
      "displayName": "Toyota Vitz 2018 1.0L",
      "make": "Toyota",
      "model": "Vitz",
      "year": 2018,
      "engine": "1.0L 1KR-FE",
      "variant": null
    },
    "subtotalCents": 2500000,
    "deliveryFeeCents": 50000,
    "grandTotalCents": 2550000,
    "payment": {
      "method": "cod",
      "status": "cod_pending",
      "cardDataStored": false
    }
  }
}
```

The client should navigate to `/orders/[reference]` and display the confirmation summary returned here. The confirmation page must not require an account.

## Duplicate Idempotent Request — `200 OK`

If the same `Idempotency-Key` was already processed, return the existing order with `200 OK` and the same body shape. No second order is created and no additional stock is decremented.

## Error Response — `400 Bad Request`

Used for malformed JSON, missing/invalid fields, unknown fields, card data in the payload, or an invalid idempotency key.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "customer.email": "Enter a valid email address.",
      "delivery.postalCode": "Postal code must be 5 digits."
    }
  }
}
```

## Error Response — `409 Conflict`

Used when the cart no longer matches current price or stock. The order is not created and no stock is changed.

```json
{
  "error": {
    "code": "CART_CONFLICT",
    "message": "Some items changed while you were checking out.",
    "items": [
      {
        "productId": "prod_brake_pad_front",
        "reason": "INSUFFICIENT_STOCK",
        "currentUnitPriceCents": 1250000,
        "availableStock": 1
      }
    ]
  }
}
```

Conflict reasons:

| Reason | Meaning |
|--------|---------|
| `PRICE_CHANGED` | Current price differs from the cart snapshot |
| `OUT_OF_STOCK` | Product is no longer available |
| `INSUFFICIENT_STOCK` | Requested quantity exceeds current stock |
| `PRODUCT_UNAVAILABLE` | Product is inactive or missing |

Fitment compatibility is a warning, not a hard conflict: an incompatible or unknown fitment is recorded in the order snapshot and surfaced to the visitor before checkout, but it does not block order placement unless the product is unavailable. After a price or stock conflict, the client must refresh the cart via `/api/cart/validate`, show the affected items, and let the visitor retry. The visitor's cart and form details must be preserved.

## Error Response — `500 Internal Server Error`

```json
{
  "error": {
    "code": "ORDER_FAILED",
    "message": "We could not place your order right now. Your cart is safe; please try again."
  }
}
```

No order is considered placed unless the server returns `200` or `201` with an order reference.

## Order Placement Rules

1. The server derives all prices and totals from the current catalog and settings.
2. The server rechecks every product's active status and stock inside the store lock.
3. If any item fails, the entire order is rejected; no partial order and no stock decrement occur.
4. On success, stock is decremented exactly once per item and the order plus idempotency record are written atomically.
5. The order `reference` is unique and unguessable; it is safe to display in the confirmation URL.
6. Customer and order data expire 30 days after placement.
7. No card data is accepted, stored, logged, or returned.
8. The endpoint does not provide order lookup, order history, cancellation, refunds, or fulfillment actions.
9. No application-level rate limiting is included in the MVP; if the storefront is exposed publicly, apply host or reverse-proxy rate limits to the order and validation endpoints.

## Confirmation Page Contract

`GET /orders/[reference]`

- `200`: renders the order summary for a reference that exists and has not expired.
- `404`: renders a friendly “order not found or expired” page for an unknown or expired reference.
- The page must not expose a searchable order directory or list of other orders.
- The confirmation page is read-only and has a link back to the catalog.
- The page must not be cached with another visitor's data; use `no-store` behavior.
