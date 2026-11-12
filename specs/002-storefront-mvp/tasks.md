---

description: "Task list for VectraAuto Storefront MVP implementation"
---

# Tasks: VectraAuto Storefront MVP

**Input**: Design documents from `/specs/002-storefront-mvp/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Automated validation tasks are included because the implementation plan and quickstart require them for the stock, idempotency, retention, accessibility, performance, journey-timing, usability, and end-to-end checkout gates.

**Organization**: Tasks are grouped by user story so each story can be implemented, tested, and demonstrated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (`US1`, `US2`, `US3`, `US4`)
- Every task includes an exact file path or a concrete artifact path

## Path Conventions

Single Next.js application at the repository root:

- Application code: `src/`
- Runtime data and seeds: `data/`
- Public assets: `public/products/`
- Operator scripts: `scripts/`
- Tests: `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js application, tooling, and base structure.

- [ ] T001 Initialize the Next.js App Router project with strict TypeScript in `package.json`, `tsconfig.json`, `next.config.ts`, and `src/app/layout.tsx`.
- [ ] T002 Install runtime and development dependencies for Next.js, Tailwind CSS v4, Motion, Zod, React Hook Form, Radix Dialog, Vitest, Playwright, and axe in `package.json`.
- [ ] T003 [P] Configure Tailwind CSS v4, design tokens, typography, and global styles in `src/styles/globals.css` and `postcss.config.mjs`.
- [ ] T004 [P] Configure Vitest and React Testing Library in `vitest.config.ts` and `tests/setup.ts`.
- [ ] T005 [P] Configure Playwright and axe-core in `playwright.config.ts` and `tests/e2e/`.
- [ ] T006 [P] Configure ESLint and formatting rules in `eslint.config.mjs` and `.prettierrc`.
- [ ] T007 Add npm scripts for dev, build, start, lint, typecheck, test, test:e2e, seed, and purge in `package.json`.
- [ ] T008 Create environment and application settings for data paths, delivery fee, and retention in `src/server/config.ts` and `.env.example`.
- [ ] T009 Create `data/`, `public/products/`, `scripts/`, and `tests/` directories and ignore `data/runtime.store.json` in `.gitignore`.
- [ ] T010 Add base app metadata, fonts, global providers, and shell in `src/app/layout.tsx` and `src/app/page.tsx`.

**Checkpoint**: The project builds, lints, and serves a placeholder page.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, storage, seed data, and UI primitives required by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T011 [P] Define shared Zod schemas and TypeScript types for catalog, cart validation, and orders in `src/lib/contracts/catalog.ts`, `src/lib/contracts/cart.ts`, and `src/lib/contracts/orders.ts`.
- [ ] T012 [P] Implement integer-cent money helpers and LKR formatting in `src/lib/money.ts`.
- [ ] T013 [P] Implement motion durations, easing tokens, and reduced-motion helpers in `src/lib/motion.ts`.
- [ ] T014 Implement the typed JSON store with a write mutex, atomic temp-file writes, and load/save helpers in `src/server/storage/json-store.ts`.
- [ ] T015 Implement catalog seed schema validation and loading in `src/server/catalog/seed.ts`.
- [ ] T016 Create the seeded catalog with at least 20 products, 3 categories, prepared vehicles, and fitment applications in `data/catalog.seed.json`.
- [ ] T017 Implement runtime store initialization, reset behavior, and the seed command in `scripts/seed.ts`.
- [ ] T018 Implement the 30-day order and customer retention purge service and CLI in `src/server/retention/purge.ts` and `scripts/purge-expired-orders.ts`.
- [ ] T019 [P] Implement structured server logging with PII and card-data redaction in `src/server/logging/logger.ts`.
- [ ] T020 [P] Implement shared API error responses and a route handler wrapper in `src/server/http/handlers.ts`.
- [ ] T021 [P] Build accessible UI primitives for buttons, badges, dialogs, and skeletons in `src/components/ui/`.
- [ ] T022 Implement catalog repository queries for categories, products, search, and vehicle options in `src/server/catalog/repository.ts`.
- [ ] T023 Implement inventory read queries and availability helpers in `src/server/inventory/repository.ts`.

**Checkpoint**: Seed data loads, the runtime store initializes, and shared types, money, motion, and UI primitives are ready.

---

## Phase 3: User Story 1 - Discover and evaluate automobile parts (Priority: P1) MVP

