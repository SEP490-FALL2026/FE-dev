"""Give blocked associations one or two bend points instead of a straight line.

Only associations whose straight line passes through a shape (use case, actor figure or
label, the boundary title, an «include»/«extend» keyword) are touched. For each, every free
point on a 20-unit grid inside the boundary is tried as a bend; a candidate is kept only if
both legs are clear of shapes and neither end nearly merges with another line of the same
actor/use case; among those the one adding the fewest crossings, then the shortest, wins.
If no single bend works, pairs of bends are tried on a coarser grid. The result is written
to "waypoints" in layouts.json; the checker re-verifies the drawn XML independently.

  python -X utf8 detour_associations.py [--layout FILE] [--dry-run]
"""
import argparse
import json
import math
import sys

import build_use_case_diagrams as B
import usecase_model as M

MERGE_DEG = 9.0


def legs_of(scene, aid, uc, wps):
    fig, _ = scene.actor_boxes(aid)
    fc = (fig[0] + fig[2] / 2, fig[1] + fig[3] / 2)
    (uc_c, rx, ry) = scene.uc_ellipse(uc)
    if not wps:
        return [(tuple(B.clip_rect(fc, uc_c, fig)), tuple(B.clip_ellipse(uc_c, fc, rx, ry)))]
    wps = [tuple(pt) for pt in wps]
    pts = [tuple(B.clip_rect(fc, wps[0], fig))] + wps + [tuple(B.clip_ellipse(uc_c, wps[-1], rx, ry))]
    return list(zip(pts, pts[1:]))


def blocked(obs, labels, aid, uc, legs):
    last = len(legs) - 1
    for k, (p, q) in enumerate(legs):
        for okind, key, geo in obs:
            if okind == "uc":
                if key == uc and k == last:
                    continue
                if B.seg_ellipse_hit(p, q, *geo):
                    return True
            elif okind == "actor":
                if key == aid and k == 0:
                    continue
                if B.seg_rect_hit(p, q, geo, 4):
                    return True
            elif B.seg_rect_hit(p, q, geo, 2 if key == aid else 4):
                return True
        for lb in labels:
            if B.seg_rect_hit(p, q, lb, 2):
                return True
    return False


def angle(p, q):
    return math.atan2(q[1] - p[1], q[0] - p[0])


def merges(first, last, others_from_actor, others_into_uc):
    a0 = angle(*first)
    if any(abs(math.remainder(a0 - angle(*s), 2 * math.pi)) < math.radians(MERGE_DEG) for s in others_from_actor):
        return True
    a1 = angle(last[1], last[0])
    return any(abs(math.remainder(a1 - angle(s[1], s[0]), 2 * math.pi)) < math.radians(MERGE_DEG) for s in others_into_uc)


def crossings(legs, others, same=()):
    """Weighted crossings: a crossing with a line of the same actor/use case counts 20 (looks like a knot)."""
    n = 0
    for p, q in legs:
        for a, b in others:
            if B.segs_cross(p, q, a, b):
                n += 20 if (a, b) in same else 1
            elif B.seg_dist(p, q, a, b) < 3:
                n += 5
    return n


def sharp(legs, min_deg=100.0):
    """True when a bend turns back on itself (interior angle below min_deg)."""
    for (p, q), (_, r) in zip(legs, legs[1:]):
        v1, v2 = (p[0] - q[0], p[1] - q[1]), (r[0] - q[0], r[1] - q[1])
        n1, n2 = math.hypot(*v1), math.hypot(*v2)
        if n1 == 0 or n2 == 0:
            return True
        cos = max(-1.0, min(1.0, (v1[0] * v2[0] + v1[1] * v2[1]) / (n1 * n2)))
        if math.degrees(math.acos(cos)) < min_deg:
            return True
    return False


