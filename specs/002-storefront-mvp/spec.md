# Feature Specification: VectraAuto Storefront MVP

**Feature Branch**: `002-storefront-mvp`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "create an mvp for the proposed web application for vectraauto e commerce system where online store sells automobile parts. use javascript typescript as techstack and dont use heavy sql on this project. i want to create the mvp for now where customers could see and buy products from the website. create the mvp for the showcase website and use modern transitions, like in apple design, there should be a shopping cart and checkout."

## Clarifications

### Session 2026-11-12

- Q: Should shoppers be able to filter parts by their vehicle (make/model/year), or should the MVP only show fitment notes on each product? → A: Full fitment finder — guided vehicle selection with a saved vehicle and compatibility checks across the catalog.
- Q: Should the MVP checkout use Cash on Delivery only, or also include a simulated card payment step for the showcase? → A: Cash on Delivery plus a clearly labeled simulated card payment flow that never processes a real charge.
- Q: How long should the showcase MVP keep customer contact details and order records? → A: Automatically delete or anonymize order and customer data after 30 days.
- Q: Should placing an order reduce the available stock for each product, or is stock display-only for the MVP? → A: Decrement available stock when an order is placed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and evaluate automobile parts (Priority: P1)

A visitor arrives at the VectraAuto storefront, browses parts by category, searches for a specific part, or selects their vehicle by make, model, and year to see compatible parts, then opens a product page to review images, price, availability, description, specifications, and a clear compatibility result before deciding whether to buy.

**Why this priority**: Product discovery is the entry point for every purchase. Without a clear, trustworthy catalog, fitment finder, and product detail experience, the store cannot sell anything.

**Independent Test**: With a seeded catalog and fitment data, a visitor can move from the storefront home page to a category, search result, or vehicle-based result, open a product detail page, and see every decision-making detail, including whether the part fits the selected vehicle, without needing the cart or checkout.

**Acceptance Scenarios**:

1. **Given** the storefront has a seeded catalog, **When** a visitor opens the home page, **Then** they see featured categories, the vehicle fitment finder entry point, and product cards showing at least the product name, image, price in LKR, and availability.
2. **Given** a visitor selects a category or enters a search term, **When** results are shown, **Then** only matching parts are listed and a clear empty-state message appears when there are no matches.
3. **Given** a visitor uses the fitment finder, **When** they choose a make, model, and year and confirm the selection, **Then** the catalog identifies compatible parts, shows compatibility status on product cards, and keeps the selected vehicle available while browsing.
4. **Given** a vehicle is selected, **When** the visitor changes or clears it, **Then** compatibility results and filtering update immediately and the visitor can browse the full catalog again.
5. **Given** a visitor selects a product card, **When** the product detail page opens, **Then** it shows product images, description, specifications, structured fitment details, price, stock status, and the compatibility result for the selected vehicle.
6. **Given** a product is unavailable, **When** its detail page opens, **Then** the unavailable state is clearly shown and adding it to the cart is not possible.
7. **Given** a product link is invalid or a product no longer exists, **When** the visitor follows it, **Then** they see a friendly not-found message with a path back to the catalog.

---

### User Story 2 - Build and manage a shopping cart (Priority: P2)

A visitor adds one or more parts to a shopping cart, reviews the selection, changes quantities, removes items, and sees an accurate subtotal and total before moving to checkout. The cart survives page reloads and return visits in the same browser.

**Why this priority**: The cart is where purchase intent is assembled. It must be reliable and transparent before checkout can be trusted.

**Independent Test**: Add several products, change quantities, remove items, reload the page or return later, and confirm that the cart contents, quantities, line totals, and order totals remain correct.

**Acceptance Scenarios**:

1. **Given** a product is available, **When** the visitor adds it to the cart from a product card or detail page, **Then** the item appears in the cart, the cart item count updates, and visible feedback confirms the action.
2. **Given** the cart contains items, **When** the visitor changes a quantity, **Then** the line total, subtotal, delivery fee, and grand total recalculate immediately.
3. **Given** the cart contains items, **When** the visitor removes an item, **Then** the cart and totals update and an empty-cart message appears when no items remain.
4. **Given** a requested quantity exceeds available stock, **When** the visitor attempts to add or increase it, **Then** the quantity is limited or rejected with a clear message.
5. **Given** the cart contains items, **When** the visitor reloads the page or returns in the same browser, **Then** the cart is restored with current prices and availability.
6. **Given** a previously added product is no longer available or its price changed, **When** the cart is restored, **Then** the affected item is clearly flagged and the visitor can remove or update it.

