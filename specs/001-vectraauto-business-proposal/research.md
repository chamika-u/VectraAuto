# Phase 0 Research: VectraAuto Business Proposal

**Feature**: `001-vectraauto-business-proposal`
**Date**: 2026-10-22

All technical unknowns from the plan are resolved below. There are no remaining open clarifications.

## Research Tasks and Findings

### R-001 — Authoring format for a maintainable proposal

- **Decision**: Use a single Markdown source (`docs/business-proposal.md`) using GitHub-flavored Markdown with ATX headings and pipe tables.
- **Rationale**: Markdown is diff-friendly, reviewable in pull requests, works with the repository's existing Markdown tooling, and converts cleanly to PDF and DOCX. It keeps the proposal's content independent of presentation.
- **Alternatives considered**:
  - DOCX-first: easy for business readers but binary, hard to diff, and error-prone to keep in sync.
  - LaTeX-first: excellent typesetting but steep syntax and slower editing for a business document.
  - Google Docs: convenient collaboration but not version-controlled in this repository.

### R-002 — PDF and DOCX export pipeline

- **Decision**: Export with Pandoc 3.8. Use `--pdf-engine=xelatex` (available through MiKTeX) for PDF and Pandoc's native DOCX writer for Word. Include `--toc` and set metadata (title, author, date) in YAML front matter.
- **Rationale**: Pandoc 3.8, XeLaTeX, and pdfLaTeX are already installed in this environment. A single source produces both formats with consistent content, satisfying FR-023 and SC-011.
- **Alternatives considered**:
  - Headless browser HTML-to-PDF: adds a browser dependency and CSS maintenance.
  - WeasyPrint: not installed and requires Python packaging.
  - Manual DOCX/PDF creation: guarantees content drift across formats.

### R-003 — Financial modeling approach

- **Decision**: Build a bottom-up, assumption-driven, two-year illustrative model in LKR. Drivers: monthly orders, average order value, gross margin, marketing spend, fulfillment cost, hosting/software cost, and headcount. Derive the income statement, cash flow, balance sheet, and shareholders' equity from the same driver set.
- **Rationale**: A bottom-up model makes every figure traceable to an assumption, which satisfies FR-022 and lets reviewers adjust inputs without rebuilding the document. It also keeps the balance sheet internally consistent.
- **Alternatives considered**:
  - Top-down market-share forecast: simpler but harder to defend and easy to disconnect from operations.
  - Placeholder-only financials: safe but fails the goal of an investor-ready document.
  - Aggressive hockey-stick projection: risks credibility with lenders.

### R-004 — Market sizing and data sourcing for Sri Lanka

- **Decision**: Use publicly available national statistics and industry reports where they can be cited; otherwise present the market size as a clearly labeled estimate with the estimation method shown. Describe market value in LKR and volume in registered vehicles, repair shops, and parts-buying households.
- **Rationale**: The spec requires both value and volume, and the proposal must not present unverified figures as facts. Transparent sourcing preserves credibility.
- **Alternatives considered**:
  - Reuse the sample's bracketed placeholders: fails completeness.
  - Import foreign market figures without adjustment: misleading for a Sri Lanka-focused proposal.

### R-005 — Structural validation of the document

- **Decision**: Implement `scripts/validate_proposal.py` using only the Python standard library. It checks: required headings present and in order, all FR-linked section content present, exactly one brand spelling, LKR currency markers, no unresolved generic placeholders, labeled illustrative figures, and the Assets = Liabilities + Equity identity in the financial table.
- **Rationale**: Automated checks catch regressions each time the proposal is edited and make the contract executable. Standard library avoids adding dependencies to a documentation project.
- **Alternatives considered**:
  - Manual checklist only: slow and easy to skip.
  - Markdown lint only: checks syntax, not business-rule completeness.
  - Heavyweight schema tooling: disproportionate for one document.

### R-006 — Placeholder and assumption policy

- **Decision**: Use a consistent placeholder token `[PLACEHOLDER: <description> — owner: <role>]` for founder-specific data (name, contact, logo, exact date) and a leading "Illustrative estimate" note above every projected financial table. Record assumptions in a dedicated assumptions table.
- **Rationale**: Distinguishes missing inputs from estimates, satisfies FR-018/SC-009, and prevents investors from mistaking projections for actuals.
- **Alternatives considered**:
  - Empty brackets like `[X]`: ambiguous and easy to miss.
  - Invented founder details: misleading.
  - Omitting financials: fails the deliverable's purpose.

### R-007 — Brand and terminology consistency

- **Decision**: Canonical brand term is **VectraAuto**. Use "automobile parts" for the product category, "DIY car owners" for B2C customers, and "independent repair garages" for B2B customers. Add these to a short glossary in the proposal.
- **Rationale**: The repository, README, and remote URL use VectraAuto; the sample's "VetraAuto" is treated as a typo. A glossary prevents synonym drift across sections.
- **Alternatives considered**:
  - Follow the sample spelling: conflicts with the repository identity.
  - Mix both spellings: fails SC-010.

### R-008 — Document validation guide

- **Decision**: Provide `quickstart.md` with exact export and validation commands plus a manual reviewer walkthrough; do not duplicate full section content there.
- **Rationale**: Keeps the guide stable while the proposal evolves, and gives a repeatable definition of done.
- **Alternatives considered**: Embedding the checklist in the proposal; rejected because it pollutes investor-facing content.

## Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| How to produce PDF and DOCX from one source | Pandoc 3.8 + XeLaTeX, native DOCX writer |
| How to keep financial statements consistent | Single bottom-up driver model in LKR |
| How to handle missing founder data | Standard `[PLACEHOLDER: ...]` token plus labeling policy |
| How to verify completeness automatically | Python standard-library structural validator |
| How to source Sri Lankan market data | Cite public sources; label estimates openly |
| Which brand spelling is authoritative | VectraAuto |