**Goal**: A visitor can browse categories, search by name or part number, use the vehicle fitment finder, and open a product detail with price, stock, specifications, and compatibility.

**Independent Test**: With the seeded catalog, open the home page, browse a category, search for a product name and part number, select a vehicle, open a compatible product detail, and confirm every decision-making detail is visible without using the cart.

### Implementation for User Story 1

- [ ] T024 [US1] Implement the fitment compatibility resolver for compatible, incompatible, and unknown states in `src/server/catalog/fitment.ts`.
- [ ] T025 [P] [US1] Implement case-insensitive search across name, description, part number, and SKU in `src/server/catalog/search.ts`.
- [ ] T026 [US1] Build the home page with featured categories, featured products, and the fitment finder entry point in `src/app/page.tsx`.
- [ ] T027 [US1] Build the catalog page with category, search, and fitment query parameters and empty states in `src/app/products/page.tsx`.
- [ ] T028 [P] [US1] Build the product card with image, LKR price, availability, and compatibility badge in `src/components/catalog/product-card.tsx`.
- [ ] T029 [P] [US1] Build compatibility badges and unknown/incompatible messaging in `src/components/fitment/compatibility-badge.tsx`.
- [ ] T030 [US1] Build the cascading make/model/year fitment finder with change and clear actions in `src/components/fitment/fitment-finder.tsx`.
- [ ] T031 [US1] Persist the selected vehicle in browser storage and URL search parameters in `src/components/fitment/use-vehicle-selection.ts`.
- [ ] T032 [US1] Build the product detail page with images, specs, fitment summary, price, stock, and compatibility in `src/app/products/[slug]/page.tsx`.
- [ ] T033 [P] [US1] Build the product image gallery with intentional placeholder fallback in `src/components/catalog/product-gallery.tsx`.
- [ ] T034 [US1] Build catalog and product empty and not-found states in `src/components/catalog/empty-state.tsx` and `src/app/not-found.tsx`.
- [ ] T035 [US1] Add semantic page headings, metadata, and accessible labels for home, catalog, and product pages in `src/app/`.
- [ ] T036 [P] [US1] Add unit tests for fitment resolution and search matching in `tests/unit/fitment.test.ts` and `tests/unit/search.test.ts`.
- [ ] T037 [P] [US1] Add E2E coverage for home, category search, part-number search, fitment selection, and product detail in `tests/e2e/catalog-fitment.spec.ts`.

**Checkpoint**: User Story 1 is fully functional and can be demonstrated independently.

---

## Phase 4: User Story 2 - Build and manage a shopping cart (Priority: P2)

**Goal**: A visitor can add parts, change quantities, remove items, see accurate totals, and keep the cart across reloads and return visits in the same browser.

**Independent Test**: Add multiple seeded products, adjust quantities, remove an item, reload the page, return in the same browser, and confirm cart contents, stock limits, and totals are correct.

### Implementation for User Story 2

- [ ] T038 [US2] Implement cart types, reducer actions, and selectors in `src/lib/cart/cart-reducer.ts`.
- [ ] T039 [US2] Implement the cart provider with localStorage persistence, hydration, and storage-unavailable fallback in `src/components/cart/cart-provider.tsx`.
- [ ] T040 [P] [US2] Build the add-to-cart button with stock and fitment warning handling in `src/components/cart/add-to-cart-button.tsx`.
- [ ] T041 [P] [US2] Build cart line items with quantity controls and remove action in `src/components/cart/cart-line-item.tsx`.
- [ ] T042 [P] [US2] Build the cart totals summary with LKR line totals, subtotal, delivery fee, and grand total in `src/components/cart/cart-summary.tsx`.
- [ ] T043 [US2] Build the header cart button, item count, and accessible cart drawer in `src/components/cart/cart-button.tsx` and `src/components/cart/cart-drawer.tsx`.
- [ ] T044 [US2] Build the full cart page with empty and storage-unavailable states in `src/app/cart/page.tsx` and `src/components/cart/cart-empty.tsx`.
- [ ] T045 [US2] Integrate add-to-cart actions into product cards and product detail pages in `src/components/catalog/product-card.tsx` and `src/app/products/[slug]/page.tsx`.
- [ ] T046 [US2] Implement stock-aware quantity clamping, out-of-stock rules, and maximum quantity validation in `src/lib/cart/cart-rules.ts`.
- [ ] T047 [US2] Implement the cart validation service for current price, stock, and fitment in `src/server/cart/validate-cart.ts`.
- [ ] T048 [US2] Implement the cart validation route handler for `POST /api/cart/validate` in `src/app/api/cart/validate/route.ts`.
- [ ] T049 [US2] Implement the cart validation client and restoration hook in `src/lib/client/cart-validation.ts` and `src/components/cart/use-cart-validation.ts`.
- [ ] T050 [US2] Flag fitment mismatches when the selected vehicle changes or clears in `src/components/cart/cart-provider.tsx` and `src/components/cart/cart-line-item.tsx`.
- [ ] T051 [P] [US2] Add unit tests for the cart reducer, persistence, and stock rules in `tests/unit/cart.test.ts`.
- [ ] T052 [P] [US2] Add E2E coverage for add, quantity change, remove, reload persistence, and stock limits in `tests/e2e/cart.spec.ts`.