---

### User Story 3 - Complete checkout and receive order confirmation (Priority: P3)

A visitor proceeds from the cart to checkout, enters contact and delivery details, reviews the order, chooses Cash on Delivery or a clearly labeled simulated card payment, and places the order. The system validates the details, records the order, shows a confirmation with a unique reference and order summary, and clears the cart.

**Why this priority**: Checkout converts intent into a recorded order. It is the final step that makes the MVP a functioning store rather than a catalog demo.

**Independent Test**: Starting with a non-empty cart, complete a valid Cash on Delivery checkout and a valid simulated card checkout, confirm that a unique reference and accurate order summary are shown in both cases, verify that the order was recorded, and confirm that the cart is empty afterward.

**Acceptance Scenarios**:

1. **Given** the cart contains at least one item, **When** the visitor starts checkout, **Then** they can provide full name, phone number, email address, delivery address, city, postal code, optional delivery notes, and choose Cash on Delivery or simulated card payment.
2. **Given** required details are missing or invalid, **When** the visitor attempts to place the order, **Then** the order is blocked and each invalid field shows a specific, understandable message.
3. **Given** the visitor chooses simulated card payment, **When** the payment step appears, **Then** it is clearly labeled as a demo, presents test card fields, validates their presence and format, and warns that no real payment will be taken.
4. **Given** all details are valid, **When** the visitor places the order, **Then** the system shows a confirmation page with a unique order reference, itemized products and quantities, delivery details, payment method, and the final LKR total.
5. **Given** a simulated card payment is used, **When** the order is confirmed, **Then** no real charge occurs, no card credentials are stored, and the confirmation identifies the payment as simulated rather than completed.
6. **Given** an order was placed successfully, **Then** the cart is emptied and refreshing or resubmitting the confirmation does not create a duplicate order.
7. **Given** an order was placed successfully, **Then** a stored order record contains the reference, customer contact details, delivery details, ordered items, quantities, unit prices, totals, payment method, payment status, order status, and timestamp.
8. **Given** an order is accepted, **When** it is recorded, **Then** available stock decreases by the ordered quantity for each item, no stock value becomes negative, and products that reach zero become unavailable.
9. **Given** product price or stock changed after the item was added to the cart, **When** checkout is submitted, **Then** the system revalidates the order and informs the visitor of any change before the order is accepted.
10. **Given** a checkout submission fails because of a network or temporary system problem, **When** the failure is reported, **Then** the cart and entered details are preserved and the visitor can retry.

---

### User Story 4 - Enjoy a fluid, Apple-inspired shopping experience (Priority: P4)

A visitor experiences a polished, responsive storefront with purposeful motion: smooth page and section reveals, graceful image transitions, an animated cart panel, subtle hover and tap feedback, and consistent easing across desktop and mobile. Visitors who prefer reduced motion receive a calmer, still-clear experience.

**Why this priority**: The showcase storefront must feel premium and trustworthy. Motion and responsiveness differentiate VectraAuto, but they enhance rather than replace the core browse-to-buy flow.

**Independent Test**: Traverse the home page, product detail, cart, and checkout on desktop and mobile with motion enabled, then repeat with reduced-motion enabled, and confirm that transitions are smooth, input is never blocked, and all primary actions remain reachable.

**Acceptance Scenarios**:

1. **Given** the visitor navigates between catalog and product detail, **When** the view changes, **Then** content transitions smoothly without abrupt jumps or blocking input.
2. **Given** the visitor adds a product to the cart, **When** the cart updates, **Then** the cart panel or count animates into view and the change is visibly and accessibly announced.
3. **Given** a mobile viewport, **When** the visitor browses products and completes checkout, **Then** primary actions are reachable without horizontal scrolling and touch targets are comfortably sized.
4. **Given** the visitor prefers reduced motion, **When** any non-essential animation would occur, **Then** motion is minimized or removed while essential state feedback remains clear.
5. **Given** the visitor uses only a keyboard, **When** they browse, add to cart, and check out, **Then** focus order is logical, focus is always visible, and no action is trapped or unreachable.

---

### Edge Cases

