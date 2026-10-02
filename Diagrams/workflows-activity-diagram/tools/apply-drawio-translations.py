"""Apply exact value="old"->value="new" substitutions to Workflow drawio sources.

Ad-hoc helper for the Workflow English-label pass (this run only). Reads a JSON map
{"WF-03.drawio": {"Vietnamese exact attribute text": "English replacement", ...}, ...}
and for every (old, new) pair does a literal, count-checked replacement of
value="<old>" -> value="<new>" in the raw file text (also matches value='<old>' and a
bare name="<old>" occurrence on the <diagram> line, since page titles use that
attribute). Refuses to write a file if any old string is not found exactly once,
so a typo never silently no-ops and a collision never double-replaces. This never
touches geometry, ids, source/target, or style — only the literal quoted text of
value/name attributes — so topology cannot change as a side effect.

Usage: python apply-drawio-translations.py translations.json
Prints one line per file with the number of replacements applied.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DRAWIO_DIR = ROOT / "drawio"


def apply_one(text, old, new, file_label):
    replaced = 0
    for attr in ('value="', "value='", 'name="'):
        needle = f'{attr}{old}{attr[-1]}'
        count = text.count(needle)
        if count > 1:
            raise SystemExit(f"{file_label}: '{old}' via {attr.strip(chr(39)+chr(34))} matches {count} times, expected <=1 -- refine the old string")
        if count == 1:
            replacement = f'{attr}{new}{attr[-1]}'
            text = text.replace(needle, replacement, 1)
            replaced += 1
    if replaced == 0:
        raise SystemExit(f"{file_label}: NOT FOUND: {old!r}")
    if replaced > 1:
        raise SystemExit(f"{file_label}: '{old}' matched in more than one attribute kind ({replaced}x) -- ambiguous, refine")
    return text


def main():
    map_path = Path(sys.argv[1])
    data = json.loads(map_path.read_text(encoding="utf-8"))
    total = 0
    for file_name, pairs in data.items():
        path = DRAWIO_DIR / file_name
        text = path.read_text(encoding="utf-8")
        for old, new in pairs.items():
            text = apply_one(text, old, new, file_name)
            total += 1
        path.write_text(text, encoding="utf-8")
        print(f"{file_name}: {len(pairs)} replacements applied")
    print(f"TOTAL: {total} replacements across {len(data)} file(s)")


if __name__ == "__main__":
    main()
