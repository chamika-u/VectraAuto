# Implementation Plan: VectraAuto Storefront MVP

**Branch**: `002-storefront-mvp` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-storefront-mvp/spec.md`

## Summary

Build a showcase-ready VectraAuto storefront that lets a guest shopper discover automobile parts through category browsing, part-number search, and a guided vehicle fitment finder; add parts to a persistent cart; and complete checkout with Cash on Delivery or a clearly labeled simulated card payment. The experience uses restrained Apple-inspired motion, responsive layouts, accessible interactions, and reduced-motion support. Orders are stored with a 30-day retention policy, stock is decremented atomically on successful checkout, and the MVP avoids a heavy SQL server by using a typed, single-instance JSON document store with atomic writes.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode; Node.js 22 LTS

**Primary Dependencies**: Next.js (App Router, latest stable), React 19, Tailwind CSS v4, Motion (Framer Motion), Zod, React Hook Form with `@hookform/resolvers`, `@radix-ui/react-dialog`, `lucide-react`, `async-mutex`, `clsx`, `tailwind-merge`

**Storage**: Typed JSON document store under `data/` with atomic temp-file writes and an in-process write mutex. Read-only catalog seed plus a mutable runtime store for inventory, orders, and idempotency records. No external database server and no heavy SQL.

**Testing**: Vitest + React Testing Library for unit and component tests; Playwright for end-to-end journeys; `@axe-core/playwright` for accessibility checks; store and contract tests run against a temporary JSON store.

**Target Platform**: Modern evergreen browsers on desktop and mobile; Node.js 22 single-instance server or container with a persistent disk.

**Project Type**: Full-stack web application (Next.js App Router with server-only modules and route handlers)

**Performance Goals**: LCP ≤ 2.5s at p75, INP ≤ 200ms at p75, CLS ≤ 0.1; cart updates render within 100ms locally; catalog and cart validation APIs respond within 250ms at p95 for the showcase workload; all motion transitions complete within 500ms.

**Constraints**: Guest checkout only; Cash on Delivery plus a simulated card flow with no real charge; no card data transmitted or stored; no admin UI or authentication; LKR only; English only; 30-day order and customer-data retention; WCAG 2.1 AA target for primary flows; reduced-motion support; single-instance deployment because the MVP store is file-based.

**Scale/Scope**: 20–40 seeded products across 3–5 categories, roughly 12–20 vehicle variants, fewer than 100 concurrent visitors, and fewer than 100 orders per day. No native apps, no multi-currency, no ERP or live supplier integration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The repository constitution (`.specify/memory/constitution.md`) currently contains only template placeholders and no ratified project principles. The feature specification and its explicit constraints therefore act as the planning gates:

- **Stack gate**: JavaScript/TypeScript web application with no heavy SQL — PASS. Next.js + TypeScript + a typed JSON store satisfy the delivery constraint.
- **Scope gate**: Guest browse-to-buy MVP only — PASS. Accounts, admin screens, real payments, and order history are excluded.
- **Payment and privacy gate**: No real charge and no card credentials retained — PASS. Simulated card fields are validated client-side and never transmitted or persisted; only the demo payment method and status reach the server.
- **Retention gate**: Customer and order data deleted or anonymized after 30 days — PASS. Purge runs on store access plus a scheduled cleanup command.
- **Quality gate**: Responsive, accessible, reduced-motion-aware, and measurable — PASS. Performance, accessibility, motion, and responsive targets are defined in the spec and plan.
- **Complexity gate**: Single web application, one storage mechanism, no premature service split — PASS. No complexity exceptions are required.

**Post-Phase 1 re-check**: PASS. The design adds only the minimum server modules for catalog, inventory, orders, retention, and storage; it does not introduce a database server, background queue, or admin surface.

## Project Structure

### Documentation (this feature)

```text
specs/002-storefront-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 decisions and alternatives
├── data-model.md        # Phase 1 entities, relationships, validation
├── quickstart.md        # Phase 1 run and validation guide
├── contracts/           # Phase 1 interface contracts
│   ├── catalog.md
│   ├── cart-validation.md
│   └── orders.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/[reference]/page.tsx
│   └── api/
│       ├── cart/validate/route.ts
│       └── orders/route.ts
├── components/
│   ├── catalog/          # Product grid, cards, search, empty states
│   ├── fitment/          # Vehicle selector, compatibility badges
│   ├── cart/             # Cart drawer, line items, totals
│   ├── checkout/         # Details form, review, demo card fields
│   └── ui/               # Buttons, dialogs, motion primitives, skeletons
├── lib/
│   ├── contracts/        # Shared Zod schemas and result types
│   ├── validation/       # Checkout and cart validation helpers
│   ├── money.ts          # Integer-cent LKR formatting
│   └── motion.ts         # Shared durations, easing, reduced-motion helpers
├── server/
│   ├── catalog/          # Product, category, and fitment queries
│   ├── inventory/        # Stock checks and atomic decrement
│   ├── orders/           # Order creation, references, idempotency
│   ├── retention/        # 30-day purge logic
│   └── storage/          # JSON store, atomic writes, mutex
└── styles/
    └── globals.css       # Tokens, typography, reduced-motion rules

