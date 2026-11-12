# Quickstart Validation Guide: VectraAuto Storefront MVP

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12

This guide describes how to run and validate the MVP after implementation. It is a validation guide, not an implementation specification; entity rules live in [data-model.md](./data-model.md) and interface shapes live in [contracts/](./contracts/).

## Prerequisites

- Node.js 22 LTS
- npm 10+
- Playwright browsers installed for end-to-end tests
- A persistent writable `data/` directory and `public/products/` assets

## Setup

```bash
npm install
npm run seed
npm run dev
```

Open `http://localhost:3000`.

Expected startup results:

- `npm run seed` validates the catalog seed and creates `data/runtime.store.json` with initial inventory.
- The home page shows the VectraAuto brand, featured categories, featured products, and the fitment finder.
- The catalog contains at least 20 active products across at least 3 categories.
- No browser console errors appear during the initial load.

### Useful commands

```bash
npm run seed -- --reset      # Reset demo inventory, orders, and idempotency records
npm run lint                 # ESLint
npm run typecheck            # TypeScript strict check
npm run test                 # Vitest unit and integration tests
npm run test:e2e             # Playwright browse-to-buy journeys
npm run test:a11y            # Accessibility checks if configured separately
npm run build                # Production build
npm run start                # Run the production build
npm run purge:orders         # Delete or anonymize orders older than 30 days
```

## Demo Card Values

The simulated card flow is a demo only. Use:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 or 4 digits

No real charge is made. Card values must never appear in a server request, application log, or stored order.

## Validation Scenarios

### 1. Catalog and Search

1. Open `/`.
2. Select a category.
3. Search for a product name.
4. Search for a manufacturer part number and for an SKU.
5. Search for a term with no matches.

**Expected**:

- Category and search results show matching active products only.
- Product cards show name, image or placeholder, LKR price, and availability.
- No-match search shows a clear empty state with a reset action.
- Product detail shows images, description, specifications, fitment, price, stock, and compatibility status.

### 2. Vehicle Fitment Finder

1. Open the fitment finder and choose a prepared make, model, and year.
2. Confirm the selection.
3. Review product cards and open a compatible product.
4. Change the vehicle and observe results.
5. Clear the vehicle and browse the full catalog.
6. Select a vehicle with no compatible products, if present in the seed data.

**Expected**:

- Compatibility badges show `compatible`, `incompatible`, or `unknown` correctly.
- The selected vehicle is retained after a reload in the same browser.
- Changing or clearing the vehicle updates results immediately.
- Partial selections show guidance rather than silently filtering.
- No-compatible-results shows a clear empty state with change/clear actions.
- Products without fitment data are labeled `unknown`, never `compatible`.

### 3. Cart Persistence and Totals

1. Add two different products to the cart.
2. Increase and decrease a quantity.
3. Remove one item.
4. Reload the page.
5. Close and reopen the browser in the same profile.
6. Attempt to add more than the available stock.

**Expected**:

- The cart count and cart panel update with visible feedback.
- Line totals, subtotal, delivery fee, and grand total recalculate immediately.
- The cart survives reload and return visits in the same browser.
- Quantity controls never exceed current stock.
- Out-of-stock products cannot be added.
- Changing the selected vehicle flags possible fitment mismatches without silently removing items.

### 4. Cash on Delivery Checkout

1. Start with a non-empty cart.
2. Open checkout.
3. Submit with missing or invalid required fields.
4. Complete valid contact and delivery details.
5. Choose Cash on Delivery.
6. Review the order and place it.

**Expected**:

- Invalid submissions are blocked with field-level messages.
- Review shows every item, quantity, unit price, line total, delivery fee, and final LKR total.
- Confirmation shows a unique reference, items, delivery details, payment method, and final total.
- The order is recorded with `cod_pending` payment status and `confirmed` order status.
- The cart is emptied after success.
- Stock decreases by the ordered quantity for each item.
- Products reaching zero stock show as unavailable.
- Refreshing or resubmitting does not create a duplicate order.

