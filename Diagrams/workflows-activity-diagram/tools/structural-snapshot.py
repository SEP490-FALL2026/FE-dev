"""Structural snapshot of the 22 Workflow drawio sources + Mermaid blocks in index.md.

Ad-hoc verification helper for the Workflow English-label pass (this run only).
Dumps, per page: node id/type/lane/parent, edge id/source/target/style/guard-text,
node/edge counts, decision out-degree, final nodes. Used to diff before/after the
label translation and confirm topology is untouched. Not part of the permanent
tool suite; safe to delete after the review is closed.

Usage: python structural-snapshot.py <label> > snapshot-<label>.json
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DRAWIO_DIR = ROOT / "drawio"
INDEX_PATH = ROOT / "index.md"


def cell_type(style):
    style = style or ""
    if "shape=endState" in style:
        return "activityFinal"
    if "shape=step" in style:
        return "acceptEvent"
    if "rhombus" in style:
        return "decision"
    if "ellipse" in style:
        return "flowFinal"
    if "swimlane" in style:
        return "swimlane"
    if "shape=note" in style:
        return "note"
    if style.startswith("text;"):
        return "text"
    return "action"


def norm(value):
    if value is None:
        return ""
    text = re.sub(r"<[^>]+>", " ", value)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def lane_of(cell_id, parent_map, value_map, style_map):
    pid = parent_map.get(cell_id)
    seen = set()
    while pid and pid not in seen:
        seen.add(pid)
        if "swimlane" in (style_map.get(pid) or ""):
            return norm(value_map.get(pid))
        pid = parent_map.get(pid)
    return ""


def snapshot_file(path):
    tree = ET.parse(path)
    root = tree.getroot()
    cells = root.findall(".//mxCell")
    parent_map, value_map, style_map = {}, {}, {}
    for c in cells:
        cid = c.get("id")
        parent_map[cid] = c.get("parent")
        value_map[cid] = c.get("value")
        style_map[cid] = c.get("style")

    nodes = []
    edges = []
    for c in cells:
        cid = c.get("id")
        if c.get("vertex") == "1":
            style = c.get("style") or ""
            if "swimlane" in style or style.startswith("text;"):
                continue
            geom = c.find("mxGeometry")
            bounds = None
            if geom is not None:
                bounds = [geom.get("x"), geom.get("y"), geom.get("width"), geom.get("height")]
            nodes.append({
                "id": cid,
                "type": cell_type(style),
                "lane": lane_of(cid, parent_map, value_map, style_map),
                "label": norm(c.get("value")),
                "bounds": bounds,
            })
        if c.get("edge") == "1":
            style = c.get("style") or ""
            edges.append({
                "id": cid,
                "source": c.get("source"),
                "target": c.get("target"),
                "guard": norm(c.get("value")),
                "dashed": "dashed=1" in style,
            })

    decision_out = {}
    for e in edges:
        src_type = None
        for n in nodes:
            if n["id"] == e["source"]:
                src_type = n["type"]
                break
        if src_type == "decision" and not e["dashed"]:
            decision_out[e["source"]] = decision_out.get(e["source"], 0) + 1

    return {
        "nodeCount": len(nodes),
        "edgeCount": len(edges),
        "controlEdgeCount": sum(1 for e in edges if not e["dashed"]),
        "decisionOutDegree": decision_out,
        "nodes": sorted(nodes, key=lambda n: n["id"]),
        "edges": sorted(edges, key=lambda e: (e["source"] or "", e["target"] or "", e["id"])),
    }


def mermaid_blocks():
    text = INDEX_PATH.read_text(encoding="utf-8")
    blocks = {}
    for m in re.finditer(r"### (3\.\d+[a-z]?\.) `(WF-\d+a?)`.*?```mermaid\s*(.*?)```", text, re.S):
        heading, wf_id, code = m.groups()
        node_ids = sorted(set(re.findall(r"^\s*([A-Za-z0-9_]+)(?:\[|\{|\(|>|\s*--)", code, re.M)))
        edge_count = len(re.findall(r"-->", code)) + len(re.findall(r"-\.->", code))
        blocks[wf_id] = {
            "heading": heading,
            "charCount": len(code),
            "edgeArrowCount": edge_count,
            "nodeIdSample": node_ids,
        }
    return blocks


def main():
    label = sys.argv[1] if len(sys.argv) > 1 else "snapshot"
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    result = {"label": label, "pages": {}, "mermaid": mermaid_blocks()}
    for f in sorted(DRAWIO_DIR.glob("WF-*.drawio")):
        result["pages"][f.stem] = snapshot_file(f)
    text = json.dumps(result, ensure_ascii=False, indent=1)
    if out_path:
        out_path.write_text(text, encoding="utf-8")
        print(f"wrote {out_path} ({len(text)} chars)")
    else:
        sys.stdout.buffer.write(text.encode("utf-8"))


if __name__ == "__main__":
    main()
