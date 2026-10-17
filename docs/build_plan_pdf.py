#!/usr/bin/env python3
"""Build the Yum Food Agile Project Plan HTML + PDF with the FA2 assignment header.

Usage: python3 docs/build_plan_pdf.py
"""

from __future__ import annotations

import base64
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from markdown_it import MarkdownIt

DOCS = Path(__file__).resolve().parent
PLAN_MD = DOCS / "Agile-Project-Plan.md"
LOGO_PNG = DOCS / "pccoe-logo.png"
STYLE_CSS = DOCS / "assignment-style.css"
OUT_HTML = DOCS / "Agile-Project-Plan.html"
OUT_PDF = DOCS / "Agile-Project-Plan.pdf"

TITLE = "Agile Project Plan \u2014 Yum Food (Online Food Ordering System)"
LABEL = "FA2 \u2014 Skill-Based Activity"
BAND = "Agile Software Development Laboratory"
ACADEMIC_YEAR = "2026-2027"
FOOTER = "Agile Software Development Laboratory"

METADATA = [
    ("Student name", "Tony Prajapati"),
    ("Roll no. / PRN", "123B1F079"),
    ("Batch / division", "Division B2"),
    ("Semester", "Semester VII"),
    ("Course code", "BIT27PE11"),
    ("Subject", "Agile Software Development Laboratory"),
    ("Faculty / guide", "Mrs. Radha Deoghare"),
    ("Submission date", "17 October 2026"),
]

PLAN_CSS = """
/* ---- Plan additions ---- */
main a { color:var(--primary) }
main hr { border:0; border-top:1px solid var(--line); margin:7mm 0 }
.callout.plan-intro { margin:4mm 0 6mm }
.callout.plan-intro p:last-child { margin-bottom:0 }
.callout.plan-intro strong { color:var(--primary) }
.task-item,.task-done { list-style:none; padding-left:5.5mm; position:relative }
.task-item::before,.task-done::before { content:""; position:absolute; left:0; top:1mm; width:3.2mm; height:3.2mm; border:1.2px solid var(--primary); border-radius:1px }
.task-done::before { background:var(--primary) }
"""


def preprocess_markdown(text: str) -> str:
    """Drop the H1 (already in the header) and split the intro block into lines."""
    head, sep, tail = text.partition("\n---\n")
    if not sep:
        raise ValueError("intro separator '---' not found in plan markdown")
    head_lines = [
        line.strip()
        for line in head.splitlines()
        if line.strip() and not line.strip().startswith("# ")
    ]
    intro = "\n\n".join(head_lines)
    return f"{intro}\n\n---\n{tail}"


def render_body(markdown_text: str) -> str:
    md = MarkdownIt("commonmark").enable("table")
    html = md.render(markdown_text)
    html = re.sub(r"<li>\[ \] ", '<li class="task-item">', html)
    html = re.sub(r"<li>\[[xX]\] ", '<li class="task-done">', html)
    html = re.sub(
        r"^(.*?)<hr\s*/?>",
        r'<div class="callout plan-intro">\1</div>\n<hr>',
        html,
        count=1,
        flags=re.DOTALL,
    )
    return html


def build_html() -> str:
    logo_b64 = base64.b64encode(LOGO_PNG.read_bytes()).decode("ascii")
    css = STYLE_CSS.read_text().rstrip() + "\n" + PLAN_CSS
    body = render_body(preprocess_markdown(PLAN_MD.read_text()))

    meta_items = "\n".join(
        f'<div class="meta-item"><span class="meta-label">{label}</span>'
        f'<span class="meta-value">{value}</span></div>'
        for label, value in METADATA
    )

    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{TITLE}</title>
<style>
{css}
</style></head>
<body>
<div class="app-bar"><span class="app-name">Agile Project Plan \u00b7 YumFood-CICD</span><div class="app-actions"><button type="button" class="primary" onclick="window.print()">Print / Save PDF</button></div></div>
<article class="page"><div class="top-rule"></div><header><section class="masthead"><div class="masthead-logo"><img src="data:image/png;base64,{logo_b64}" alt="PCCOE logo"></div><div class="masthead-copy"><p>Pimpri Chinchwad Education Trust&#x27;s</p><p>Pimpri Chinchwad College of Engineering</p><p class="department">Department of Information Technology</p></div></section><div class="document-band">{BAND}</div><p class="academic-year">{ACADEMIC_YEAR}</p><div style="text-align:center"><span class="assignment-label">{LABEL}</span></div><h1>{TITLE}</h1><hr class="title-rule"><section class="metadata">
{meta_items}
</section></header><main>
{body}
</main><section class="signature"><div class="signature-box">Student Signature &amp; Date</div><div class="signature-box">Faculty Signature &amp; Date</div></section><footer class="footer">{FOOTER}</footer></article>
</body></html>
"""


def find_chrome() -> str:
    for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
        path = shutil.which(name)
        if path:
            return path
    raise SystemExit("Chrome/Chromium not found on PATH")


def build_pdf(html_path: Path) -> None:
    chrome = find_chrome()
    with tempfile.TemporaryDirectory(prefix="plan-pdf-chrome-") as profile:
        subprocess.run(
            [
                chrome,
                "--headless",
                "--disable-gpu",
                "--no-first-run",
                "--no-default-browser-check",
                f"--user-data-dir={profile}",
                "--no-pdf-header-footer",
                "--virtual-time-budget=10000",
                f"--print-to-pdf={OUT_PDF}",
                html_path.as_uri(),
            ],
            check=True,
        )


def main() -> None:
    html = build_html()
    OUT_HTML.write_text(html)
    print(f"HTML written: {OUT_HTML}")
    build_pdf(OUT_HTML)
    print(f"PDF  written: {OUT_PDF}")


if __name__ == "__main__":
    sys.exit(main())