### 5. Simulated Card Checkout

1. Add an available product to the cart.
2. Open checkout and choose simulated card payment.
3. Confirm the demo notice and test fields are visible.
4. Submit with invalid test card fields.
5. Submit with the demo card values above.
6. Place the order.

**Expected**:

- The simulated card step is clearly labeled as a demo.
- Invalid test card fields are blocked with guidance.
- No real charge occurs.
- The confirmation labels the payment as simulated/demo, not completed.
- No card values are stored or returned.
- Order placement and stock decrement behave the same as the COD flow.

### 6. Duplicate Submission and Conflict Handling

1. Place an order while watching the network request.
2. Resend the same request with the same `Idempotency-Key` using a test client.
3. In a test fixture, change a product price or reduce stock after adding it to the cart.
4. Attempt checkout with the changed item.

**Expected**:

- A repeated idempotency key returns the original order and does not create a second order or decrement stock again.
- A price or stock conflict returns `409` with affected items and current prices/stock.
- The cart and entered checkout details are preserved after a conflict.
- The visitor can review the change and retry.

### 7. Last-Unit Concurrency

1. Set a test product to one unit of stock.
2. Attempt two orders for that unit with concurrent requests in the integration test suite.

**Expected**:

- Exactly one order succeeds.
- The second request receives a conflict and no stock becomes negative.

### 8. Order Retention

1. Create an order fixture with a `createdAt` older than 30 days.
2. Trigger a store read or run `npm run purge:orders`.
3. Open the corresponding confirmation URL.

**Expected**:

- The expired order and its customer/delivery data are removed.
- The idempotency record is removed with the order.
- The confirmation URL returns a friendly not-found or expired state.
- Current orders inside the 30-day window remain available.

### 9. Responsive, Keyboard, and Reduced Motion

1. Check the full browse-to-buy flow at 360px and 1440px widths.
2. Complete the flow using only the keyboard.
3. Enable reduced motion in the operating system or browser DevTools.
4. Navigate between catalog, product detail, cart, and checkout.

**Expected**:

- No horizontal scrolling; all primary actions are reachable.
- Focus order is logical and focus is always visible.
- The cart drawer traps focus appropriately, closes with Escape, and returns focus to its trigger.
- Non-essential motion is minimized or removed under reduced motion.
- Content transitions never block input and complete within 500ms.
- No critical or serious accessibility violations are reported by the automated check.

### 10. Performance and Image Fallbacks

1. Load the catalog and a product detail on a throttled connection.
2. Temporarily use a missing product image in a test fixture.
3. Observe layout stability and interaction responsiveness.

**Expected**:

- Primary content appears within the performance target on a typical connection.
- Missing images show a placeholder and preserve layout.
- Cart and quantity interactions remain responsive.
- No layout shift blocks the primary action.

## Automated Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run test:a11y
```

Expected results:

- Lint and typecheck pass with no errors.
- Unit and integration tests cover money formatting, cart validation, fitment resolution, stock transaction, idempotency, and retention.
- E2E tests cover catalog, fitment, cart persistence, COD checkout, simulated card checkout, duplicate submission, and responsive/keyboard journeys.
- Accessibility checks report no critical or serious violations on primary flows.

## Definition of Done Checklist

- [ ] `npm install`, `npm run seed`, and `npm run dev` work from a clean checkout.
- [ ] All spec acceptance scenarios pass manually or through automated tests.
- [ ] Cart persists across reloads and return visits in the same browser.
- [ ] Fitment compatibility is correct for seeded vehicles and unknown data is explicit.
- [ ] COD and simulated card orders both confirm with unique references.
- [ ] Duplicate requests do not create duplicate orders.
- [ ] Stock decrements exactly once and never becomes negative.
- [ ] Orders older than 30 days are deleted or anonymized.
- [ ] Primary flows work at 360px and 1440px, by keyboard, and with reduced motion.
- [ ] Lint, typecheck, unit, integration, E2E, and accessibility checks pass.