- The visitor opens checkout with an empty cart: checkout must be blocked and the visitor redirected to the catalog or cart with a clear explanation.
- A product goes out of stock or is removed while it is in the cart: the cart must flag it and prevent checkout until the visitor removes or replaces it.
- A quantity becomes zero, negative, fractional, or unrealistically large: the system must reject or normalize it and explain the allowed range.
- Two visitors attempt to buy the last available unit at the same time: only one order may consume it, and the other visitor must be told before the order is accepted.
- The same order is submitted twice in quick succession: only one order must be recorded and one confirmation shown.
- Browser storage is unavailable or cleared: the visitor must still be able to shop, with a clear explanation that the cart cannot be remembered.
- Product images fail to load or load slowly: the storefront must show a stable placeholder and preserve layout without blocking interaction.
- Search returns no results: the visitor must see a helpful empty state with a way to clear filters and return to all products.
- The selected vehicle has no compatible parts, or the vehicle selection is incomplete: the visitor must see a clear empty or guidance state with an option to change or clear the vehicle.
- A product has no fitment data for the selected vehicle: the compatibility result must be labeled as unknown rather than incorrectly shown as compatible or incompatible.
- The visitor changes or clears the selected vehicle after adding parts to the cart: the cart must flag any possible fitment mismatch without silently removing items.
- A simulated card payment is rejected: the order must not be recorded as paid, the visitor must be able to retry or switch to Cash on Delivery, and no card details may be retained.
- An order or customer record reaches the 30-day retention limit: the data must be deleted or anonymized automatically, and the deletion must not affect the visitor's current shopping session.
- Prices or fees do not divide evenly: displayed LKR amounts must remain consistent across product, cart, checkout, and confirmation.
- The checkout form is used on a small screen with an on-screen keyboard: the active field and primary action must remain reachable.
- The visitor enables reduced motion or uses an older or low-powered device: the experience must remain usable and free of distracting motion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a storefront home page with the VectraAuto brand, primary navigation, featured categories, and featured products.
- **FR-002**: The system MUST allow visitors to browse the catalog by category and search products by name, keyword, manufacturer part number, or SKU, with clear empty states when no matches exist.
- **FR-003**: The system MUST display product cards containing at least the product name, image or placeholder, price in LKR, and availability status.
- **FR-004**: The system MUST provide a product detail view with multiple images where available, description, specifications, structured fitment details, price, stock status, and the compatibility result for the selected vehicle.
- **FR-005**: Visitors MUST be able to browse products and complete a purchase without creating an account or signing in.
- **FR-006**: Visitors MUST be able to add available products to the cart from product cards and product detail views, with immediate visible feedback and an updated cart item count.
- **FR-007**: The cart MUST allow visitors to review items, change quantities, remove items, and see line totals, subtotal, delivery fee, and grand total.
- **FR-008**: The cart MUST persist across page reloads and return visits within the same browser, and MUST flag items whose price or availability changed.
- **FR-009**: The system MUST prevent visitors from adding more units than are available and MUST prevent unavailable products from being added to the cart.
- **FR-010**: The system MUST allow checkout only when the cart contains at least one valid item, and MUST collect full name, phone number, email address, delivery address, city, postal code, optional delivery notes, and payment method.
- **FR-011**: The system MUST validate required checkout fields and common formats, block submission when validation fails, and show field-level guidance.
- **FR-012**: The checkout MUST offer Cash on Delivery and a clearly labeled simulated card payment flow, and MUST NOT capture, transmit, store, or process real card or bank credentials or make a real charge.
- **FR-013**: The checkout MUST include an order review showing each item, quantity, unit price, line total, delivery fee, and final grand total in LKR before the visitor places the order.
- **FR-014**: The system MUST revalidate product price and availability at order placement and MUST inform the visitor when the order differs from what was reviewed.
- **FR-015**: The system MUST generate a unique order reference and display a confirmation containing the reference, ordered items, delivery details, payment method, and final total.
- **FR-016**: The system MUST record each placed order with its reference, customer contact details, delivery details, any selected vehicle details, item and quantity details, unit prices, totals, payment method, payment status, order status, and timestamp.
- **FR-017**: The system MUST clear the cart after a successful order and MUST prevent duplicate orders from repeated submission or page refresh.
- **FR-018**: The system MUST preserve the cart and any entered checkout details when submission fails, and MUST allow the visitor to retry.
- **FR-019**: The storefront MUST use a consistent motion system for page transitions, content reveals, cart interactions, image transitions, and hover or tap feedback, without blocking input.
- **FR-020**: The storefront MUST respect the visitor's reduced-motion preference by minimizing or removing non-essential animation while preserving clear state feedback.
- **FR-021**: The storefront MUST be responsive from small mobile screens through desktop, without horizontal scrolling or unreachable primary actions.
- **FR-022**: The storefront MUST support keyboard-only navigation with logical focus order, visible focus states, meaningful labels, alternative text for images, and sufficient color contrast.
- **FR-023**: The system MUST provide friendly, actionable messages for invalid product links, empty search results, unavailable products, failed images, validation errors, and failed submissions.
- **FR-024**: The system MUST display prices, delivery fees, and totals in Sri Lankan rupees using a consistent LKR format across all shopping views.
- **FR-025**: The system MUST show accurate cart and order totals at all times, where the grand total equals the sum of line totals plus the delivery fee.
- **FR-026**: The system MUST provide a guided vehicle fitment finder that lets visitors select a vehicle by make, model, and year, with engine or variant selection where fitment data supports it.
- **FR-027**: The system MUST retain the selected vehicle across page reloads and return visits within the same browser and MUST allow the visitor to change or clear it at any time.
- **FR-028**: The system MUST use structured fitment data to mark each product as compatible, incompatible, or unknown for the selected vehicle, and MUST allow the visitor to filter the catalog to compatible parts.
- **FR-029**: When a selected vehicle is present, the system MUST warn the visitor before adding an incompatible product to the cart and MUST NOT present a product with unknown fitment as compatible.
- **FR-030**: When an order is placed with a selected vehicle, the order record MUST include the vehicle details used for the purchase so the order can be verified during fulfillment.
- **FR-031**: When simulated card payment is selected, the system MUST collect test card fields, validate their presence and format, display a demo-payment notice, and accept the payment only as a simulation.
- **FR-032**: The order review and confirmation MUST identify the chosen payment method and MUST label simulated card payments as demo payments rather than completed real payments.
- **FR-033**: The system MUST automatically delete or anonymize stored customer contact, delivery, vehicle, and order data after 30 days from order placement.
- **FR-034**: The system MUST decrease available stock by the ordered quantity after a successful order, MUST prevent stock from becoming negative, and MUST show products with zero stock as unavailable.

