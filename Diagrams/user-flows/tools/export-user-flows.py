"""Xuất SaaS-Sentry-Luong-man-hinh.html và SaaS-Sentry-User-Flows.pdf từ 16 tệp
drawio/UF-xx.drawio (nguồn hình) và index.md Phần 11 (nguồn tiêu đề/vai trò/ưu tiên).

Chạy tại thư mục user-flows:
    python tools/export-user-flows.py
    python tools/export-user-flows.py --drawio "C:\\Program Files\\draw.io\\draw.io.exe"

Yêu cầu draw.io Desktop (mặc định dò `C:\\Program Files\\draw.io\\draw.io.exe`,
ghi đè bằng --drawio hoặc biến môi trường DRAWIO_PATH).

Pipeline (không sửa tay bất kỳ tệp đầu ra nào — sửa index.md/.drawio rồi chạy lại):
  0. Chạy K0–K10 của tools/check-user-flow-syntax.py trên 16 khối Mermaid và 16 .drawio;
     có bất kỳ vi phạm nào thì dừng, không ghi HTML/PDF/manifest.
  1. Đọc index.md Phần 11, lấy tiêu đề/vai trò/ưu tiên của từng UF-xx bằng đúng
     regex mà tools/generate-uf-drawio.py dùng để sinh .drawio, để hai bước không
     thể lệch cách đọc nguồn.
  2. Gộp 16 trang .drawio (thứ tự UF-01..UF-16) thành một tệp .drawio nhiều trang
     tạm thời, mỗi trang giữ nguyên id/name gốc.
  3. Xuất PDF vector nhiều trang từ tệp gộp: một UF một trang, nhúng XML để có thể
     mở lại bằng draw.io.
  4. Xuất SVG riêng từng UF (không nhúng font, theme sáng cố định) để nhúng thẳng
     vào HTML — trang xem không phụ thuộc mạng hay font ngoài để hiển thị đúng hình.
  5. Dựng HTML tĩnh: thanh lọc theo vai trò (Tất cả, ★ Mức 1, từng vai trò trong
     ROLE_ORDER, Đặt lại, bộ đếm), mục lục 16 UF, mỗi UF một section có tiêu đề/vai
     trò/ưu tiên lấy từ index.md và SVG nhúng trực tiếp. Vai trò lạ thì dừng xuất.
  6. Ghi manifest JSON cạnh hai tệp xuất: input/output kèm SHA-256, thời điểm,
     phiên bản draw.io và lệnh dùng.
"""
import argparse
import hashlib
import html
import io
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.md"
DRAWIO_DIR = ROOT / "drawio"
HTML_OUT = ROOT / "SaaS-Sentry-Luong-man-hinh.html"
PDF_OUT = ROOT / "SaaS-Sentry-User-Flows.pdf"
MANIFEST_OUT = ROOT / "SaaS-Sentry-User-Flows.export-manifest.json"

DEFAULT_DRAWIO_CANDIDATES = [
    r"C:\Program Files\draw.io\draw.io.exe",
    r"C:\Program Files (x86)\draw.io\draw.io.exe",
]


def find_drawio(explicit):
    if explicit:
        p = Path(explicit)
        if not p.is_file():
            sys.exit(f"Không thấy draw.io Desktop tại: {explicit}")
        return p
    import os

    env = os.environ.get("DRAWIO_PATH")
    if env and Path(env).is_file():
        return Path(env)
    for c in DEFAULT_DRAWIO_CANDIDATES:
        if Path(c).is_file():
            return Path(c)
    sys.exit("Không tìm thấy draw.io Desktop. Dùng --drawio <path> hoặc biến môi trường DRAWIO_PATH.")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


# --- Cùng cách đọc nguồn với tools/generate-uf-drawio.py, để hai bước không lệch ---

def section(text, uf):
    m = re.search(r"^### 11\.\d+[a-z]?\. `%s` — (.+)$" % uf, text, re.M)
    if not m:
        sys.exit(f"Không thấy mục {uf} trong index.md")
    body = text[m.end():]
    nxt = re.search(r"^### ", body, re.M)
    body = body[: nxt.start()] if nxt else body
    return m.group(1).strip(), body


def meta(body):
    def row(key):
        m = re.search(r"^\| \*\*%s\*\*\s*\|\s*(.*?)\s*\|\s*$" % re.escape(key), body, re.M)
        return re.sub(r"[*`]", "", m.group(1)).strip() if m else ""

    return row("Vai trò"), row("Ưu tiên trình bày")


