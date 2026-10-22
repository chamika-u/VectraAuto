"""Structural tests for the VectraAuto business proposal and its validator."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import validate_proposal as vp  # noqa: E402

DOCUMENT = ROOT / "docs" / "business-proposal.md"


class ProposalStructureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = vp.read_text(DOCUMENT)
        cls.sections = vp.extract_sections(cls.text)
        cls.issues = vp.validate_document(cls.text)

    def test_document_exists(self) -> None:
        self.assertTrue(DOCUMENT.is_file(), f"missing {DOCUMENT}")

    def test_all_contract_sections_present_and_ordered(self) -> None:
        titles = [vp.normalize(section.title) for section in self.sections]
        expected = [vp.normalize(title) for _, title in vp.EXPECTED_SECTIONS]
        self.assertEqual(titles[: len(expected)], expected)

    def test_toc_lists_every_section(self) -> None:
        toc_issues = [issue for issue in self.issues if issue.invariant == "C-19"]
        self.assertEqual([], toc_issues)

    def test_brand_spelling_is_consistent(self) -> None:
        brand_issues = [issue for issue in self.issues if issue.invariant == "C-01"]
        self.assertEqual([], brand_issues)

    def test_currency_is_lkr_only(self) -> None:
        currency_issues = [issue for issue in self.issues if issue.invariant == "C-02"]
        self.assertEqual([], currency_issues)

    def test_placeholders_are_labeled(self) -> None:
        placeholder_issues = [
            issue for issue in self.issues if issue.invariant == "C-14"
        ]
        self.assertEqual([], placeholder_issues)

    def test_balance_sheet_identity(self) -> None:
        balance_issues = [issue for issue in self.issues if issue.invariant == "C-12"]
        self.assertEqual([], balance_issues)

    def test_executive_summary_has_five_paragraphs_and_correct_share(self) -> None:
        summary_issues = [
            issue for issue in self.issues if issue.invariant in {"C-05", "C-06"}
        ]
        self.assertEqual([], summary_issues)

    def test_full_document_has_no_validation_issues(self) -> None:
        self.assertEqual([], self.issues)


class ValidatorNegativeTests(unittest.TestCase):
    def test_conflicting_brand_is_rejected(self) -> None:
        issues = vp.check_brand("VetraAuto sells parts.")
        self.assertTrue(any(issue.invariant == "C-01" for issue in issues))

    def test_non_lkr_currency_is_rejected(self) -> None:
        issues = vp.check_currency("The price is $100 or 100 USD.")
        self.assertTrue(any(issue.invariant == "C-02" for issue in issues))

    def test_bare_placeholder_is_rejected(self) -> None:
        issues = vp.check_placeholders("Revenue is [X] in Year 1.")
        self.assertTrue(any(issue.invariant == "C-14" for issue in issues))

    def test_wrong_balance_is_rejected(self) -> None:
        issues = vp.check_balance(
            "Balance check; Year 1: LKR 10 = LKR 5 + LKR 4\n"
            "Balance check; Year 2: LKR 10 = LKR 5 + LKR 5"
        )
        self.assertTrue(any(issue.invariant == "C-12" for issue in issues))

    def test_labeled_placeholder_is_accepted(self) -> None:
        issues = vp.check_placeholders(
            "[PLACEHOLDER: founder name — owner: founder]"
        )
        self.assertFalse(any(issue.invariant == "C-14" for issue in issues))


if __name__ == "__main__":
    unittest.main()
