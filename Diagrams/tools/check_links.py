"""Check that relative Markdown links point to files — and anchors — that exist.

    python tools/check_links.py [--all-docs] [extra.md ...]      (from Docs/Diagrams)

Scans every ``*.md`` under the five in-scope diagram folders plus ``index.md``, ``tools/README.md`` and the
other ``*.md`` directly in ``Diagrams/``, and any extra files given on the command line (e.g. the BRD and Scope
documents). ``--all-docs`` adds every current ``*.md`` of the Docs repo except history/evidence folders
(``Reviews/``, ``Reports/``, ``Requiments/_backup-*``, ``Requiments/Origins/``, ``*/evidence/``, ``node_modules``).

External links (``http``, ``mailto``) are skipped. For links to a Markdown file (or to ``#anchor`` in the same
file) the anchor is checked against the target's headings (GitHub-style slug: lower case, punctuation removed
except ``-``, spaces to ``-``, Vietnamese letters kept, duplicates ``-1``, ``-2``), explicit ``{#id}`` and
``<a id="…">`` / ``<a name="…">``. Anchors into non-Markdown files are not checked.
"""
from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

DIAGRAMS = Path(__file__).resolve().parent.parent
DOCS = DIAGRAMS.parent
FOLDERS = ["context-diagram", "functional-decomposition-diagram", "main-workflows-activity-diagram",
           "workflows-activity-diagram", "user-flows"]
SKIP_DIRS = ("Reviews", "Reports", "node_modules", "evidence", "Origins", ".git")
LINK = re.compile(r"\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+\"[^\"]*\")?\)")
HEAD = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
CUSTOM = re.compile(r"\{#([^}\s]+)\}")
HTML_ID = re.compile(r"<a\s+(?:id|name)=\"([^\"]+)\"")


def slug(text: str) -> str:
    text = CUSTOM.sub("", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)       # links → text
    text = unicodedata.normalize("NFC", text).strip().lower()
    text = "".join(ch for ch in text if ch.isalnum() or ch in " -_" or unicodedata.category(ch).startswith("M"))
    return text.replace(" ", "-")


_anchor_cache: dict[Path, set[str]] = {}


def anchors(md: Path) -> set[str]:
    if md in _anchor_cache:
        return _anchor_cache[md]
    found: set[str] = set()
    seen: dict[str, int] = {}
    in_code = False
    for line in md.read_text(encoding="utf-8").splitlines():
        if line.lstrip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        found.update(HTML_ID.findall(line))
        m = HEAD.match(line)
        if m:
            found.update(CUSTOM.findall(m.group(2)))
            s = slug(m.group(2))
            n = seen.get(s, 0)
            found.add(s if n == 0 else f"{s}-{n}")
            seen[s] = n + 1
    _anchor_cache[md] = found
    return found


def targets(args):
    files = [DIAGRAMS / "index.md", DIAGRAMS / "tools" / "README.md"] + sorted(DIAGRAMS.glob("*.md"))
    for f in FOLDERS:
        files += sorted((DIAGRAMS / f).rglob("*.md"))
    if "--all-docs" in args:
        for f in sorted(DOCS.rglob("*.md")):
            rel = f.relative_to(DOCS).parts
            if any(p in SKIP_DIRS or p.startswith("_backup") for p in rel[:-1]):
                continue
            files.append(f)
    files += [Path(a).resolve() for a in args if not a.startswith("--")]
    out, seen = [], set()
    for f in files:
        r = f.resolve()
        if r.exists() and r not in seen:
            seen.add(r)
            out.append(r)
    return out


def main():
    args = sys.argv[1:]
    bad = checked = anchored = 0
    for md in targets(args):
        text = md.read_text(encoding="utf-8")
        in_code = False
        for lineno, line in enumerate(text.splitlines(), 1):
            if line.lstrip().startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            for m in LINK.finditer(line):
                href = m.group(1)
                if href.startswith("<"):
                    href = href[1:-1]
                if href.startswith(("http://", "https://", "mailto:")):
                    continue
                path, _, frag = href.partition("#")
                path = unquote(path)
                target = (md.parent / path).resolve() if path else md
                checked += 1
                where = f"{md.relative_to(DOCS).as_posix()}:{lineno}"
                if not target.exists():
                    bad += 1
                    print(f"BROKEN {where} -> {href}")
                    continue
                if frag and target.suffix.lower() == ".md":
                    anchored += 1
                    want = unicodedata.normalize("NFC", unquote(frag)).lower()
                    if want not in anchors(target):
                        bad += 1
                        print(f"ANCHOR {where} -> {href}")
    print(f"{'FAIL' if bad else 'ok'} links checked={checked} anchors checked={anchored} broken={bad}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