# Vai trò người dùng hiện hành (BRD 4.1). Mỗi token vai trò đọc từ ô "Vai trò" phải
# thuộc danh sách này, và mỗi vai trò phải có ít nhất một UF — lệch thì dừng xuất.
ROLE_ORDER = ["Employee", "Manager", "IT Admin", "Finance", "Người duyệt chi", "Super Admin"]


def parse_roles(uf, role_cell):
    roles = []
    for part in role_cell.split("+"):
        name = re.sub(r"\(.*?\)", "", part.split(" · ")[0]).strip()
        if name not in ROLE_ORDER:
            sys.exit(f"{uf}: vai trò '{name}' (ô Vai trò: '{role_cell}') không thuộc {ROLE_ORDER}")
        if name not in roles:
            roles.append(name)
    if not roles:
        sys.exit(f"{uf}: ô Vai trò trống")
    return roles


def parse_priority(uf, prio_cell):
    m = re.match(r"MỨC\s*([123])\b", prio_cell)
    if not m:
        sys.exit(f"{uf}: không đọc được mức ưu tiên từ '{prio_cell}'")
    return int(m.group(1))


def load_uf_meta(uf_ids):
    text = INDEX.read_text(encoding="utf-8")
    out = {}
    for uf in uf_ids:
        title_raw, body = section(text, uf)
        title = re.sub(r"\s*\*\(.*?\)\*", "", title_raw).replace("`", "").strip()
        role, prio = meta(body)
        out[uf] = {"title": title, "role": role, "priority": prio,
                   "roles": parse_roles(uf, role), "level": parse_priority(uf, prio)}
    unused = [r for r in ROLE_ORDER if not any(r in m["roles"] for m in out.values())]
    if unused:
        sys.exit(f"Vai trò không có UF nào: {unused} — kiểm lại ROLE_ORDER hoặc index.md")
    return out


def discover_uf_ids():
    files = sorted(DRAWIO_DIR.glob("UF-*.drawio"), key=lambda p: int(re.search(r"\d+", p.stem).group()))
    if len(files) != 16:
        sys.exit(f"Kỳ vọng đúng 16 tệp UF-*.drawio, tìm thấy {len(files)}: {[f.name for f in files]}")
    return [f.stem for f in files], files


def validate_all(uf_ids, files, drawio_exe):
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "check_user_flow_syntax", Path(__file__).resolve().parent / "check-user-flow-syntax.py")
    checker = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(checker)
    text = INDEX.read_text(encoding="utf-8")
    failed = []
    for uf, f in zip(uf_ids, files):
        report = checker.check_uf(uf, text, f.read_text(encoding="utf-8"), drawio_exe)
        if report["violations"]:
            failed.append(uf)
            for item in report["violations"]:
                print(f"{uf} {item['check']}: {item['message']}", file=sys.stderr)
    if failed:
        sys.exit(f"TỪ CHỐI XUẤT — vi phạm K0–K10 ở {', '.join(failed)}; không ghi HTML/PDF/manifest.")
    print(f"K0–K10: {len(uf_ids)}/{len(uf_ids)} UF pass")


def build_combined(files, staging_dir: Path) -> Path:
    combined_path = staging_dir / "combined.drawio"
    root = ET.Element("mxfile", {"host": "app.diagrams.net", "type": "device"})
    for f in files:
        src = ET.parse(f).getroot()
        for diagram in src.findall("diagram"):
            root.append(diagram)
    ET.ElementTree(root).write(combined_path, encoding="utf-8", xml_declaration=True)
    return combined_path


def run_drawio(drawio_exe: Path, args: list) -> str:
    cmd = [str(drawio_exe), "-x"] + args
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"Lệnh thất bại (exit {proc.returncode}): {' '.join(cmd)}\n{proc.stderr}")
    return " ".join(f'"{a}"' if " " in a else a for a in cmd)