def solve(lay, max_pairs=True):
    scene = B.Scene(lay)
    wp = lay.setdefault("waypoints", {})
    obs = scene.obstacles()
    edges = scene.edges()
    labels = [scene.rel_label_box(rid, pts[0], pts[1])[0] for rid, kind, s, t, pts in edges if kind in ("include", "extend")]
    fixed = [(pts[i], pts[i + 1]) for rid, kind, s, t, pts in edges if kind != "assoc" for i in range(len(pts) - 1)]

    def all_legs(skip=None):
        return {M.association_id(a, u): (a, u, legs_of(scene, a, u, wp.get(M.association_id(a, u), [])))
                for a, u, _ in M.ASSOCIATIONS if M.association_id(a, u) != skip}

    # only the associations the layout evaluation (and the checker) report as passing through a shape
    flagged = {rid for rid, _ in B.evaluate(scene)["collision"]}
    todo = [M.association_id(a, u) for a, u, _ in M.ASSOCIATIONS if M.association_id(a, u) in flagged]
    x0, y0 = scene.bx + 12, scene.by + 12
    x1, y1 = scene.bx + scene.bw - 12, scene.by + scene.bh - 12
    fine = [(x, y) for x in range(int(x0), int(x1), 20) for y in range(int(y0), int(y1), 20)]
    coarse = [(x, y) for x in range(int(x0), int(x1), 40) for y in range(int(y0), int(y1), 40)]
    report = {}
    for sid in todo:
        aid, uc = sid[3:6], sid[7:]
        others = all_legs(skip=sid)
        other_segs = [seg for _, _, ls in others.values() for seg in ls] + fixed
        from_actor = [ls[0] for a, u, ls in others.values() if a == aid]
        into_uc = [ls[-1] for a, u, ls in others.values() if u == uc]
        same = {seg for a, u, ls in others.values() if a == aid or u == uc for seg in ls}
        straight = math.dist(scene.actor_center(aid), scene.uc_center(uc))
        free = [pt for pt in fine if not any(
            (o[0] == "uc" and ((pt[0] - o[2][0][0]) / o[2][1]) ** 2 + ((pt[1] - o[2][0][1]) / o[2][2]) ** 2 <= 1.3)
            or (o[0] != "uc" and B.seg_rect_hit(pt, pt, o[2], 10)) for o in obs)]
        best = None
        for pt in free:
            legs = legs_of(scene, aid, uc, [pt])
            if sharp(legs) or blocked(obs, labels, aid, uc, legs) or merges(legs[0], legs[-1], from_actor, into_uc):
                continue
            length = sum(math.dist(p, q) for p, q in legs)
            n = crossings(legs, other_segs, same)
            key = (n * 250 + (length - straight), n, length - straight)
            if best is None or key < best[0]:
                best = (key, [list(pt)])
        if best is None and max_pairs:
            fset = set(free)
            cfree = [pt for pt in coarse if pt in fset]
            for p1 in cfree:
                for p2 in cfree:
                    if p1 == p2 or math.dist(p1, p2) > 700:
                        continue
                    legs = legs_of(scene, aid, uc, [p1, p2])
                    if sharp(legs) or blocked(obs, labels, aid, uc, legs) or merges(legs[0], legs[-1], from_actor, into_uc):
                        continue
                    length = sum(math.dist(p, q) for p, q in legs)
                    n = crossings(legs, other_segs, same)
                    key = (n * 250 + (length - straight) + 60, n, length - straight)
                    if best is None or key < best[0]:
                        best = (key, [list(p1), list(p2)])
        if best is None:
            report[sid] = "no clear route"
            continue
        wp[sid] = best[1]
        report[sid] = f"bends={len(best[1])} weighted-crossings={best[0][1]} extra={best[0][2]:.0f}"
    return lay, report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--layout", default=B.LAYOUT_FILE)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    lay = json.load(open(args.layout, encoding="utf-8"))
    lay, report = solve(lay)
    for k, v in report.items():
        print(k, v)
    print("after:", {k: len(v) for k, v in B.evaluate(B.Scene(lay)).items()})
    if not args.dry_run:
        json.dump(lay, open(args.layout, "w", encoding="utf-8"), indent=1)
    return 0 if all(v != "no clear route" for v in report.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
