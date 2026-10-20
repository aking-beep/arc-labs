#!/usr/bin/env python3
"""Check that relative markdown links in this repository resolve.

External URLs are deliberately not checked: a flaky third-party host should never fail
the pipeline's build. Anchors are stripped — this verifies the file exists, not the heading.

    python3 tools/check_links.py
"""

from __future__ import annotations

import pathlib
import re
import sys
from urllib.parse import unquote

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
SKIP_SCHEME = re.compile(r"^(https?:|mailto:|tel:|#)")
# Inline code and fenced blocks hold examples, not links.
FENCE = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE = re.compile(r"`[^`\n]*`")


def main() -> int:
    broken: list[str] = []
    checked = 0

    for path in sorted(ROOT.rglob("*.md")):
        if ".git" in path.parts:
            continue
        text = INLINE_CODE.sub(" ", FENCE.sub(" ", path.read_text()))
        for target in LINK.findall(text):
            if SKIP_SCHEME.match(target):
                continue
            checked += 1
            resolved = (path.parent / unquote(target.split("#", 1)[0])).resolve()
            if not resolved.exists():
                broken.append(f"{path.relative_to(ROOT)} -> {target}")

    for item in broken:
        print(f"error broken relative link: {item}")
    if broken:
        print(f"\nFAIL {len(broken)} broken link(s) of {checked} checked")
        return 1
    print(f"OK {checked} relative link(s) resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
