const assert = require('assert')
const { createUF13Data } = require('./uf13-data')
const { renderApp } = require('./uf13-renderer')

console.log('--- RUNNING UF-13 RENDERER UNIT TESTS ---')

const data = createUF13Data()

// 1. Kiểm tra render đủ 16 màn hình
for (let i = 1; i <= 16; i++) {
  const id = String(i).padStart(2, '0')
  const html = renderApp(data, id)
  assert(html.includes(`data-screen="${id}"`), `Screen ${id} must contain data-screen="${id}"`)
  assert(html.includes('app-shell'), `Screen ${id} must contain app-shell`)
  assert(html.includes('main-wrapper'), `Screen ${id} must contain main-wrapper`)
  assert(html.includes('Nguyễn Văn Quản'), `Screen ${id} must contain Super Admin Nguyễn Văn Quản`)
}

// 2. Kiểm tra các màn hình đặc thù
// Màn hình 01: ADM-02 Dashboard
const html01 = renderApp(data, '01')
assert(html01.includes('ADM-02'), 'Frame 01 must have ADM-02')
assert(
  html01.includes('Quy tắc phân giải thứ tự ưu tiên ngưỡng lãng phí (BR-20.1)'),
  'Frame 01 must mention BR-20.1 hierarchy'
)

// Màn hình 02: Thiết lập ngưỡng đa tầng
const html02 = renderApp(data, '02')
assert(html02.includes('Figma Enterprise'), 'Frame 02 must have Figma Enterprise')
assert(html02.includes('30'), 'Frame 02 must have 30 days')

// Màn hình 03: Ma trận phân giải
const html03 = renderApp(data, '03')
assert(html03.includes('Ma trận Phân giải Ưu tiên Ghi đè Ngưỡng'), 'Frame 03 must have resolution matrix')

// Màn hình 05: SYS-04 CHẶN SoD-1
const html05 = renderApp(data, '05')
assert(html05.includes('SYS-04'), 'Frame 05 must have SYS-04')
assert(html05.includes('CHẶN PHÂN QUYỀN'), 'Frame 05 must have blocking title')
assert(html05.includes('BR-37.1'), 'Frame 05 must cite BR-37.1')
assert(html05.includes('SoD-1'), 'Frame 05 must cite SoD-1')

// Màn hình 06: Người duyệt chi CEO
const html06 = renderApp(data, '06')
assert(html06.includes('Phạm Hoàng Nam'), 'Frame 06 must have CEO Phạm Hoàng Nam')
assert(html06.includes('FR-3.13'), 'Frame 06 must cite FR-3.13')

// Màn hình 07: Người thay thế xung đột lợi ích
const html07 = renderApp(data, '07')
assert(html07.includes('Vũ Đình Khoa'), 'Frame 07 must have COO Vũ Đình Khoa')
assert(html07.includes('BR-13.10'), 'Frame 07 must cite BR-13.10')

// Màn hình 09: Thông báo v1.3
const html09 = renderApp(data, '09')
assert(html09.includes('v1.3'), 'Frame 09 must have notice v1.3')
assert(html09.includes('BR-42.5'), 'Frame 09 must cite BR-42.5')

// Màn hình 12: Khối xem thử Sandbox
const html12 = renderApp(data, '12')
assert(html12.includes('Khối Xem Thử (Simulation Sandbox)'), 'Frame 12 must have simulation sandbox')

// Màn hình 13: Phát hiện lỗi logic
const html13 = renderApp(data, '13')
assert(html13.includes('Vi phạm QĐ-29a'), 'Frame 13 must detect flaw under QĐ-29a')

// Màn hình 14: Sửa chuỗi bước thành công
const html14 = renderApp(data, '14')
assert(html14.includes('Đã Bổ Sung Nhánh QĐ-29a'), 'Frame 14 must have fixed workflow')

// Màn hình 15: Audit log Append-only
const html15 = renderApp(data, '15')
assert(html15.includes('BR-38.1'), 'Frame 15 must cite BR-38.1')
assert(html15.includes('AUD-2026-9941'), 'Frame 15 must contain AUD-2026-9941')

// Màn hình 16: Hiệu lực chính sách
const html16 = renderApp(data, '16')
assert(html16.includes('BR-37.2'), 'Frame 16 must cite BR-37.2')
assert(html16.includes('YÊU CẦU ĐANG CHẠY (IN-FLIGHT'), 'Frame 16 must mention in-flight policy')

console.log('✅ ALL UF-13 RENDERER UNIT TESTS PASSED (16/16 frames verified)')
