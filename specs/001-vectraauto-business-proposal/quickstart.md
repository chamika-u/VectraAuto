# Quickstart: Validate the VectraAuto Business Proposal

**Feature**: `001-vectraauto-business-proposal`
**Date**: 2026-10-22

This guide proves the proposal is complete, consistent, and exportable. It references the content contract and data model rather than duplicating their details.

## Prerequisites

- Pandoc 3.8 or later on `PATH` (`pandoc --version`)
- MiKTeX with XeLaTeX on `PATH` (`xelatex --version`)
- Python 3.11 or later (`python --version`)
- The proposal source at `docs/business-proposal.md`

## 1. Validate structure and consistency

```powershell
python scripts/validate_proposal.py docs/business-proposal.md
```

Expected result: exit code `0` and a summary with no missing sections, no brand violations, no currency violations, no balance errors, and no unresolved placeholders beyond the allowed founder inputs.

If it fails, the output names the invariant ID (for example `C-01`). Match it to [contracts/proposal-contract.md](./contracts/proposal-contract.md) and fix the cited section.

## 2. Run the structural test suite

```powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

Expected result: all tests pass. Tests cover the contract's section list, brand rule, currency rule, placeholder syntax, and balance identity.

## 3. Export PDF and DOCX

```powershell
New-Item -ItemType Directory -Force -Path docs\exports | Out-Null
pandoc docs/business-proposal.md --toc --pdf-engine=xelatex -o docs/exports/VectraAuto-Business-Proposal.pdf
pandoc docs/business-proposal.md --toc -o docs/exports/VectraAuto-Business-Proposal.docx
```

Expected result: both files exist and open without errors. The PDF should be roughly 15–25 pages; the DOCX should preserve headings and tables.

## 4. Verify format parity

Open the PDF and DOCX and confirm:

- Every section title from `S00`–`S14` appears in the same order.
- The financial tables show the same LKR figures as the Markdown source.
- "VectraAuto" is spelled identically in all three formats.
- The title page and confidentiality statement survive export.

Automated check, if `pdftotext` is available:

```powershell
pdftotext docs/exports/VectraAuto-Business-Proposal.pdf - | Select-String "VectraAuto|VetraAuto|LKR"
```

Expected: `VectraAuto` and `LKR` appear; `VetraAuto` appears zero times.

## 5. Manual investor-readability review

Read only the executive summary and confirm you can answer, without opening other sections:

1. What does VectraAuto do?
2. Who are its primary and secondary customers?
3. Who competes with it and how does it win?
4. How will it operate in Year 1?
5. What are the Year 1 and Year 2 revenue forecasts?
6. How much investment is required and for what?

Expected: all six answers are present in the executive summary, which is 5%–10% of the main body.

## 6. Financial consistency spot-check

For the Year 1 balance sheet, recompute:

```text
Assets = Liabilities + Equity
```

Expected: the equation holds exactly for Year 1 and Year 2. Also confirm the cash-flow statement explains why Q1–Q2 are negative and when the business becomes cash-positive.

## Definition of Done

- [ ] Validator exits `0`
- [ ] Unit tests pass
- [ ] PDF and DOCX exist and open
- [ ] Section parity confirmed across formats
- [ ] TOC matches all S00–S14 headings
- [ ] Executive summary passes the six-question review
- [ ] Executive summary is 5%–10% of the S03–S12 word count
- [ ] Balance sheet identity holds for both years
- [ ] All open placeholders are listed in S13 with owners
