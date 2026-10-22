# Phase 1 Data Model: VectraAuto Business Proposal

**Feature**: `001-vectraauto-business-proposal`
**Date**: 2026-10-22

This is a document-content model, not a database schema. It defines the entities the proposal must contain, their fields, relationships, and validation rules. Each entity maps to one or more functional requirements in [spec.md](./spec.md).

## Entity Overview

```text
ProposalDocument
├── DocumentMetadata
├── Section (ordered, 12+ instances)
├── BusinessProfile
├── MarketSegment (1..n)
├── CompetitorProfile (2..n)
├── DigitalInitiative (3..n)
├── FinancialAssumption (1..n)
├── FinancialStatement (4 instances)
└── Placeholder (0..n)
```

## Entities

### ProposalDocument

The complete deliverable and its presentation metadata.

| Field | Type | Rules |
|-------|------|-------|
| title | string | Must contain "VectraAuto" and "Business Proposal" |
| version | string | Starts at `1.0`; increments on material revision |
| completion_date | date | ISO 8601; may be a labeled placeholder before submission |
| confidentiality_statement | string | Required on the title page |
| brand_name | string | Exactly `VectraAuto` everywhere |
| currency | string | Exactly `LKR` for all monetary values |
| language | string | English |
| table_of_contents | boolean | Must be present and match the section list |

**Relationships**: Owns all `Section` instances, four `FinancialStatement` instances, and any `Placeholder` instances.

**Validation**: All 11 required sections plus digital innovation are present in the prescribed order. No conflicting brand spellings. No unresolved ambiguous placeholders.

### DocumentMetadata

Title-page and ownership information.

| Field | Type | Rules |
|-------|------|-------|
| company_name | string | `VectraAuto` |
| founder_name | string | Actual value or `[PLACEHOLDER: founder name — owner: founder]` |
| contact_details | string | Address, phone, email; placeholder allowed if not yet available |
| logo | image reference | `docs/assets/` path or labeled logo placeholder |
| legal_form | string | Limited Liability Company (LLC) |
| location | string | Sri Lankan city/region or labeled placeholder |
| audit_or_review_status | string | Optional; state if the plan has been reviewed |

### Section

A numbered part of the proposal. Each section has a fixed identity from the contract.

| Field | Type | Rules |
|-------|------|-------|
| id | string | Stable ID from [proposal-contract.md](./contracts/proposal-contract.md), e.g. `S04` |
| number | integer | Sequential in document order |
| title | string | Matches the contract title |
| purpose | string | One sentence describing what the section must establish |
| required | boolean | All contract sections are required |
| word_target | range | Executive summary 5–10% of main body; other sections proportionate |
| content | Markdown | Non-empty; satisfies the section's FR mapping |
| evidence_or_assumptions | list | Citations, estimates, or stated assumptions used |

**State transitions**: `Draft` → `Content Complete` → `Validated` → `Exported`. A section cannot be `Validated` while it contains an unlabeled placeholder.

### BusinessProfile

The company description and strategic identity.

| Field | Type | Rules |
|-------|------|-------|
| mission | string | States who is served, what is provided, and the approach |
| vision | string | Describes the desired future state and inspires the team |
| problem | string | Fragmented, slow, error-prone parts sourcing |
| solution | string | Digital marketplace with accurate fitment and fast delivery |
| customers | list | B2C DIY owners (primary), B2B repair garages (secondary) |
| status | enum | `startup` |
| financial_status | string | Pre-revenue / early-stage, described honestly |
| history | string | Brief organizational introduction |

**Validation**: Mission and vision are distinct; the problem and solution are explicitly linked; customer priority matches FR-021.

### MarketSegment

A target group within the Sri Lankan market.

| Field | Type | Rules |
|-------|------|-------|
| name | string | e.g. DIY car owners, independent repair garages |
| type | enum | `demographic`, `geographic`, `behavioral`, `psychographic` |
| priority | enum | `primary` (exactly one B2C segment) or `secondary` |
| size_volume | number + unit | Registered vehicles, households, or repair shops |
| size_value | LKR amount | Market value attributable to the segment, or labeled estimate |
| demographics | string | Age, income, vehicle type, location as applicable |
| drivers_of_demand | list | Why the segment buys |
| needs | list | What problem the segment needs solved |

