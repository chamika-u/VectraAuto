# Phase 0 Research: VectraAuto Storefront MVP

**Feature**: `002-storefront-mvp`
**Date**: 2026-11-12
**Status**: Complete — no unresolved `NEEDS CLARIFICATION` items

## 1. Application Framework and Rendering

**Decision**: Use Next.js (latest stable App Router) with React 19 and TypeScript in strict mode.

**Rationale**: The storefront needs server-rendered catalog and product pages for fast first paint, client interactivity for the cart and fitment finder, and route handlers for checkout. A single Next.js application delivers all three without adding a separate backend. Server Components keep catalog data and the file-store access off the client, while client components are limited to interactive areas.

**Alternatives considered**:
- Vite + React SPA + Express: rejected because it adds a second deployable and loses server rendering benefits for catalog SEO and first paint.
- Remix: viable, but Next.js has broader ecosystem support for the required patterns and deployment targets.
- Astro with islands: good for content, but checkout and cart interactions would require more custom integration.

## 2. Persistence Without a Heavy SQL Database

**Decision**: Use a typed JSON document store in `data/` with atomic temp-file writes and an in-process async mutex. Keep a read-only catalog seed separate from a mutable runtime store containing inventory, orders, and idempotency records. Target a single Node.js instance with a persistent disk.

**Rationale**: The showcase handles 20–40 products, low order volume, and a small number of writes. A JSON store avoids database infrastructure, satisfies the user's no-heavy-SQL constraint, and is easy to inspect during a demo. The mutex plus read-check-write under lock prevents duplicate orders and negative stock in a single-process deployment.

**Alternatives considered**:
- SQLite: technically lightweight and stronger for transactions, but it still introduces a relational/SQL layer that conflicts with the explicit preference to avoid heavy SQL for this MVP.
- PostgreSQL/MySQL: rejected as excessive infrastructure for showcase scale.
- Hosted key-value store: adds an external dependency and network failure mode.
- Browser-only storage for orders: rejected because order records and stock must be server-authoritative.

**Constraint**: The file-store design is not safe for multi-instance or serverless deployments. The MVP must run as one Node process with a persistent volume; a future production release can replace the store module with SQLite or a managed database behind the same repository interface.

## 3. Cart State and Persistence

**Decision**: Keep the cart in a client-side reducer, persist it to `localStorage`, and treat the server as the source of truth for price, stock, fitment, fees, and totals at checkout.

**Rationale**: Checkout is guest-only, so no account or server session is required. The product spec requires cart persistence in the same browser. Client state gives instant quantity and total updates; server validation at checkout prevents stale prices or stock from being trusted.

**Alternatives considered**:
- Server-side cart keyed by a cookie session: more robust across devices but adds session storage and cleanup for no MVP benefit.
- URL-encoded cart state: fragile for larger carts and poor for repeated updates.
- In-memory-only cart: fails the reload/return-visit acceptance scenario.

## 4. Vehicle Fitment Modeling

**Decision**: Model fitment as per-product fitment applications with make, model, year range, and optional engine/variant. Compatibility for a selected vehicle is:
- `compatible` when at least one application covers the selected make/model/year and any selected engine/variant;
- `incompatible` when applications exist but none match;
- `unknown` when the product has no fitment data for that vehicle or the vehicle is outside the prepared data set.

**Rationale**: This supports the chosen full fitment finder and compatibility checks without needing VIN decoding or an external catalog. It keeps seed data readable and testable, and it makes the `unknown` state explicit instead of guessing.

**Alternatives considered**:
- Free-text fitment notes only: rejected by the clarification decision for a full fitment finder.
- A single comma-separated compatibility string: hard to validate and filter reliably.
- External fitment API or VIN decoding: out of scope for the MVP and adds network dependencies and licensing concerns.
- Full universal vehicle database: excessive for a seeded showcase.

## 5. Money and Currency Handling

**Decision**: Store all money as integer Sri Lankan rupee cents (`priceCents`, `subtotalCents`, `deliveryFeeCents`, `grandTotalCents`). Format with `Intl.NumberFormat` for LKR in the UI.