**Checkpoint**: User Stories 1 and 2 work independently, and the cart survives reloads.

---

## Phase 5: User Story 3 - Complete checkout and receive order confirmation (Priority: P3)

**Goal**: A visitor can complete checkout with Cash on Delivery or a simulated card, receive a unique order reference, decrease stock atomically, and avoid duplicate orders.

**Independent Test**: Starting with a non-empty cart, complete a valid COD checkout and a valid simulated card checkout, verify the confirmation reference and totals, confirm stock decreased exactly once, and verify duplicate submissions return the same order.

### Implementation for User Story 3

- [ ] T053 [US3] Implement order reference generation and idempotency key validation in `src/server/orders/reference.ts`.
- [ ] T054 [US3] Implement atomic inventory decrement with negative-stock protection in `src/server/inventory/decrement.ts`.
- [ ] T055 [US3] Implement the order placement transaction with store lock, revalidation, idempotency, and stock decrement in `src/server/orders/place-order.ts`.
- [ ] T056 [US3] Implement order persistence and confirmation lookup in `src/server/orders/repository.ts`.
- [ ] T057 [US3] Implement the order placement route handler for `POST /api/orders` in `src/app/api/orders/route.ts`.
- [ ] T058 [US3] Implement checkout form schemas and field validation for contact, delivery, vehicle, items, and payment in `src/lib/validation/checkout.ts`.
- [ ] T059 [US3] Build accessible checkout contact and delivery fields with field-level errors in `src/components/checkout/checkout-details-fields.tsx`.
- [ ] T060 [US3] Build the checkout order review with itemized LKR totals and delivery fee in `src/components/checkout/checkout-review.tsx`.
- [ ] T061 [US3] Build the payment method selector for Cash on Delivery and simulated card in `src/components/checkout/payment-method.tsx`.
- [ ] T062 [US3] Build simulated card fields with client-only Luhn, expiry, and CVC validation and a demo notice in `src/components/checkout/simulated-card-fields.tsx`.
- [ ] T063 [US3] Build the checkout page orchestration, idempotency key creation, and submit flow in `src/app/checkout/page.tsx`.
- [ ] T064 [US3] Build the price/stock conflict UI with cart refresh and retry in `src/components/checkout/cart-conflict.tsx`.
- [ ] T065 [US3] Build the order confirmation page with order summary and expired/not-found states in `src/app/orders/[reference]/page.tsx`.
- [ ] T066 [US3] Invoke retention purge on runtime store access and after order placement in `src/server/orders/place-order.ts` and `src/server/storage/json-store.ts`.
- [ ] T067 [US3] Enforce the no-card-data boundary and PII-safe order logging in `src/server/orders/place-order.ts` and `src/server/http/handlers.ts`.
- [ ] T068 [US3] Add the empty-cart checkout guard and flat delivery fee calculation in `src/app/checkout/page.tsx` and `src/server/orders/place-order.ts`.
- [ ] T069 [P] [US3] Add integration tests for the cart validation and order contracts in `tests/integration/contracts.test.ts`.
- [ ] T070 [P] [US3] Add integration tests for stock decrement, last-unit concurrency, idempotency, and 30-day retention in `tests/integration/orders.test.ts`.
- [ ] T071 [P] [US3] Add E2E coverage for COD, simulated card, duplicate submit, and price/stock conflict in `tests/e2e/checkout.spec.ts`.

**Checkpoint**: User Stories 1-3 deliver a complete browse-to-buy MVP with order confirmation.

---

## Phase 6: User Story 4 - Enjoy a fluid, Apple-inspired shopping experience (Priority: P4)

