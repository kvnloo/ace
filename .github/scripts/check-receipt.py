#!/usr/bin/env python3
"""Check a Verified OSS Loop evidence receipt. Stdlib only. Does not merge."""
from __future__ import annotations

import argparse
import re
import sys
from typing import Any

SHA_RE = re.compile(r"^[0-9a-f]{7,40}$", re.I)
REQUIRED_TOP = ("issue", "base_revision", "head_revision")


def extract_yaml_blocks(text: str) -> list[str]:
    blocks = re.findall(r"```(?:ya?ml)\s*\n(.*?)```", text, re.S | re.I)
    if blocks:
        return blocks
    stripped = text.strip()
    if stripped.startswith("---") or re.search(r"^(issue|base_revision|head_revision)\s*:", stripped, re.M):
        return [text]
    return [text]


def parse_simple_yaml(block: str) -> dict[str, Any]:
    """Tiny YAML subset: top-level keys and one nested mapping (tests)."""
    data: dict[str, Any] = {}
    current_map: dict[str, str] | None = None
    current_key: str | None = None
    for raw in block.splitlines():
        if not raw.strip() or raw.strip().startswith("#"):
            continue
        nested = re.match(r"^  ([A-Za-z0-9_]+)\s*:\s*(.*)$", raw)
        if nested and current_map is not None:
            current_map[nested.group(1)] = nested.group(2).strip()
            continue
        top = re.match(r"^([A-Za-z0-9_]+)\s*:\s*(.*)$", raw)
        if not top:
            continue
        key, val = top.group(1), top.group(2).strip()
        if val == "" or val == "|":
            current_map = {}
            data[key] = current_map
            current_key = key
            continue
        data[key] = val
        current_map = None
        current_key = key
    _ = current_key
    return data


def pick_receipt(text: str) -> dict[str, Any]:
    best: dict[str, Any] = {}
    score = -1
    for block in extract_yaml_blocks(text):
        parsed = parse_simple_yaml(block)
        hits = sum(1 for k in REQUIRED_TOP if k in parsed)
        if hits > score:
            best, score = parsed, hits
    return best


def nonempty(val: Any) -> bool:
    if val is None:
        return False
    if isinstance(val, dict):
        return any(nonempty(v) for v in val.values())
    return str(val).strip() not in ("", "null", "~")


def sha_ok(val: Any) -> bool:
    s = str(val).strip().lower()
    return bool(SHA_RE.match(s))


def heads_match(receipt_head: str, expected: str) -> bool:
    a, b = receipt_head.strip().lower(), expected.strip().lower()
    return a == b or a.startswith(b) or b.startswith(a)


def check(text: str, expected_head: str | None = None) -> list[str]:
    errors: list[str] = []
    data = pick_receipt(text)
    if not data:
        return ["no evidence YAML found (need a ```yaml receipt with issue/base_revision/head_revision)"]

    for key in REQUIRED_TOP:
        if key not in data:
            errors.append(f"missing {key}")
        elif not nonempty(data[key]):
            errors.append(f"{key} is empty")

    if "base_revision" in data and nonempty(data["base_revision"]) and not sha_ok(data["base_revision"]):
        errors.append("base_revision is not a git SHA")
    if "head_revision" in data and nonempty(data["head_revision"]) and not sha_ok(data["head_revision"]):
        errors.append("head_revision is not a git SHA")

    tests = data.get("tests")
    if not isinstance(tests, dict):
        errors.append("missing tests mapping with red/green")
    else:
        if not nonempty(tests.get("red")):
            errors.append("tests.red is empty")
        if not nonempty(tests.get("green")):
            errors.append("tests.green is empty")

    if expected_head:
        head = str(data.get("head_revision") or "").strip()
        if not head:
            errors.append("head_revision missing; cannot bind to exact head")
        elif not heads_match(head, expected_head):
            errors.append(
                f"head_revision {head} does not match PR head {expected_head} "
                "(tests from another SHA are not evidence)"
            )
    return errors


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Validate a Verified OSS Loop evidence receipt")
    p.add_argument("--file", help="PR body or receipt markdown/YAML (default: stdin)")
    p.add_argument("--head", help="Expected PR head SHA (exact-head check)")
    args = p.parse_args(argv)
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            text = f.read()
    else:
        text = sys.stdin.read()
    errors = check(text, args.head)
    if errors:
        print("receipt check failed:")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("ok: evidence receipt is complete")
    return 0


if __name__ == "__main__":
    sys.exit(main())