def verify_pdf_pages(pdf_path: Path, expected: int) -> None:
    """Chặn ngay nếu PDF không đúng một trang mỗi UF (trang trắng thừa hoặc bị tách trang)."""
    try:
        from pypdf import PdfReader
    except ImportError:
        print("CẢNH BÁO: thiếu gói pypdf, bỏ qua kiểm tra số trang PDF tự động — tự đếm bằng tay.", file=sys.stderr)
        return
    pages = PdfReader(str(pdf_path)).pages
    if len(pages) != expected:
        sys.exit(
            f"PDF có {len(pages)} trang, kỳ vọng đúng {expected} (một UF một trang). "
            f"Kiểm cờ --crop hoặc phiên bản draw.io Desktop."
        )
    blank = [i for i, p in enumerate(pages) if not (p.extract_text() or "").strip()]
    if blank:
        sys.exit(f"PDF có trang trắng ở vị trí (0-based): {blank} — không đúng một UF một trang.")


def doc_version() -> str:
    # Phiên bản tài liệu đọc từ dòng '**Phiên bản:**' đầu index.md, không ghi cứng.
    m = re.search(r"\*\*Phiên bản:\*\*\s*([0-9]+(?:\.[0-9]+)*)", INDEX.read_text(encoding="utf-8"))
    if not m:
        sys.exit("Không đọc được '**Phiên bản:**' ở đầu index.md")
    return m.group(1)


def get_version(drawio_exe: Path) -> str:
    proc = subprocess.run([str(drawio_exe), "--version"], capture_output=True, text=True)
    return proc.stdout.strip() or proc.stderr.strip() or "không xác định"


HTML_TEMPLATE = """<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<title>Luồng màn hình SaaS-Sentry — User Flows v{version}</title>
<style>
:root{{
  --ground:#F5F7F9; --surface:#FFFFFF; --ink:#1B242D; --muted:#5C6B7A; --faint:#8B99A6;
  --line:#DCE3E9; --accent:#2F6690; --accent-soft:#E6EEF5;
}}
@media (prefers-color-scheme:dark){{ :root:not([data-theme="light"]){{
  --ground:#12171C; --surface:#1A2129; --ink:#E2E8ED; --muted:#93A2B0; --faint:#6D7C8A;
  --line:#2A343E; --accent:#6FA6CE; --accent-soft:#1E2C38;
}}}}
:root[data-theme="dark"]{{
  --ground:#12171C; --surface:#1A2129; --ink:#E2E8ED; --muted:#93A2B0; --faint:#6D7C8A;
  --line:#2A343E; --accent:#6FA6CE; --accent-soft:#1E2C38;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--ground);color:var(--ink);
  font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 24px}}
header{{border-bottom:1px solid var(--line);background:var(--surface);padding:28px 0}}
h1{{font-size:26px;margin:0 0 6px}}
.meta{{color:var(--muted);font-size:13.5px}}
.sticky{{position:sticky;top:0;z-index:5;background:var(--surface);border-bottom:1px solid var(--line)}}
.filters{{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;padding:10px 24px 4px;max-width:1180px;margin:0 auto}}
.filters .lbl{{color:var(--muted);font-size:12.5px;font-weight:600;margin-right:4px}}
.chip,.reset{{font:inherit;font-size:13px;line-height:1.2;border-radius:999px;padding:5px 12px;cursor:pointer;
  border:1px solid var(--line);background:transparent;color:var(--ink)}}
.chip .n{{color:var(--muted);font-variant-numeric:tabular-nums;margin-left:4px}}
.chip:hover{{border-color:var(--accent);color:var(--accent)}}
.chip[aria-pressed="true"]{{background:var(--accent);border-color:var(--accent);color:var(--surface)}}
.chip[aria-pressed="true"] .n{{color:var(--surface)}}
.reset{{color:var(--accent);border-style:dashed}}
.reset:disabled{{color:var(--faint);cursor:default;border-color:var(--line)}}
.chip:focus-visible,.reset:focus-visible,nav.toc a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.count{{margin-left:auto;color:var(--muted);font-size:12.5px;font-variant-numeric:tabular-nums}}
nav.toc ul{{list-style:none;display:flex;flex-wrap:wrap;gap:4px 10px;margin:0 auto;padding:4px 24px 10px;max-width:1180px}}
nav.toc a{{color:var(--accent);text-decoration:none;font-size:13px;white-space:nowrap}}
nav.toc a:hover{{text-decoration:underline}}
section.uf{{background:var(--surface);border:1px solid var(--line);border-radius:10px;
  margin:26px auto;padding:20px;max-width:1180px;scroll-margin-top:130px}}
.empty{{max-width:1180px;margin:26px auto;padding:20px;color:var(--muted);text-align:center}}
@media (max-width:640px){{.count{{margin-left:0;width:100%}}}}
section.uf h2{{font-size:19px;margin:0 0 4px}}
section.uf .sub{{color:var(--muted);font-size:13px;margin-bottom:14px}}
.frame{{border:1px solid var(--line);border-radius:8px;overflow:auto;background:#fff;padding:8px}}
.frame svg{{display:block;width:100%;height:auto;color-scheme:light !important}}
footer{{color:var(--faint);font-size:12px;text-align:center;padding:30px 0}}
</style>
</head>
<body>
<header><div class="wrap">
  <h1>SaaS-Sentry — Luồng màn hình (User Flows Phần 11)</h1>
  <div class="meta">Nguồn: <code>Docs/Diagrams/user-flows/index.md</code> v{version} · {count} user flow ·
  sinh bởi <code>tools/export-user-flows.py</code> lúc {generated_at}</div>
</div></header>
<div class="sticky">
<div class="filters" role="group" aria-label="Lọc user flow theo vai trò">
<span class="lbl">Vai trò</span>{chips}
<button type="button" class="reset" id="uf-reset" disabled>Đặt lại</button>
<span class="count" id="uf-count" aria-live="polite">Đang hiển thị {count}/{count} user flow</span>
</div>
<nav class="toc" aria-label="Mục lục user flow"><ul>{toc}</ul></nav>
</div>
<main>
{sections}
<p class="empty" id="uf-empty" hidden>Không có user flow cho bộ lọc này.</p>
</main>
<footer>Xuất tự động — sửa index.md hoặc .drawio rồi chạy lại <code>tools/export-user-flows.py</code>, không sửa tay tệp này.</footer>
<script>{script}</script>
</body>
</html>
"""


