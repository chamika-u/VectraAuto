#!/usr/bin/env python3
"""Validate the VectraAuto business proposal against its content contract.

Exit code 0 means every automated invariant passed. Exit code 1 means at
least one invariant failed; each failure names the contract invariant and
the reason.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

EXPECTED_SECTIONS: list[tuple[str, str]] = [
    ("S00", "0. Title Page"),
    ("S01", "Table of Contents"),
    ("S02", "1. Executive Summary"),
    ("S03", "2. Vision and Mission"),
    ("S04", "3. Description of the Business"),
    ("S05", "4. Environmental Analysis"),
    ("S06", "5. Industry Analysis"),
    ("S07", "6. Competitor Analysis"),
    ("S08", "7. Market Analysis"),
    ("S09", "8. Marketing Plan"),
    ("S10", "9. Operational Plan"),
    ("S11", "10. Financial Plan"),
    ("S12", "11. Digital Innovation"),
    ("S13", "12. Assumptions and Placeholders"),
    ("S14", "13. Glossary and Sources"),
]

WORD_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’\-]*")
ALLOWED_PLACEHOLDER_RE = re.compile(r"\[PLACEHOLDER:[^\]]+\]")
FORBIDDEN_PLACEHOLDER_RE = re.compile(
    r"\[(?:\s*X\s*|\s*Y\s*|\s*Z\s*|Amount|Insert|Your)[^\]]*\]", re.IGNORECASE
)
BALANCE_RE = re.compile(
    r"LKR\s*([\d,]+)\s*=\s*LKR\s*([\d,]+)\s*\+\s*LKR\s*([\d,]+)"
)


@dataclass
class Section:
    section_id: str
    title: str
    body: str


@dataclass
class Issue:
    invariant: str
    message: str

    def __str__(self) -> str:
        return f"FAIL [{self.invariant}] {self.message}"


def read_text(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8")


def strip_front_matter(text: str) -> str:
    if text.startswith("---"):
        match = re.match(r"^---\r?\n.*?\r?\n---\r?\n?", text, re.DOTALL)
        if match:
            return text[match.end():]
    return text


def normalize(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def extract_sections(text: str) -> list[Section]:
    body = strip_front_matter(text)
    sections: list[Section] = []
    current_title: str | None = None
    current_lines: list[str] = []

    for line in body.splitlines():
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if match:
            if current_title is not None:
                sections.append(Section("", current_title, "\n".join(current_lines)))
            current_title = match.group(1).strip()
            current_lines = []
        elif current_title is not None:
            current_lines.append(line)

    if current_title is not None:
        sections.append(Section("", current_title, "\n".join(current_lines)))

    titled = {normalize(section.title): section for section in sections}
    for section_id, expected_title in EXPECTED_SECTIONS:
        found = titled.get(normalize(expected_title))
        if found is not None:
            found.section_id = section_id
    return sections


def section_map(sections: list[Section]) -> dict[str, Section]:
    return {section.section_id: section for section in sections if section.section_id}


def word_count(text: str) -> int:
    return len(WORD_RE.findall(text))


def paragraph_blocks(text: str) -> list[str]:
    blocks = [block.strip() for block in re.split(r"\n\s*\n", text) if block.strip()]
    paragraphs = []
    for block in blocks:
        stripped = block.lstrip()
        if stripped.startswith(("#", "|", ">", "-", "*", "1.", "2.", "3.", "4.", "5.")):
            continue
        paragraphs.append(block)
    return paragraphs


def contains_any(text: str, options: tuple[str, ...]) -> bool:
    lowered = text.lower()
    return any(option in lowered for option in options)


def check_sections(sections: list[Section]) -> list[Issue]:
    issues: list[Issue] = []
    found = {normalize(section.title): section for section in sections}

    missing = [
        title for _, title in EXPECTED_SECTIONS if normalize(title) not in found
    ]
    for title in missing:
        issues.append(Issue("C-03", f"missing required section heading: {title}"))

    positions = []
    for _, title in EXPECTED_SECTIONS:
        section = found.get(normalize(title))
        if section is not None:
            positions.append(sections.index(section))
    if positions != sorted(positions):
        issues.append(Issue("C-04", "section headings are not in contract order"))

    return issues


def check_toc(sections: list[Section]) -> list[Issue]:
    mapping = section_map(sections)
    toc = mapping.get("S01")
    if toc is None:
        return []

    link_texts = re.findall(r"\[([^\]]+)\]\([^)]+\)", toc.body)
    normalized_toc = normalize(" \n".join(link_texts) or toc.body)
    issues: list[Issue] = []
    for section_id, title in EXPECTED_SECTIONS:
        if section_id == "S01":
            continue
        if normalize(title) not in normalized_toc:
            issues.append(
                Issue("C-19", f"table of contents is missing or mislabels: {title}")
            )
    return issues


def check_brand(text: str) -> list[Issue]:
    issues: list[Issue] = []
    if re.search(r"\bVetraAuto\b", text, re.IGNORECASE):
        issues.append(Issue("C-01", "conflicting brand spelling 'VetraAuto' found"))
    if not re.search(r"\bVectraAuto\b", text):
        issues.append(Issue("C-01", "brand spelling 'VectraAuto' is missing"))
    return issues


def check_currency(text: str) -> list[Issue]:
    issues: list[Issue] = []
    for pattern, label in (
        (r"\$", "dollar sign"),
        (r"\bUSD\b", "USD"),
        (r"\bRs\.?\b", "Rs."),
    ):
        if re.search(pattern, text):
            issues.append(Issue("C-02", f"non-LKR currency marker found: {label}"))
    if "LKR" not in text.upper():
        issues.append(Issue("C-02", "LKR currency marker is missing"))
    return issues


def check_placeholders(text: str) -> list[Issue]:
    issues: list[Issue] = []
    if not ALLOWED_PLACEHOLDER_RE.search(text):
        issues.append(Issue("C-14", "no labeled [PLACEHOLDER: ...] entries found"))
    for match in FORBIDDEN_PLACEHOLDER_RE.finditer(text):
        issues.append(
            Issue("C-14", f"unlabeled or ambiguous placeholder found: {match.group(0)}")
        )
    if re.search(r"\bTODO\b|\bTBD\b", text, re.IGNORECASE):
        issues.append(Issue("C-14", "unresolved TODO/TBD marker found"))
    return issues


def check_balance(text: str) -> list[Issue]:
    issues: list[Issue] = []
    matches = list(BALANCE_RE.finditer(text))
    if len(matches) < 2:
        issues.append(
            Issue("C-12", "expected a balance check line for Year 1 and Year 2")
        )
    for match in matches:
        assets, liabilities, equity = (
            int(value.replace(",", "")) for value in match.groups()
        )
        if assets != liabilities + equity:
            issues.append(
                Issue(
                    "C-12",
                    f"balance check does not balance: {assets} != {liabilities} + {equity}",
                )
            )
    return issues


def check_executive_summary(sections: list[Section]) -> list[Issue]:
    mapping = section_map(sections)
    summary = mapping.get("S02")
    if summary is None:
        return []
    main_body = " ".join(
        mapping[section_id].body
        for section_id, _ in EXPECTED_SECTIONS
        if section_id in {"S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11", "S12"}
        and section_id in mapping
    )
    denominator = word_count(main_body)
    share = word_count(summary.body) / denominator if denominator else 0.0

    issues: list[Issue] = []
    if not 0.05 <= share <= 0.10:
        issues.append(
            Issue(
                "C-05",
                f"executive summary is {share:.1%} of S03-S12; expected 5%-10%",
            )
        )

    paragraphs = paragraph_blocks(summary.body)
    if len(paragraphs) != 5:
        issues.append(
            Issue(
                "C-06",
                f"executive summary has {len(paragraphs)} content paragraphs; expected 5",
            )
        )
    return issues


def check_digital_innovation(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S12")
    if section is None:
        return []
    text = section.body.lower()
    required = {
        "invention": "invention",
        "innovation": "innovation",
        "digital innovation vs IT innovation": "it innovation",
        "analog-to-digital": "analog",
        "software/platform": ("software", "platform"),
        "analytics/automation": ("analytics", "automation"),
        "competitive advantage": "competitive advantage",
        "data access": ("big data", "data"),
        "ROI": "roi",
        "customer expectations": "customer expectations",
    }
    issues: list[Issue] = []
    for label, needle in required.items():
        needles = needle if isinstance(needle, tuple) else (needle,)
        if not any(value in text for value in needles):
            issues.append(Issue("C-07", f"digital innovation section is missing: {label}"))
    return issues


def check_market(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S08")
    if section is None:
        return []
    text = section.body.lower()
    required = {
        "market size": "market size",
        "segmentation": "segmentation",
        "target market": "target market",
        "market need": "market need",
        "barriers to entry": "barriers to entry",
    }
    return [
        Issue("C-08", f"market analysis is missing: {label}")
        for label, needle in required.items()
        if needle not in text
    ]


def check_marketing(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S09")
    if section is None:
        return []
    text = section.body.lower()
    checks = {
        "USP": ("unique selling proposition", "usp"),
        "pricing": "pricing",
        "distribution": "distribution",
        "advertising/promotions": ("advertising", "promotions"),
    }
    issues: list[Issue] = []
    for label, needle in checks.items():
        needles = needle if isinstance(needle, tuple) else (needle,)
        if not any(value in text for value in needles):
            issues.append(Issue("C-09", f"marketing plan is missing: {label}"))
    return issues


def check_operations(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S10")
    if section is None:
        return []
    text = section.body.lower()
    issues: list[Issue] = []
    for quarter in ("q1", "q2", "q3", "q4"):
        if quarter not in text:
            issues.append(Issue("C-10", f"operational plan is missing: {quarter.upper()}"))
    if text.count("target") < 4:
        issues.append(
            Issue("C-10", "operational plan needs a measurable target for each quarter")
        )
    return issues


def check_financial_statements(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S11")
    if section is None:
        return []
    text = section.body.lower()
    required = {
        "income statement": "income statement",
        "cash flow projection": "cash flow",
        "balance sheet": "balance sheet",
        "statement of shareholders' equity": ("shareholders' equity", "shareholders equity"),
    }
    issues: list[Issue] = []
    for label, needle in required.items():
        needles = needle if isinstance(needle, tuple) else (needle,)
        if not any(value in text for value in needles):
            issues.append(Issue("C-11", f"financial plan is missing: {label}"))
    return issues


def check_customer_priority(sections: list[Section]) -> list[Issue]:
    mapping = section_map(sections)
    text = " ".join(
        mapping[section_id].body.lower()
        for section_id in ("S04", "S08", "S09")
        if section_id in mapping
    )
    issues: list[Issue] = []
    if "primary" not in text or not contains_any(text, ("diy", "do-it-yourself")):
        issues.append(
            Issue("C-15", "DIY car owners are not identified as the primary segment")
        )
    if "secondary" not in text or not contains_any(text, ("garage", "repair")):
        issues.append(
            Issue("C-15", "repair garages are not identified as the secondary segment")
        )
    return issues


def check_front_matter(sections: list[Section]) -> list[Issue]:
    section = section_map(sections).get("S00")
    if section is None:
        return []
    text = section.body.lower()
    issues: list[Issue] = []
    if "confidential" not in text:
        issues.append(Issue("C-17", "title page is missing a confidentiality statement"))
    if "completion date" not in text:
        issues.append(Issue("C-18", "title page is missing a completion date"))
    return issues


def check_illustrative(text: str) -> list[Issue]:
    if text.lower().count("illustrative estimate") < 2:
        return [
            Issue(
                "C-13",
                "projections need at least two 'Illustrative estimate' labels",
            )
        ]
    return []


def validate_document(text: str) -> list[Issue]:
    sections = extract_sections(text)
    issues: list[Issue] = []
    issues.extend(check_sections(sections))
    issues.extend(check_toc(sections))

    body = strip_front_matter(text)
    issues.extend(check_brand(body))
    issues.extend(check_currency(body))
    issues.extend(check_placeholders(body))
    issues.extend(check_balance(body))
    issues.extend(check_illustrative(body))
    issues.extend(check_executive_summary(sections))
    issues.extend(check_digital_innovation(sections))
    issues.extend(check_market(sections))
    issues.extend(check_marketing(sections))
    issues.extend(check_operations(sections))
    issues.extend(check_financial_statements(sections))
    issues.extend(check_customer_priority(sections))
    issues.extend(check_front_matter(sections))
    return issues


def build_report(text: str, issues: list[Issue]) -> str:
    sections = extract_sections(text)
    found = {section.section_id for section in sections if section.section_id}
    missing = [section_id for section_id, _ in EXPECTED_SECTIONS if section_id not in found]
    mapping = section_map(sections)
    summary = mapping.get("S02")
    main_body = " ".join(
        mapping[section_id].body
        for section_id in ("S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11", "S12")
        if section_id in mapping
    )
    denominator = word_count(main_body)
    share = word_count(summary.body) / denominator if summary and denominator else 0.0

    def count(invariant: str) -> int:
        return sum(1 for issue in issues if issue.invariant == invariant)

    lines = [
        f"sections_found={len(found)}",
        f"sections_missing={len(missing)}",
        f"brand_violations={count('C-01')}",
        f"currency_violations={count('C-02')}",
        f"placeholder_violations={count('C-14')}",
        f"balance_errors={count('C-12')}",
        f"exec_summary_word_share={share:.3f}",
        f"result={'PASS' if not issues else 'FAIL'}",
    ]
    lines.extend(str(issue) for issue in issues)
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", default="docs/business-proposal.md")
    args = parser.parse_args(argv)

    try:
        text = read_text(args.path)
    except OSError as exc:
        print(f"ERROR: cannot read {args.path}: {exc}", file=sys.stderr)
        return 2

    issues = validate_document(text)
    print(build_report(text, issues))
    return 0 if not issues else 1


if __name__ == "__main__":
    raise SystemExit(main())