### Key Entities *(include if feature involves data)*

- **Product**: An automobile part offered for sale, with a unique identifier or SKU, manufacturer part number, name, description, images, category, price in LKR, available stock quantity, specifications, and structured fitment data.
- **Category**: A grouping of related parts used for browsing and filtering, with a name, description, and optional image.
- **Vehicle Profile**: A visitor's selected vehicle, identified by make, model, year, and optional engine or variant; it is saved for the same browser and can be changed or cleared.
- **Fitment Compatibility**: The relationship between a product and a vehicle profile, with a status of compatible, incompatible, or unknown and any supporting fitment notes.
- **Cart**: A visitor's current selection of products before checkout, containing cart items, an optional selected vehicle context, and calculated totals; it persists for the same browser without requiring an account.
- **Cart Item**: A product selected for purchase, with the product reference, quantity, unit price, and line total.
- **Customer Contact**: The name, phone number, and email address provided by the visitor for order communication.
- **Delivery Details**: The address, city, postal code, and optional delivery notes for fulfilling the order.
- **Payment Summary**: The chosen payment method (Cash on Delivery or simulated card), its demo or pending status, and no stored card credentials.
- **Order**: A recorded purchase containing a unique reference, customer contact, delivery details, any selected vehicle details, ordered items, quantities, prices, delivery fee, grand total, payment summary, order status, and timestamp; personal and order data is deleted or anonymized 30 days after placement.
- **Order Item**: A snapshot of a purchased product at the time of order, including product reference, name, quantity, unit price, line total, and compatibility status at the time of purchase.
- **Money Amount**: A price, fee, or total expressed in LKR and displayed consistently across product, cart, checkout, and confirmation views.

### Out of Scope