def strip_svg_prolog(svg_text: str) -> str:
    m = re.search(r"<svg[\s\S]*</svg>", svg_text)
    if not m:
        sys.exit("Không tìm thấy nội dung <svg> trong tệp xuất")
    return m.group(0)


FILTER_SCRIPT = """
(function(){
  var chips=[].slice.call(document.querySelectorAll('.chip'));
  var items=[].slice.call(document.querySelectorAll('section.uf, nav.toc li'));
  var sections=[].slice.call(document.querySelectorAll('section.uf'));
  var reset=document.getElementById('uf-reset');
  var count=document.getElementById('uf-count');
  var empty=document.getElementById('uf-empty');
  function matches(el,f){
    if(f==='all')return true;
    if(f==='p1')return el.getAttribute('data-level')==='1';
    return el.getAttribute('data-roles').split('|').indexOf(f)>=0;
  }
  function apply(f){
    chips.forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-filter')===f?'true':'false');});
    items.forEach(function(el){el.hidden=!matches(el,f);});
    var shown=sections.filter(function(s){return !s.hidden;}).length;
    count.textContent='Đang hiển thị '+shown+'/'+sections.length+' user flow';
    empty.hidden=shown>0;
    reset.disabled=(f==='all');
  }
  chips.forEach(function(c){c.addEventListener('click',function(){apply(c.getAttribute('data-filter'));});});
  reset.addEventListener('click',function(){apply('all');var a=chips[0];if(a)a.focus();});
  function reveal(){
    var t=location.hash&&document.getElementById(location.hash.slice(1));
    if(t&&t.hidden){apply('all');t.scrollIntoView();}
  }
  window.addEventListener('hashchange',reveal);
  apply('all');
  reveal();
})();
"""


