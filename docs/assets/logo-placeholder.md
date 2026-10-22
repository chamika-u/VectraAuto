# VectraAuto Logo Placeholder

The proposal currently uses a labeled logo placeholder on the title page. Replace it before the final investor distribution.

## Requirements

- **Format**: SVG preferred; PNG accepted at 300 DPI or higher
- **Dimensions**: at least 1200 × 400 px for the horizontal lockup
- **Background**: transparent
- **Colour**: primary mark in deep blue with an orange accent; must remain legible in greyscale
- **File name**: `vectraauto-logo.svg` or `vectraauto-logo.png`
- **Location**: `docs/assets/`

## Replacement Steps

1. Add the approved logo file to `docs/assets/`.
2. Update S00 in `docs/business-proposal.md` so the `[PLACEHOLDER: company logo — owner: founder/designer]` line becomes an image reference, for example:
   `![VectraAuto logo](assets/vectraauto-logo.svg)`
3. Re-run `python scripts/validate_proposal.py docs/business-proposal.md`.
4. Re-export the PDF and DOCX.

## Current Placeholder Owner

Founder / designer. Track this open placeholder in S13 until resolved.