**Rationale**: Integer arithmetic avoids floating-point rounding drift across cart, checkout, confirmation, and order records. A single formatting helper keeps LKR display consistent.

**Alternatives considered**:
- Floating-point LKR values: risk of rounding mismatch.
- Third-party money library: unnecessary for a single currency and simple fee calculation.
- Multi-currency abstraction: explicitly out of scope.

## 6. Delivery Fee

**Decision**: Apply one configurable flat delivery fee (default LKR 500) to every order for the MVP.

**Rationale**: The spec assumes a flat fee. A single fee keeps totals, review, and tests simple and gives the visitor a clear final amount before placing the order.

**Alternatives considered**:
- Location-based fees: requires postal-code mapping and more business rules.
- Free delivery: simpler, but does not exercise the fee and total calculations that the checkout must demonstrate.
- Weight-based shipping: out of scope.

## 7. Simulated Card Payment

**Decision**: Present a clearly labeled demo card step with test card number, expiry, and CVC fields. Validate format (including Luhn and a future expiry) entirely in the browser. Never transmit, log, or persist card values. The server receives only `payment.method = "simulated_card"` after client validation and records a demo payment status.

**Rationale**: This demonstrates a card-style checkout for the showcase while avoiding real payment integration and card-data handling. Keeping card fields out of the server contract is a strong privacy boundary.

**Alternatives considered**:
- Send test card values to the server for validation: rejected because it creates unnecessary sensitive-data handling.
- Stripe test mode or another gateway: rejected because it adds external accounts, keys, and integration beyond the MVP.
- Card button with no fields: rejected because the spec requires a simulated card flow with test fields.

## 8. Idempotency, Stock, and Order Integrity

**Decision**: Generate a UUID idempotency key when checkout begins. The order handler locks the runtime store, checks the idempotency record, revalidates product price and stock, decrements stock, creates the order, and writes the idempotency record in one atomic update. Repeated requests with the same key return the existing order.

**Rationale**: This satisfies duplicate-submission prevention, prevents negative stock, and handles two visitors competing for the last unit in a single-process deployment.

**Alternatives considered**:
- Disabling the submit button only: does not protect against retries or refreshes.
- A database unique constraint: unavailable without a database; the store-level idempotency record provides the equivalent check.
- Reservation at checkout: more complex and unnecessary without a real payment delay.

## 9. Order and Customer Data Retention

**Decision**: Retain order and customer data for 30 days from placement. Purge or anonymize expired records on every store access and through `scripts/purge-expired-orders.ts` for an operator-run scheduled job.

**Rationale**: This meets the clarification decision, limits privacy exposure, and does not require a background worker or database TTL feature. Purging on access guarantees cleanup during normal use; the script covers idle periods.

**Alternatives considered**:
- Background scheduler only: unreliable without a job runner.
- Database TTL index: unavailable without a database.
- Manual deletion: not automatic and easy to forget.
- No retention limit: conflicts with the clarification decision.

## 10. Motion and Visual System

**Decision**: Use Motion (Framer Motion) with shared duration and easing tokens. Limit transitions to opacity and transforms, cap them at 500ms, use spring motion for the cart panel, and disable non-essential animation when `prefers-reduced-motion` is set. Use Tailwind CSS v4 and CSS variables for design tokens, typography, spacing, and surfaces.

**Rationale**: This delivers the requested Apple-inspired feel — restrained motion, clear hierarchy, generous whitespace, and responsive feedback — while keeping performance and accessibility measurable.

**Alternatives considered**:
- CSS transitions only: sufficient for simple states, but awkward for cart orchestration and list transitions.
- GSAP: powerful but heavier than needed for an MVP.
- Heavy scroll-jacking libraries: rejected for usability, performance, and accessibility.
- Copying Apple assets or layouts: explicitly out of scope; only the motion principles are adopted.

## 11. Forms and Validation

**Decision**: Use Zod schemas shared between client and server, with React Hook Form for the checkout form. Validate required fields, email, Sri Lankan phone formats, postal code, quantity bounds, and demo card formats.