data/
├── catalog.seed.json     # Committed seed catalog and fitment data
└── runtime.store.json    # Generated runtime inventory, orders, idempotency

public/
└── products/             # Local product images and placeholders

scripts/
├── seed.ts               # Validates seed data and initializes runtime store
└── purge-expired-orders.ts

tests/
├── unit/                 # Money, validation, fitment, retention
├── integration/          # Store, API route handlers, order transaction
└── e2e/                  # Playwright browse-to-buy journeys
```

**Structure Decision**: A single Next.js application keeps the storefront, server handlers, and shared validation in one deployable unit. Server-only modules under `src/server` prevent file-store access from leaking into client bundles, while shared Zod contracts under `src/lib/contracts` keep request and response shapes aligned between UI and route handlers. The runtime JSON store is excluded from source control; the catalog seed is versioned.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research Summary

All technical unknowns are resolved in [research.md](./research.md). Key decisions:

- Use Next.js App Router with React Server Components for catalog/detail pages and client components only where interaction requires them.
- Use a typed JSON document store with atomic writes and a single-writer mutex instead of a SQL database or external service.
- Keep the cart client-side with reducer state persisted in `localStorage`; treat the server as the source of truth for price, stock, fitment, and totals at checkout.
- Use Motion for purposeful transitions with shared easing/duration tokens and a global reduced-motion fallback.
- Model fitment as product fitment applications with make/model/year ranges; compatibility is `compatible`, `incompatible`, or `unknown`.
- Use idempotency keys and a locked read-check-write transaction to prevent duplicate orders and negative stock.
- Validate simulated card fields on the client only; transmit only the payment method and demo status to the server.
- Purge expired orders on store access and through an operator-run cleanup script.
- Deploy as a single Node instance with a persistent disk; serverless multi-instance deployment is out of scope for the file-based MVP.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines catalog, vehicle, fitment, inventory, cart, order, payment, and retention entities with validation and state rules.
- [contracts/catalog.md](./contracts/catalog.md) defines catalog URLs, query parameters, and product/fitment view shapes.
- [contracts/cart-validation.md](./contracts/cart-validation.md) defines the server cart validation request and response used to reprice and recheck stock.
- [contracts/orders.md](./contracts/orders.md) defines order placement, idempotency, conflict, and confirmation contracts.
- [quickstart.md](./quickstart.md) documents setup, seeding, run, test, and end-to-end validation scenarios.

## Implementation Strategy

1. **Foundation**: Scaffold Next.js + TypeScript, Tailwind tokens, motion primitives, money utilities, and the JSON store with seed validation.
2. **Catalog and fitment**: Build the home page, catalog grid, search by name/part number/SKU, product detail, vehicle selector, compatibility badges, and empty/unknown states.
3. **Cart**: Build the reducer-backed cart, localStorage persistence/hydration, cart drawer/page, stock-aware quantity controls, and server validation on checkout entry.
4. **Checkout and orders**: Build the details form, review step, COD flow, client-side simulated card flow, order placement transaction, idempotent confirmation, and 30-day purge.
5. **Experience and quality**: Add page/section transitions, cart feedback, responsive polish, keyboard/focus states, reduced-motion behavior, and automated unit, integration, E2E, and accessibility checks.

## Risks and Mitigations

- **File-store concurrency**: Use an in-process mutex, atomic temp-file writes, and revalidation inside the lock; document single-instance deployment.
- **Serverless incompatibility**: Do not target Vercel-style ephemeral/serverless storage for the MVP; use a persistent-disk Node host.
- **Fitment data quality**: Validate seed fitment ranges at startup and in tests; show `unknown` instead of guessing.
- **Simulated card leakage**: Validate test card fields in the browser, never send card values to the server, and log only the payment method.
- **Duplicate orders**: Require a client-generated idempotency key and return the existing order for repeats.
- **Overselling**: Recheck stock under the write lock and decrement only after all items pass.
- **Retention gaps**: Purge on access and provide a scheduled cleanup command with tests at the 30-day boundary.
- **Motion accessibility/performance**: Cap transitions at 500ms, use transform/opacity, and disable non-essential animation under reduced motion.

## Definition of Done

- All spec user stories and acceptance scenarios pass in automated or documented manual tests.
- The seeded catalog, fitment finder, cart, COD checkout, simulated card checkout, order confirmation, and stock decrement work end-to-end.
- Typecheck, lint, unit, integration, E2E, and accessibility checks pass.
- The primary flow works at 360px and 1440px widths, by keyboard only, and with reduced motion enabled.
- Orders older than 30 days are purged or anonymized, and duplicate submissions do not create duplicate orders.
- The quickstart guide can be followed from a clean checkout to a confirmed order.