def build_html(uf_ids, uf_meta, svg_by_uf, version):
    def attrs(m):
        return f'data-roles="{html.escape("|".join(m["roles"]))}" data-level="{m["level"]}"'

    total = len(uf_ids)
    chips = [f'<button type="button" class="chip" data-filter="all" aria-pressed="true">Tất cả<span class="n">{total}</span></button>']
    p1 = sum(1 for uf in uf_ids if uf_meta[uf]["level"] == 1)
    chips.append(f'<button type="button" class="chip" data-filter="p1" aria-pressed="false">★ Mức 1<span class="n">{p1}</span></button>')
    for role in ROLE_ORDER:
        n = sum(1 for uf in uf_ids if role in uf_meta[uf]["roles"])
        chips.append(
            f'<button type="button" class="chip" data-filter="{html.escape(role)}" aria-pressed="false">'
            f'{html.escape(role)}<span class="n">{n}</span></button>')
    toc_items = "".join(
        f'<li {attrs(uf_meta[uf])}><a href="#{uf}" title="{html.escape(uf_meta[uf]["title"])}">{uf}</a></li>'
        for uf in uf_ids)
    sections = []
    for uf in uf_ids:
        m = uf_meta[uf]
        sections.append(
            f'<section class="uf" id="{uf}" {attrs(m)}>'
            f'<h2>{uf} · {html.escape(m["title"])}</h2>'
            f'<div class="sub">Vai trò: {html.escape(m["role"] or "—")} — Ưu tiên trình bày: {html.escape(m["priority"] or "—")}</div>'
            f'<div class="frame">{svg_by_uf[uf]}</div>'
            f"</section>"
        )
    return HTML_TEMPLATE.format(
        version=version,
        count=total,
        generated_at=datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        chips="".join(chips),
        toc=toc_items,
        sections="\n".join(sections),
        script=FILTER_SCRIPT,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--drawio", help="Đường dẫn draw.io.exe")
    args = ap.parse_args()

    drawio_exe = find_drawio(args.drawio)
    uf_ids, files = discover_uf_ids()
    uf_meta = load_uf_meta(uf_ids)
    validate_all(uf_ids, files, drawio_exe)

    commands = []
    with tempfile.TemporaryDirectory(prefix="uf-export-") as tmp:
        tmp = Path(tmp)
        combined = build_combined(files, tmp)

        pdf_tmp = tmp / "SaaS-Sentry-User-Flows.pdf"
        # --crop bắt buộc: không có nó, draw.io Desktop 29.3.0 chèn một trang trắng
        # thừa trước một số trang và tách một số trang cao thành nhiều mảnh (đã kiểm
        # bằng cách export riêng UF-01 và đếm trang lúc dựng pipeline này). --crop cắt
        # PDF đúng theo kích thước nội dung từng trang nên mỗi UF ra đúng một trang.
        cmd = run_drawio(drawio_exe, ["-f", "pdf", "-e", "-b", "10", "-a", "--crop", "-o", str(pdf_tmp), str(combined)])
        commands.append(cmd)
        verify_pdf_pages(pdf_tmp, len(uf_ids))

        svg_by_uf = {}
        for uf, f in zip(uf_ids, files):
            svg_tmp = tmp / f"{uf}.svg"
            cmd = run_drawio(
                drawio_exe,
                ["-f", "svg", "-e", "-b", "10", "--embed-svg-fonts", "false", "--svg-theme", "light",
                 "-o", str(svg_tmp), str(f)],
            )
            commands.append(cmd)
            svg_by_uf[uf] = strip_svg_prolog(svg_tmp.read_text(encoding="utf-8"))

        html_text = build_html(uf_ids, uf_meta, svg_by_uf, version=doc_version())
        HTML_OUT.write_text(html_text, encoding="utf-8")
        PDF_OUT.write_bytes(pdf_tmp.read_bytes())

    inputs = [{"path": str(INDEX.relative_to(ROOT.parent.parent.parent)), "sha256": sha256(INDEX)}]
    for f in files:
        inputs.append({"path": str(f.relative_to(ROOT.parent.parent.parent)), "sha256": sha256(f)})
    outputs = [
        {"path": str(HTML_OUT.relative_to(ROOT.parent.parent.parent)), "sha256": sha256(HTML_OUT)},
        {"path": str(PDF_OUT.relative_to(ROOT.parent.parent.parent)), "sha256": sha256(PDF_OUT)},
    ]
    manifest = {
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "tool": {
            "path": str(drawio_exe),
            "version": get_version(drawio_exe),
        },
        "commands": commands,
        "ufCount": len(uf_ids),
        "ufIds": uf_ids,
        "inputs": inputs,
        "outputs": outputs,
        "note": "SVG nhúng trong HTML không nhúng font (--embed-svg-fonts false) để tệp gọn; PDF nhúng XML diagram (-e) để có thể mở lại bằng draw.io. Export thành công không thay thế bước xem ảnh/kiểm ngữ nghĩa theo synchronization.md.",
    }
    MANIFEST_OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Xuất {len(uf_ids)} UF -> {HTML_OUT.name}, {PDF_OUT.name}")
    print(f"Manifest: {MANIFEST_OUT.name}")


if __name__ == "__main__":
    main()
