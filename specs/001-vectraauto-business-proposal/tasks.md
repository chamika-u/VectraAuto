# Tasks: VectraAuto Business Proposal

**Input**: Design documents from `/specs/001-vectraauto-business-proposal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/proposal-contract.md, quickstart.md

**Tests**: Tests are not explicitly requested in `spec.md`. The validator and its unittest suite are included because `plan.md` defines them as the structural validation approach, not as TDD.

**Organization**: Tasks are grouped by user story so each story has its own content increment. Because all proposal content lives in one Markdown source (`docs/business-proposal.md`), content tasks are sequential even when their stories are logically independent. Only tasks touching different files are marked `[P]`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task includes an exact file path

## Path Conventions

- Proposal source: `docs/business-proposal.md`
- Exports: `docs/exports/`
- Tooling: `scripts/`, `tests/`
- Design artifacts: `specs/001-vectraauto-business-proposal/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the document workspace and confirm the export toolchain

- [X] T001 Create `docs/`, `docs/assets/`, and `docs/exports/` directory structure with `docs/assets/.gitkeep` and `docs/exports/.gitkeep`
- [X] T002 [P] Create `scripts/validate_proposal.py` scaffold and `tests/__init__.py` so tooling paths exist
- [X] T003 [P] Verify Pandoc and XeLaTeX availability using the prerequisite commands in `specs/001-vectraauto-business-proposal/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared document skeleton and validation contract before any story content

**⚠️ CRITICAL**: No user story content can begin until this phase is complete

- [X] T004 Create `docs/business-proposal.md` skeleton with YAML front matter (title, author, date), title page heading, table-of-contents placeholder, and headings S00–S14 in the exact order defined in `specs/001-vectraauto-business-proposal/contracts/proposal-contract.md`
- [X] T005 [P] Implement the validator in `scripts/validate_proposal.py` to enforce invariants C-01–C-19 from `specs/001-vectraauto-business-proposal/contracts/proposal-contract.md` and print the report fields listed there
- [X] T006 Create the structural test suite in `tests/test_proposal_structure.py` covering section presence/order, TOC parity, brand spelling, LKR currency, placeholder syntax, illustrative labeling, and the balance-sheet identity
- [X] T007 [P] Create `docs/assets/logo-placeholder.md` describing the required logo format, dimensions, and replacement instructions
- [X] T008 Populate S13 in `docs/business-proposal.md` with the assumptions register and `[PLACEHOLDER: description — owner: role]` template, and S14 with the initial glossary terms (VectraAuto, automobile parts, DIY car owners, independent repair garages)

**Checkpoint**: Skeleton, tooling, and validation are ready. Story content can now be written.

---

## Phase 3: User Story 1 - Read an investor-ready business proposal (Priority: P1) 🎯 MVP

**Goal**: Deliver the core narrative and financial case: title page, mission/vision, business description, two-year LKR financials, and a five-paragraph executive summary.

**Independent Test**: Read only the executive summary and confirm it answers the six questions in `specs/001-vectraauto-business-proposal/quickstart.md` (business, customers, competition, operations, forecasts, investment need).

### Implementation for User Story 1

- [X] T009 [US1] Write S00 title page in `docs/business-proposal.md` with business name, address/contact placeholder, completion date, confidentiality statement, and logo reference
- [X] T010 [US1] Write distinct mission and vision statements in S03 of `docs/business-proposal.md`
- [X] T011 [US1] Write S04 in `docs/business-proposal.md` covering the sourcing problem, the digital solution, B2C-primary/B2B-secondary customers, organizational introduction, startup status, LLC form, and current financial status
- [X] T012 [US1] Write S11.1 in `docs/business-proposal.md`: the financial assumptions table (orders, average order value, gross margin, marketing, fulfillment, hosting, headcount) with LKR units and an "Illustrative estimate" note
- [X] T013 [US1] Write S11.2 in `docs/business-proposal.md`: two-year LKR income statement, cash flow projection, balance sheet, and statement of shareholders' equity, ensuring Assets = Liabilities + Equity
- [X] T014 [US1] Write the five-paragraph executive summary in S02 of `docs/business-proposal.md` covering overview, target market/competition/marketing, operations, one- and two-year forecasts, and investment need
- [X] T015 [US1] Run `python scripts/validate_proposal.py docs/business-proposal.md` and resolve every US1-related invariant failure

**Checkpoint**: US1 is independently reviewable through its executive summary and financial case.

---

## Phase 4: User Story 2 - Demonstrate digital innovation rigorously (Priority: P2)

**Goal**: Add a complete digital innovation analysis that classifies VectraAuto correctly and maps its digital strategy to business benefits.

**Independent Test**: Review S12 and confirm every concept in contract invariant C-07 is present and applied to VectraAuto.

### Implementation for User Story 2

- [X] T016 [US2] Write S12.1 in `docs/business-proposal.md` distinguishing invention from innovation and digital innovation from IT innovation, explicitly classifying VectraAuto as digital innovation
- [X] T017 [US2] Write S12.2 in `docs/business-proposal.md` with the digital strategy roadmap (analog-to-digital, new software/platform, cloud, automation/analytics), initiative phases, types of digital innovation, and expected benefits
- [X] T018 [US2] Run `python scripts/validate_proposal.py docs/business-proposal.md` and resolve all C-07 and S12 failures

**Checkpoint**: US2 stands alone as a rubric-ready digital innovation analysis.

---

## Phase 5: User Story 3 - Evaluate market and competition (Priority: P3)

**Goal**: Add environmental, industry, competitor, and market analyses localized to Sri Lanka and prioritized for B2C DIY customers.

**Independent Test**: Review S05–S08 and confirm PEST, industry structure, current/potential competitors, and all five market-analysis steps (size, segmentation, target market, need, barriers) are present.

### Implementation for User Story 3

- [X] T019 [US3] Write S05 PEST analysis in `docs/business-proposal.md` covering political, economic, social, and technological factors affecting Sri Lankan auto-parts e-commerce
- [X] T020 [US3] Write S06 industry analysis in `docs/business-proposal.md` covering aftermarket structure, supply chain, import dependence, and industry dynamics
- [X] T021 [US3] Write S07 competitor analysis in `docs/business-proposal.md` with at least one current and one potential competitor category, strengths, weaknesses, and VectraAuto's response
- [X] T022 [US3] Write S08 market analysis in `docs/business-proposal.md` with market size in LKR and volume, segmentation, target market priority, market need, and barriers to entry, labeling estimates and sources
- [X] T023 [US3] Run `python scripts/validate_proposal.py docs/business-proposal.md` and resolve all C-08, C-15, and S05–S08 failures

**Checkpoint**: US3 independently justifies the revenue assumptions and competitive position.

---

## Phase 6: User Story 4 - Review the operating and marketing plan (Priority: P4)

**Goal**: Add the marketing plan and a quarterly operational plan that explain how VectraAuto will acquire customers and hit its first-year targets.

**Independent Test**: Review S09–S10 and confirm all four marketing elements and a quarterly Year 1 plan with measurable targets are present.

### Implementation for User Story 4

- [X] T024 [US4] Write S09 marketing plan in `docs/business-proposal.md` with products/services and USP, LKR pricing strategy, sales and distribution, and advertising/promotions
- [X] T025 [US4] Write S10 operational plan in `docs/business-proposal.md` with Q1–Q4 activities, at least one measurable target per quarter, the hybrid inventory model (warehouse stock for high-turnover parts, drop-shipping for rare parts, B2C-first stocking priority), and the funding-linked milestones
- [X] T026 [US4] Run `python scripts/validate_proposal.py docs/business-proposal.md` and resolve all C-09, C-10, and S09–S10 failures

**Checkpoint**: US4 independently explains go-to-market and first-year execution.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Reconcile the whole document and produce the three final formats

- [X] T027 Refresh S02 in `docs/business-proposal.md` so the executive summary reflects the final S05–S10 content and stays within 5%–10% of the S03–S12 word count
- [X] T028 Complete S14 in `docs/business-proposal.md` with the final glossary and cited sources; confirm the only brand spelling is VectraAuto
- [X] T029 Review S13 in `docs/business-proposal.md`, resolve every placeholder possible, and list remaining open placeholders with owners
- [X] T030 Generate the table of contents in S01 of `docs/business-proposal.md` from the final S00–S14 headings, ensuring every heading appears with a matching title and order
- [X] T031 Run `python scripts/validate_proposal.py docs/business-proposal.md` and `python -m unittest discover -s tests -p "test_*.py" -v`; fix all failures
- [X] T032 Export PDF and DOCX using the commands in `specs/001-vectraauto-business-proposal/quickstart.md` into `docs/exports/`
- [X] T033 Verify format parity between `docs/business-proposal.md`, `docs/exports/VectraAuto-Business-Proposal.pdf`, and `docs/exports/VectraAuto-Business-Proposal.docx`
- [X] T034 Perform the manual investor-readability and financial spot-check in `specs/001-vectraauto-business-proposal/quickstart.md`, then confirm all Definition of Done items

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories
- **User Stories (Phases 3–6)**: Depend on Foundational; content tasks run sequentially because they edit the same `docs/business-proposal.md`
- **Polish (Phase 7)**: Depends on all four user stories

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational; its MVP slice is the executive summary and financial case. Full-section completeness is a cross-cutting gate checked by T031/T034, not a US1 dependency.
- **US2 (P2)**: Independent after Foundational; adds S12 only
- **US3 (P3)**: Independent after Foundational; adds S05–S08 only
- **US4 (P4)**: Independent after Foundational; adds S09–S10 only
- US1's executive summary references market, competition, and operations at a high level; T027 reconciles it with the final US3/US4 content

### Within Each User Story

- Write content before running the validator
- Resolve validator failures before moving to the next story
- Each story ends at a checkpoint that can be reviewed independently

### Parallel Opportunities

- T002 and T003 can run in parallel during setup
- T005 and T007 can run in parallel during Foundational (different files); T006 follows T005 because it tests the validator
- T032 export commands for PDF and DOCX can be run together after T031 passes
- Content tasks (T009–T030) must remain sequential because they all modify `docs/business-proposal.md`

---

## Parallel Example: Foundational Phase

```text
Task T005: Implement validator in scripts/validate_proposal.py
Task T007: Create logo placeholder guide in docs/assets/logo-placeholder.md

# After T005 completes:
Task T006: Create structural tests in tests/test_proposal_structure.py
```

These touch separate files and can be completed concurrently.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (T009–T015)
4. **STOP and VALIDATE**: Run the six-question executive-summary review and the validator
5. Review the financial case with the founder before drafting the remaining sections

### Incremental Delivery

1. Setup + Foundational → skeleton and validator ready
2. US1 → core narrative and financials (MVP)
3. US2 → digital innovation analysis
4. US3 → environmental, industry, competitor, and market analysis
5. US4 → marketing and operational plans
6. Polish → reconciled, validated Markdown/PDF/DOCX proposal

### Practical Notes

- The proposal is a single file, so parallel content drafting by multiple people would create merge conflicts; assign sections sequentially or split drafts outside git and merge deliberately
- Run the validator after every story checkpoint to catch brand, currency, and placeholder drift early
- Update `specs/001-vectraauto-business-proposal/contracts/proposal-contract.md` first if a section or invariant must change

---

## Notes

- `[P]` tasks touch different files only
- `[Story]` labels provide traceability to `spec.md`
- The validator is the definition-of-done gate; manual review covers readability and credibility
- Commit after each story checkpoint
- Avoid inventing verified data; use the placeholder and illustrative-estimate conventions from S13
