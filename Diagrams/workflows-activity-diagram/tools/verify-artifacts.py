"""Kiểm chứng độc lập artifact Workflow: 22 PNG phải giải mã được và manifest phải khớp hash.

Đây là phép kiểm ở phía *xác minh*, tách khỏi cổng chặn trong `export-workflows.ps1`:
chạy được mà không cần draw.io, nên reviewer độc lập tái kiểm chứng được mà không phải xuất lại.

Mỗi PNG phải đạt cả bốn điều kiện (finding QĐ30-C02):
  1. Pillow `Image.open(...).load()` chạy được;
  2. Pillow `Image.verify()` chạy được (mở lại file, vì verify() làm hỏng đối tượng ảnh);
  3. có chunk kết thúc `IEND` hợp lệ;
  4. width và height đều lớn hơn 0.

Chạy:  python tools/verify-artifacts.py [--json <đường dẫn evidence>]
Thoát 0 khi 22/22 PNG hợp lệ và toàn bộ entry manifest khớp; khác 0 nếu có lỗi.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import struct
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PNG_DIR = ROOT / "png"
MANIFEST = ROOT / "artifact-manifest.json"
REPO_ROOT = ROOT.parent.parent.parent
EXPECTED_PNG = 22
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def inspect_png(path: Path) -> dict:
    data = path.read_bytes()
    problems: list[str] = []
    if data[:8] != PNG_SIGNATURE:
        problems.append("chữ ký PNG sai")

    offset, saw_iend, width, height = 8, False, 0, 0
    while offset + 8 <= len(data):
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        chunk = data[offset + 4 : offset + 8]
        if offset + 12 + length > len(data):
            problems.append(f"chunk {chunk.decode('ascii', 'replace')} bị cắt cụt")
            break
        if chunk == b"IHDR":
            width, height = struct.unpack(">II", data[offset + 8 : offset + 16])
        if chunk == b"IEND":
            saw_iend = True
            break
        offset += 12 + length
    if not saw_iend:
        problems.append("thiếu chunk IEND hợp lệ")
    if width <= 0 or height <= 0:
        problems.append(f"kích thước không hợp lệ {width}x{height}")

    try:
        image = Image.open(path)
        image.load()
        if image.size[0] <= 0 or image.size[1] <= 0:
            problems.append("kích thước sau load <= 0")
    except Exception as exc:  # pragma: no cover - chỉ chạy khi file hỏng
        problems.append(f"Image.load() lỗi: {type(exc).__name__}: {exc}")
    try:
        Image.open(path).verify()
    except Exception as exc:  # pragma: no cover - chỉ chạy khi file hỏng
        problems.append(f"Image.verify() lỗi: {type(exc).__name__}: {exc}")

    return {
        "page": path.stem,
        "bytes": len(data),
        "width": width,
        "height": height,
        "sha256": hashlib.sha256(data).hexdigest(),
        "ok": not problems,
        "problems": problems,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", dest="json_path")
    args = parser.parse_args()

    errors: list[str] = []

    png_files = sorted(PNG_DIR.glob("WF-*.png"))
    if len(png_files) != EXPECTED_PNG:
        errors.append(f"số PNG: chờ {EXPECTED_PNG}, thấy {len(png_files)}")
    png_results = [inspect_png(path) for path in png_files]
    for result in png_results:
        for problem in result["problems"]:
            errors.append(f"PNG {result['page']}: {problem}")
    png_pass = sum(1 for result in png_results if result["ok"])

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8-sig"))
    entries = list(manifest.get("sources", [])) + list(manifest.get("artifacts", []))
    manifest_pass = 0
    for entry in entries:
        path = REPO_ROOT / entry["path"]
        if not path.exists():
            errors.append(f"manifest: thiếu file {entry['path']}")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest.lower() == entry["sha256"].lower():
            manifest_pass += 1
        else:
            errors.append(f"manifest: lệch hash {entry['path']}")

    result = {
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "checker": {
            "path": str(Path(__file__).resolve()),
            "sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        },
        "pillow": Image.__version__,
        "png": {"expected": EXPECTED_PNG, "found": len(png_files), "passed": png_pass, "results": png_results},
        "manifest": {"entries": len(entries), "matched": manifest_pass, "path": str(MANIFEST)},
        "status": "pass" if not errors else "fail",
        "errors": errors,
    }

    if args.json_path:
        out = Path(args.json_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    print(
        f"status={result['status']} png={png_pass}/{len(png_files)} "
        f"manifest={manifest_pass}/{len(entries)} errors={len(errors)}"
    )
    for error in errors:
        print("  -", error)
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