- Administrator or staff screens for creating, editing, or deleting products; the showcase catalog is seeded with prepared product data.
- Customer accounts, profiles, saved addresses, wishlists, order history, ratings, reviews, and recommendations.
- Real payment processing, card storage, refunds, and bank integrations; the MVP demonstrates checkout with Cash on Delivery and a simulated card flow.
- Transactional email or SMS delivery; order confirmation is shown on screen.
- Multi-currency pricing, tax engines, complex shipping rules, coupons, and promotions.
- ERP, warehouse, supplier, or live inventory integrations.
- VIN decoding, license-plate lookup, and external vehicle or fitment data services; the fitment finder uses prepared data for the seeded vehicle set.
- Vehicle profiles synchronized across devices or browsers.
- Native mobile applications and multi-language storefronts.
- Heavy relational database infrastructure; the MVP uses lightweight data storage appropriate to a showcase-scale catalog and order volume.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can locate a specific part through category browsing, search, or the fitment finder and open its product detail in under 60 seconds.
- **SC-002**: A first-time visitor can move from product discovery to a completed order confirmation in under 3 minutes.
- **SC-003**: At least 95% of catalog and product detail views show primary content within 2.5 seconds on a typical broadband and mobile connection.
- **SC-004**: 100% of cart updates reflect in under 1 second, and every displayed grand total equals the sum of line totals plus the delivery fee.
- **SC-005**: 100% of checkout attempts with missing or invalid required details are blocked with a specific field-level message.
- **SC-006**: 100% of successful orders display a unique reference and are recorded, with the cart cleared and no duplicate order created by refresh or resubmission.
- **SC-007**: A cart is retained for at least 7 days in the same browser across reloads and return visits, with any unavailable item clearly flagged on return.
- **SC-008**: All primary shopping flows are usable from 360px to 1440px screen widths with no horizontal scrolling and no unreachable actions.
- **SC-009**: A keyboard-only visitor can complete the full browse, cart, and checkout journey with visible focus at every step.
- **SC-010**: Motion transitions complete within 0.5 seconds, never block input, and honor the reduced-motion preference on 100% of animated elements.
- **SC-011**: The showcase catalog contains at least 20 products across at least 3 categories, and all catalog links and product images resolve or show intentional fallbacks.
- **SC-012**: In moderated usability testing with 5 first-time users, at least 4 can complete a purchase without assistance.
- **SC-013**: With a vehicle selected, 100% of seeded products with fitment data show the correct compatible, incompatible, or unknown status, and the selected vehicle is retained for at least 7 days in the same browser.
- **SC-014**: A first-time visitor can select a vehicle and reach a compatible product in under 60 seconds.
- **SC-015**: 100% of simulated card checkouts are clearly labeled as demo payments, make no real charge, and retain zero card credentials.
- **SC-016**: 100% of customer and order records older than 30 days are automatically deleted or anonymized, with zero personal data remaining after the retention period.
- **SC-017**: Every successful order reduces stock exactly once, no stock quantity becomes negative, and 100% of zero-stock products are shown as unavailable and cannot be added to the cart.

## Assumptions

- The primary market is Sri Lanka and all prices are displayed in Sri Lankan rupees (LKR), consistent with the VectraAuto business proposal.
- The MVP supports guest checkout only; customer accounts and sign-in are not required.
- The showcase MVP supports Cash on Delivery and a simulated card payment flow; no real payment gateway is integrated, no real charge is made, and simulated card details are not persisted.
- The catalog is prepared and seeded ahead of the demo; product and order administration screens are not part of this MVP.
- Structured fitment data is prepared for the seeded makes, models, years, and products; vehicles or products outside that prepared set are shown as unknown until data is added.
- The vehicle fitment finder uses a guided make, model, and year selection, with engine or variant selection only where the prepared data supports it.
- A single flat delivery fee applies at checkout, and the exact logistics rules may be refined after the MVP.
- The cart and selected vehicle are stored and restored within the same browser and are not synchronized across devices or browsers.
- Order confirmation is shown on screen only; transactional email and SMS are deferred.
- Customer and order data is retained for 30 days after order placement, then automatically deleted or anonymized; no external party receives it.
- Inventory values are simple numeric stock quantities that decrease when an order is placed and are manually restocked for the showcase; there is no live synchronization with suppliers or warehouses.
- The storefront is delivered in English only and targets modern evergreen browsers on desktop and mobile.
- The user-supplied delivery constraint is respected: the MVP is built with a JavaScript/TypeScript web stack and avoids heavy SQL or relational database infrastructure, using lightweight data storage appropriate to showcase scale.
- "Apple-inspired" motion means restrained, purposeful transitions, generous whitespace, clear hierarchy, and consistent easing; it does not mean copying Apple assets, layouts, or proprietary design elements.
- Product photography may be represented by prepared images or intentional placeholders when real images are unavailable.
