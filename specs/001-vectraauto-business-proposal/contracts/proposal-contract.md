# Proposal Content Contract

**Feature**: `001-vectraauto-business-proposal`
**Version**: 1.0
**Date**: 2026-10-22

This contract defines the external interface of the business proposal: the required order, identity, and content of its sections, plus the invariants that the validator enforces. It is the source of truth for `scripts/validate_proposal.py` and the structural tests.

## Section Contract

All sections are required. Numbering in the rendered document follows this order. `S00` and `S01` are front matter; `S02`–`S12` are the main body; `S13` is an appendix.

| ID | Section | Primary FRs | Must Establish |
|----|---------|-------------|----------------|
| S00 | Title Page | FR-001, FR-017 | Logo (or placeholder), document title, business name, address and contact, completion date, confidentiality statement |
| S01 | Table of Contents | FR-020 | Every numbered section with matching titles |
| S02 | Executive Summary | FR-002, FR-019, FR-021 | Five paragraphs: overview; target market, competition, marketing; operations; 1-year and 2-year forecasts; investment need |
| S03 | Vision and Mission | FR-003 | Distinct mission and vision statements |
| S04 | Description of the Business | FR-004, FR-021 | Problem, solution, customers and priority, organizational introduction, startup status, LLC form, current financial status |
| S05 | Environmental Analysis | FR-005 | PEST: political, economic, social, technological factors affecting Sri Lankan auto-parts e-commerce |
| S06 | Industry Analysis | FR-006 | Structure, size, supply chain, and dynamics of the automobile aftermarket parts industry |
| S07 | Competitor Analysis | FR-007 | Current competitors, potential competitors, strengths, weaknesses, VectraAuto response |
| S08 | Market Analysis | FR-008, FR-021 | Market size in volume and value, segmentation, target market, market need, barriers to entry |
| S09 | Marketing Plan | FR-009, FR-021 | Products/services and USP, pricing, sales and distribution, advertising and promotions |
| S10 | Operational Plan | FR-010, FR-021 | Quarterly activities and at least one measurable target per quarter in Year 1; hybrid inventory model with B2C-first stocking |
| S11 | Financial Plan | FR-011, FR-012, FR-019, FR-022 | Income statement, cash flow, balance sheet, shareholders' equity, assumptions, 2-year LKR projections |
| S12 | Digital Innovation | FR-013, FR-014, FR-015, FR-016 | Invention vs innovation, digital vs IT innovation, strategy roadmap, types, benefits |
| S13 | Assumptions and Placeholders | FR-018 | Assumptions register, open placeholders with owners, estimate method notes |
| S14 | Glossary and Sources | FR-017 | Canonical terms and cited sources |

## Content Invariants

| ID | Invariant | Check |
|----|-----------|-------|
| C-01 | Brand spelling | The substring `VetraAuto` appears zero times; `VectraAuto` appears at least once |
| C-02 | Currency | Every monetary figure uses `LKR`; no `$`, `USD`, `Rs.`, or unlabeled amounts in financial tables |
| C-03 | Section presence | All `S00`–`S14` headings exist |
| C-04 | Section order | Heading offsets are strictly increasing in contract order |
| C-05 | Executive summary length | S02 is 5%–10% of the word count of S03–S12 (main body excluding S02), measured in words |
| C-06 | Executive summary paragraphs | S02 has exactly five content paragraphs |
| C-07 | Digital concepts | S12 contains all of: invention vs innovation, digital vs IT, analog-to-digital, new software/platform, analytics/automation, benefits |
| C-08 | Market steps | S08 contains all five: size, segmentation, target market, need, barriers |
| C-09 | Marketing elements | S09 contains all four: USP, pricing, sales/distribution, advertising/promotions |
| C-10 | Operational quarters | S10 names Q1, Q2, Q3, Q4 and has a measurable target for each |
| C-11 | Financial statements | S11 contains headings or clearly labeled subsections for all four statements |
| C-12 | Balance identity | For each balance-sheet period, Assets = Liabilities + Equity |
| C-13 | Illustrative labeling | Each financial projection table is preceded by "Illustrative estimate" |
| C-14 | Placeholder syntax | All missing values use `[PLACEHOLDER: ... — owner: ...]`; no bare `[X]`, `[Y]`, `[Z]`, or empty brackets |
| C-15 | Customer priority | S04/S08/S09 identify DIY car owners as primary and repair garages as secondary |
| C-16 | Format parity | PDF and DOCX exports contain the same section headings as the Markdown source |
| C-17 | Confidentiality | S00 contains a confidentiality statement |
| C-18 | Date | S00 contains a completion date (concrete or labeled placeholder) |
| C-19 | TOC parity | S01 lists every S00–S14 heading with matching titles, in strict order |

## Export Contract

| Output | Path | Command shape |
|--------|------|---------------|
| Markdown | `docs/business-proposal.md` | Source of truth; committed |
| PDF | `docs/exports/VectraAuto-Business-Proposal.pdf` | `pandoc docs/business-proposal.md --pdf-engine=xelatex -o docs/exports/VectraAuto-Business-Proposal.pdf` |
| DOCX | `docs/exports/VectraAuto-Business-Proposal.docx` | `pandoc docs/business-proposal.md -o docs/exports/VectraAuto-Business-Proposal.docx` |

**Parity rule**: The PDF and DOCX must be generated from the same committed Markdown revision. An export is invalid if the source changed afterward. S01 is the single table of contents in all three formats; do not pass `--toc`, which would add a second, format-only contents page.

## Validator Interface

`scripts/validate_proposal.py <path-to-markdown>` exits `0` when all contract checks pass and non-zero otherwise. Each failure prints the invariant ID and a short reason. The validator must not modify the proposal.

**Reported fields**: `sections_found`, `sections_missing`, `brand_violations`, `currency_violations`, `placeholder_violations`, `balance_errors`, `exec_summary_word_share`, `result`.

## Change Policy

Changing a section title, order, or invariant requires updating this contract, the spec if behavior changed, and the validator tests in the same commit. Adding a section requires a new stable ID and a corresponding FR.