**Goal**: The storefront feels polished and responsive with purposeful motion, accessible interaction, keyboard support, and reduced-motion behavior.

**Independent Test**: Traverse home, product detail, cart, and checkout on desktop and mobile with motion enabled, then repeat with reduced motion and keyboard only; confirm transitions are smooth, input is never blocked, and all primary actions are reachable.

### Implementation for User Story 4

- [ ] T072 [US4] Build the shared page and view transition wrapper with Motion in `src/components/ui/page-transition.tsx` and `src/app/template.tsx`.
- [ ] T073 [P] [US4] Build reusable reveal and stagger primitives for sections and product grids in `src/components/ui/reveal.tsx`.
- [ ] T074 [US4] Add product image and gallery transitions with stable layout in `src/components/catalog/product-gallery.tsx`.
- [ ] T075 [US4] Add cart drawer, cart count, and line-item animations in `src/components/cart/cart-drawer.tsx` and `src/components/cart/cart-button.tsx`.
- [ ] T076 [US4] Add hover, tap, and focus-visible feedback to interactive components in `src/components/ui/button.tsx` and `src/styles/globals.css`.
- [ ] T077 [US4] Apply reduced-motion handling to every animated component in `src/lib/motion.ts` and `src/components/`.
- [ ] T078 [US4] Add responsive breakpoints and primary touch targets of at least 44x44 CSS pixels for 360px-1440px in `src/styles/globals.css` and `src/components/`.
- [ ] T079 [US4] Add keyboard and focus management for the cart drawer, fitment finder, and checkout in `src/components/cart/cart-drawer.tsx`, `src/components/fitment/fitment-finder.tsx`, and `src/components/checkout/`.
- [ ] T080 [US4] Add semantic landmarks, form labels, image alt text, and WCAG 2.1 AA contrast fixes (4.5:1 normal text, 3:1 large text and UI components) in `src/app/layout.tsx` and `src/components/`.
- [ ] T081 [US4] Add loading skeletons and stable image placeholders for catalog, cart, and checkout in `src/components/ui/skeleton.tsx` and `src/components/catalog/`.
- [ ] T082 [P] [US4] Add E2E checks for responsive layouts, keyboard journeys, reduced motion, 44x44 CSS pixel touch targets, and axe accessibility with zero critical or serious WCAG 2.1 AA violations in `tests/e2e/experience.spec.ts`.

**Checkpoint**: The complete storefront is polished, responsive, keyboard-accessible, and reduced-motion-safe.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, operational readiness, and final validation across all stories.