**Validation**: At least one primary and one secondary segment; volume and value both present; estimate method stated when data is not sourced.

### CompetitorProfile

A current or potential competitor.

| Field | Type | Rules |
|-------|------|-------|
| name_or_category | string | Named competitor or category such as local stores or general marketplaces |
| type | enum | `current` or `potential` |
| strengths | list | At least two |
| weaknesses | list | At least two |
| vectraauto_response | string | Concrete strategy that exploits the weakness |

**Validation**: At least one current and one potential competitor; every competitor has a response; no unsupported claims.

### DigitalInitiative

A technology-enabled change with business value.

| Field | Type | Rules |
|-------|------|-------|
| name | string | e.g. cloud inventory, fitment finder, automated checkout, demand analytics |
| type | enum | `analog-to-digital`, `new-software`, `new-technology`, `cloud-migration`, `automation-analytics` |
| description | string | What changes for customers or operations |
| benefit | list | Maps to the ruleset benefits, e.g. competitive advantage, data access, productivity |
| roadmap_phase | enum | `Q1`, `Q2`, `Q3`, `Q4`, or `Year 2` |
| success_signal | string | Observable indication the initiative is working |

**Validation**: The digital strategy section covers analog-to-digital, new software/platform, and analytics/automation; each initiative has a benefit and phase.

### FinancialAssumption

A named input to the financial model.

| Field | Type | Rules |
|-------|------|-------|
| name | string | e.g. average order value, gross margin, monthly orders |
| value | number/string | Numeric with unit |
| unit | string | LKR, percent, count, months |
| rationale | string | Why this value is reasonable |
| source | string | Citation, internal estimate, or `Illustrative estimate` |
| sensitivity | enum | `low`, `medium`, or `high` impact on profit |

**Validation**: Every financial line item traces to at least one assumption; all monetary assumptions use LKR; illustrative assumptions are labeled.

### FinancialStatement

One of the four required forward-looking statements.

| Field | Type | Rules |
|-------|------|-------|
| type | enum | `income_statement`, `cash_flow`, `balance_sheet`, `shareholders_equity` |
| period | string | Year 1 and Year 2 columns, quarterly where required |
| line_items | list | Labeled rows with LKR values |
| totals | list | Subtotals and net figures |
| assumptions_ref | list | References `FinancialAssumption.name` |
| balance_check | boolean | For balance sheet: Assets = Liabilities + Equity |

**Relationships**: All four statements share the same assumptions and periods.

**Validation**: Four statements exist; the balance sheet balances exactly; cash flow explains the funding need; equity statement shows changes over the first 12 months.

### Placeholder

A deliberately missing founder-specific value.

| Field | Type | Rules |
|-------|------|-------|
| id | string | Unique, e.g. `PH-001` |
| description | string | What value is needed |
| owner | string | Who must supply it (founder, designer, accountant) |
| section_ref | string | Section ID where it appears |
| status | enum | `open` or `resolved` |
| resolution | string | Value or note when resolved |

**Validation**: The rendered text uses `[PLACEHOLDER: description — owner: role]`; no bare `[X]` or empty brackets remain; every open placeholder appears in a final list for the founder.

## Global Validation Rules

1. **Brand**: The string `VetraAuto` appears zero times; `VectraAuto` is the only brand spelling.
2. **Currency**: Monetary values use `LKR` and never mix currencies.
3. **Sections**: All contract sections exist, in order, with non-empty content.
4. **Financial identity**: `Assets = Liabilities + Equity` for every balance-sheet period.
5. **Illustrative labeling**: Every projected table is preceded by an "Illustrative estimate" note and references its assumptions.
6. **Placeholders**: Only the `[PLACEHOLDER: ...]` token is allowed; no ambiguous brackets.
7. **Traceability**: Each functional requirement in the spec maps to at least one section or global rule.