**Rationale**: Shared schemas keep client guidance and server enforcement consistent. React Hook Form provides accessible field-level errors without excessive re-rendering.

**Alternatives considered**:
- Ad hoc validation in each component: risks drift between client and server.
- Server-only validation: poor user experience and slower feedback.
- A form framework tied to a specific backend: unnecessary for this stack.

## 12. Testing Strategy

**Decision**: Use Vitest and React Testing Library for unit and component tests, Playwright for critical journeys, and `@axe-core/playwright` for accessibility checks. Cover the file store, order transaction, idempotency, stock decrement, retention boundary, fitment algorithm, money formatting, and the browse-to-buy flow.

**Rationale**: The highest-risk behaviors are server-side state integrity and the interactive checkout. Unit tests cover pure rules, integration tests cover the store and route handlers, and E2E tests prove the user journeys.

**Alternatives considered**:
- Jest: viable, but Vitest is faster to configure with the modern TypeScript/Next.js setup.
- Cypress: heavier for this scope; Playwright covers cross-browser and mobile viewports well.
- Manual testing only: insufficient for stock, idempotency, and retention rules.

## 13. Deployment Target

**Decision**: Target a single Node.js 22 server or container with a persistent disk. Do not target a serverless platform with an ephemeral filesystem for the MVP.

**Rationale**: The JSON runtime store must survive restarts and be writable by the application process. A single instance matches the store's locking model.

**Alternatives considered**:
- Vercel-style serverless: rejected because file writes are not durable and multiple instances would race.
- Managed database plus serverless: would satisfy reliability but violates the no-heavy-SQL MVP direction and adds cost/complexity.
- Static-only deployment: cannot support order creation or stock decrement.

## 14. Search Behavior

**Decision**: Search case-insensitively across product name, description, manufacturer part number, and SKU. Use simple token matching over the in-memory catalog and show a clear empty state.

**Rationale**: Auto-parts shoppers often search by part number or SKU, and the seeded catalog is small enough that in-memory filtering is instant.

**Alternatives considered**:
- Name-only search: misses a common auto-parts lookup method.
- External search engine: unnecessary for 20–40 products.
- Fuzzy matching: can produce confusing results without relevance tuning.

## 15. Accessibility and Responsive Behavior

**Decision**: Target WCAG 2.1 AA for primary flows. Use semantic landmarks, visible focus states, keyboard-operable controls, native form labels, alt text, and Radix Dialog for the cart drawer. Support 360px–1440px layouts with touch targets of at least 44px. Honor reduced motion.

**Rationale**: Accessibility is a stated success criterion, and the cart drawer is the main focus-management risk. Radix provides a proven dialog primitive.

**Alternatives considered**:
- Custom dialog: higher risk of focus-trap and escape-key bugs.
- Desktop-only layout: fails the responsive success criteria.
- Motion-only feedback: fails reduced-motion and non-visual users.

## 16. Images and Perceived Performance

**Decision**: Use local product images with `next/image`, fixed aspect ratios, and intentional placeholders. Provide width/height or aspect-ratio boxes to prevent layout shift.

**Rationale**: The showcase must feel polished and fast. Local images avoid external image-service dependencies, and reserved layout prevents CLS and jarring transitions.

**Alternatives considered**:
- Remote image URLs: adds network dependency and possible broken links.
- Unoptimized full-size images: poor LCP and mobile data use.
- No placeholders: causes layout jumps and broken-image states.

## 17. Security and Privacy Boundaries

**Decision**: No authentication, no real payments, no card-data transmission or storage, no PII in application logs, and a 30-day retention purge. Use unguessable order references and return order details only through the confirmation flow.

**Rationale**: The MVP only needs guest checkout. Minimizing collected data and avoiding sensitive payment data reduces risk and keeps the showcase within scope.

**Alternatives considered**:
- Customer accounts: out of scope and adds credential handling.
- Real payment gateway: out of scope and adds compliance and key-management work.
- Indefinite order storage: conflicts with the retention decision.