- [ ] T083 Add app-level error boundaries and a global error page in `src/app/error.tsx` and `src/app/global-error.tsx`.
- [ ] T084 [P] Add performance tuning for fonts, images, prefetching, and layout stability in `src/app/layout.tsx` and `next.config.ts`.
- [ ] T085 [P] Document setup, seeding, reset, purge, deployment, and demo steps in `README.md` and `docs/`.
- [ ] T086 [P] Perform a security and privacy review for card-data isolation, PII logging, and retention behavior in `src/server/`.
- [ ] T087 Run the lint and typecheck scripts defined in `package.json` and fix all findings in `src/`.
- [ ] T088 Run the unit, integration, E2E, performance, and accessibility suites defined in `tests/` and fix all failures.
- [ ] T089 Execute the manual validation scenarios in `specs/002-storefront-mvp/quickstart.md` and verify all expected outcomes.
- [ ] T090 Audit FR-001 through FR-034 and SC-001 through SC-017 in `specs/002-storefront-mvp/spec.md` and close any implementation gaps.
- [ ] T091 Verify cart and vehicle persistence plus the 30-day retention boundary in `data/runtime.store.json` and `src/server/retention/`.
- [ ] T092 Verify no duplicate orders and no negative stock under repeated and concurrent submissions in `tests/integration/orders.test.ts`.
- [ ] T093 Verify 360px and 1440px layouts, keyboard-only checkout, and reduced-motion behavior across `src/components/`.
- [ ] T094 Prepare the final showcase demo catalog and reset flow in `data/catalog.seed.json` and `scripts/seed.ts`.
- [ ] T095 [P] Add automated LCP and CLS checks for the home, catalog, and product detail views over repeated mobile and desktop Playwright runs, asserting LCP ≤ 2.5s and CLS ≤ 0.1 in `tests/e2e/performance.spec.ts`.
- [ ] T096 [P] Add automated journey timing instrumentation for representative discovery-to-product and product-to-confirmation runs to validate SC-001, SC-002, and SC-014 in `tests/e2e/usability-timing.spec.ts`.
- [ ] T097 Run moderated usability validation with 5 first-time participants and record SC-012 completion rate plus SC-001 and SC-002 task times in `docs/usability-validation.md`.
- [ ] T098 Record the automated performance and usability timing evidence, including test environment and observed thresholds, in `docs/validation-evidence.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phases 3-6)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational. Uses catalog data from US1 but can be tested with seeded product fixtures. Builds its own cart validation route.
- **User Story 3 (P3)**: Starts after US2 because it consumes the cart and cart validation contract. Uses US1 catalog data. Can be developed against a seeded cart if US2 UI is incomplete.
- **User Story 4 (P4)**: Motion primitives can start after Foundational, but final validation depends on US1-US3 screens.

### Within Each User Story

- Shared schemas and server rules before UI integration.
- Data access before route handlers.
- Route handlers before client submission flows.
- Core implementation before animation and polish.
- Story complete and validated before moving to the next priority.

### Parallel Opportunities

- Setup: T003, T004, T005, and T006 can run in parallel after project initialization.
- Foundational: T011, T012, T013, T019, T020, and T021 can run in parallel.
- US1: T028, T029, T033, T036, and T037 can run in parallel once the catalog repository and UI primitives exist.
- US2: T040, T041, T042, T051, and T052 can run in parallel once the cart reducer and provider exist.
- US3: T069, T070, and T071 can run in parallel after the order route and checkout UI contracts are stable.
- US4: T073 and T082 can run in parallel with the remaining UI polish.
- Polish: T084, T085, T086, T095, T096, and T098 can run in parallel once the relevant screens are stable; T097 depends on a demonstrable browse-to-buy flow.

---

## Parallel Example: User Story 1

```text
Task: "Build product card in src/components/catalog/product-card.tsx"
Task: "Build compatibility badge in src/components/fitment/compatibility-badge.tsx"
Task: "Build product image gallery in src/components/catalog/product-gallery.tsx"
Task: "Add fitment and search unit tests in tests/unit/fitment.test.ts and tests/unit/search.test.ts"
```

## Parallel Example: User Story 2

```text
Task: "Build add-to-cart button in src/components/cart/add-to-cart-button.tsx"
Task: "Build cart line item in src/components/cart/cart-line-item.tsx"
Task: "Build cart summary in src/components/cart/cart-summary.tsx"
Task: "Add cart unit tests in tests/unit/cart.test.ts"
```

## Parallel Example: User Story 3

```text
Task: "Add contract integration tests in tests/integration/contracts.test.ts"
Task: "Add order transaction tests in tests/integration/orders.test.ts"
Task: "Add checkout E2E tests in tests/e2e/checkout.spec.ts"
```

## Parallel Example: User Story 4

```text
Task: "Build reveal primitives in src/components/ui/reveal.tsx"
Task: "Add experience E2E checks in tests/e2e/experience.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the catalog, search, and fitment experience independently.
5. Deploy or demo the discovery MVP.

### Buyable MVP (User Stories 1-3)

1. Add User Story 2 to enable cart management and persistence.
2. Add User Story 3 to enable COD and simulated card checkout, stock decrement, and order confirmation.
3. Validate the full browse-to-buy journey with the quickstart scenarios.
4. This is the recommended MVP scope for the showcase.

### Full Experience (User Story 4)

1. Add the motion system, responsive polish, keyboard support, and reduced-motion behavior.
2. Validate at 360px and 1440px, by keyboard only, and with reduced motion enabled.
3. Run the accessibility checks and finalize the showcase demo.

### Parallel Team Strategy

With multiple developers after Foundational:

1. Developer A: User Story 1 (catalog and fitment).
2. Developer B: User Story 2 (cart).
3. Developer C: User Story 3 (checkout and orders) once the cart contract is stable.
4. Developer D: User Story 4 (motion, responsive, accessibility) applied incrementally.

---

## Notes

- `[P]` tasks touch different files and can run concurrently.
- Story labels map tasks to the spec user stories for traceability.
- Tests are verification tasks in this plan; if a strict TDD workflow is desired, move each test task ahead of its implementation tasks.
- Keep `data/runtime.store.json` out of version control.
- Maintain the no-card-data boundary: simulated card fields never leave the browser.
- Do not deploy the file-based store to a multi-instance serverless environment.
- Stop at each checkpoint to validate the story independently.
