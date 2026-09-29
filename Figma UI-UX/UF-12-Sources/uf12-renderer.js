'use strict'

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  )
const badge = (text, kind = 'info') => `<span class="badge ${kind}">${esc(text)}</span>`
const button = (text, kind = '') => `<button class="btn ${kind}">${esc(text)}</button>`
const card = (title, content, extra = '') => `<section class="card ${extra}"><h2>${esc(title)}</h2>${content}</section>`
const stat = (label, value, hint = '', tone = '') =>
  `<div class="stat ${tone}"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(hint)}</small></div>`
const field = (label, value) =>
  `<label class="field"><span>${esc(label)}</span><input value="${esc(value)}" readonly></label>`

function tracker(data, screen) {
  return `<section class="tracker">${data.stages
    .map((stage) => {
      const cls = stage.id < screen.stage ? 'done' : stage.id === screen.stage ? 'active' : ''
      return `<div class="step ${cls}"><span>${stage.id < screen.stage ? '✓' : stage.id}</span><div><strong>${esc(stage.label)}</strong><small>${esc(stage.hint)}</small></div></div>`
    })
    .join('')}</section>`
}

function sidebar(screen) {
  const nav = [
    'Tổng quan',
    'Nhập dữ liệu',
    'Ứng dụng',
    'Khuyến nghị',
    'Quyền truy cập',
    'Chi phí',
    'Báo cáo',
    'Nhật ký',
    'Cài đặt'
  ]
  return `<aside class="sidebar"><div class="brand"><b>D</b><strong>SaaS-Sentry</strong></div><nav>${nav.map((item) => `<div class="nav-item ${screen.activeNav === item ? 'active' : ''}"><i>◇</i>${item}${item === 'Khuyến nghị' ? '<em>6</em>' : ''}</div>`).join('')}</nav><div class="profile"><b>IT</b><div><strong>IT Admin</strong><span>Quản trị hệ thống</span></div></div></aside>`
}

function contextPanel(data, screen, ledger) {
  return `<aside class="context"><h3>LẦN CHẠY DISCOVERY</h3><div class="run"><b>◉</b><div><strong>${esc(data.run.id)}</strong><small>${esc(data.run.generatedAt)}</small></div></div>${badge(screen.branch, screen.branch === 'Báo nhầm' ? 'warning' : screen.branch === 'Đã duyệt' ? 'success' : screen.branch === 'Chưa duyệt' ? 'danger' : 'info')}<div class="context-block"><span>Ba nguồn evidence</span><strong>Finance · IdP · Collector</strong></div><div class="ledger"><h3>SỔ KIỂM SOÁT</h3><div><span>Finding mở</span><b>${ledger.open}</b></div><div><span>Vendor đã chuẩn hóa</span><b>${ledger.normalized}</b></div><div><span>Chờ IT quyết định</span><b>${ledger.pendingIt}</b></div><div><span>Đã đóng</span><b>${ledger.closed}</b></div><div><span>Đã duyệt</span><b>${ledger.approved}</b></div><div><span>Tác vụ UF-08 mở</span><b>${ledger.tasks}</b></div></div><div class="context-block"><span>Audit gần nhất</span><strong>${esc(data.audit.at(-1))}</strong></div></aside>`
}

const evidenceRow = (id, raw, normalized, method, confidence) =>
  `<tr><td><strong>${esc(id)}</strong></td><td>${esc(raw)}</td><td><strong>${esc(normalized)}</strong></td><td>${badge(method, method.includes('AI') ? 'warning' : 'success')}</td><td>${badge(confidence, confidence === 'Thấp' ? 'danger' : 'success')}</td></tr>`

function body(data, screen) {
  const p = data.primaryEvidence,
    f = data.finding,
    c = data.collectorEvidence,
    i = data.idpEvidence
  const stageHead = `<div class="frame-head"><div><small>CHẶNG ${screen.stage} / 6 · ${esc(screen.branch).toUpperCase()}</small><h1>${esc(screen.title)}</h1><p>Luồng D-4 giữ bằng chứng, phạm vi và quyết định có thể giải trình.</p></div><b class="frame-number">${screen.id}</b></div>`
  let content = ''
  switch (screen.state) {
    case 'dashboard':
      content = `<div class="metrics">${stat('Finding mở', '06', 'Cần IT xem xét', 'amber')}${stat('Evidence mới', '11', 'Ba nguồn đã nhận', 'blue')}${stat('Đã chuẩn hóa', '09', 'Có phương pháp khớp', 'green')}${stat('Không tự kết luận', '100%', 'BR-31.1', '')}</div><div class="source-grid">${data.sources.map((source) => `<article class="source-card"><div>${badge(source.owner, 'info')}</div><h2>${esc(source.label)}</h2><p>${esc(source.evidence)}</p><small>Không gọi là vi phạm →</small></article>`).join('')}</div>${card('Nguyên tắc phát hiện', `<div class="notice info"><strong>Finding là “Cần xem xét”</strong><span>Có bằng chứng không đồng nghĩa có vi phạm; IT Admin mới đưa ra quyết định.</span></div>`)}`
      break
    case 'source-map':
      content =
        card(
          'Ma trận nguồn bằng chứng',
          `<table><thead><tr><th>Nguồn</th><th>Nhận gì</th><th>Không nhận</th><th>Vai trò</th></tr></thead><tbody>${data.sources.map((source) => `<tr><td><strong>${esc(source.label)}</strong></td><td>${esc(source.evidence)}</td><td>${source.prohibited.length ? esc(source.prohibited.join(' · ')) : 'Theo lược đồ import'}</td><td>${esc(source.owner)}</td></tr>`).join('')}</tbody></table>`
        ) +
        `<div class="notice warning"><strong>Giới hạn có chủ đích</strong><span>Collector chỉ nhìn thấy vendor đã có trong từ điển; không cam kết phát hiện mọi SaaS trên internet.</span></div>`
      break
    case 'finance-intake':
      content = `<section class="split"><div>${card('Import sao kê / hóa đơn', `${field('Tệp đã chọn', 'september-finance.csv')}<div class="upload-ok">✓ 142 dòng đã đọc · 01 giá trị cần xác nhận</div><div class="notice info"><strong>Giá trị thô được giữ lại</strong><span>Không ghi đè mô tả giao dịch gốc.</span></div>`)}</div><div>${card('Preview EVD-FIN-8891', `<div class="kv"><span>Giá trị thô</span><strong>${esc(p.raw)}</strong></div><div class="kv"><span>Thời điểm</span><strong>${esc(p.observedAt)}</strong></div><div class="kv"><span>Trạng thái</span><strong>Cần chuẩn hóa</strong></div>`)}</div></section>`
      break
    case 'idp-intake':
      content = `<div class="metrics">${stat('Enterprise-app', '36', 'Đã quét', 'blue')}${stat('OAuth consent', '18', 'Đã đối chiếu', 'green')}${stat('Không khớp', '02', 'Tới bước chuẩn hóa', 'amber')}</div>${card('Preview IdP evidence', `<table><thead><tr><th>Evidence</th><th>Giá trị thô</th><th>Nguồn</th><th>Trạng thái</th></tr></thead><tbody><tr><td>${esc(i.id)}</td><td>${esc(i.raw)}</td><td>Enterprise app</td><td>${badge('Đủ schema', 'success')}</td></tr><tr><td>EVD-IDP-4428</td><td>atlassian.net</td><td>OAuth consent</td><td>${badge('Đủ schema', 'success')}</td></tr></tbody></table>`)}`
      break
    case 'collector-intake':
      content = `<section class="split"><div>${card('Batch collector đã lọc', `<div class="notice success"><strong>COL-2026-W38-04 đã hợp lệ</strong><span>03 vendor trong từ điển · chỉ thiết bị có xác nhận.</span></div><div class="kv"><span>Tên miền</span><strong>${esc(c.raw)}</strong></div><div class="kv"><span>Nhân viên xác nhận có mở</span><strong>${c.people}</strong></div><div class="kv"><span>Khoảng ngày</span><strong>${esc(c.range)}</strong></div>`)}</div><div>${card('Privacy guard', `<ul class="guard-list">${data.sources[2].prohibited.map((item) => `<li>✕ Không ${esc(item)}</li>`).join('')}<li>✓ Chỉ vendor trong từ điển</li></ul>`)}</div></section>`
      break
    case 'normalize-overview':
      content = `<section class="pipeline"><div>1<strong>Raw evidence</strong><small>Giữ nguyên</small></div><span>→</span><div>2<strong>Chuẩn hóa</strong><small>Vendor name</small></div><span>→</span><div>3<strong>Match method</strong><small>Confidence</small></div><span>→</span><div>4<strong>Catalog compare</strong><small>Finding</small></div></section>${card('Log có thể giải trình', `<table><thead><tr><th>Evidence</th><th>Raw</th><th>Normalized</th><th>Method</th><th>Confidence</th></tr></thead><tbody>${evidenceRow(i.id, i.raw, i.normalized, i.method, i.confidence)}${evidenceRow(c.id, c.raw, c.normalized, c.method, c.confidence)}${evidenceRow(p.id, p.raw, p.normalized, p.method, p.confidence)}</tbody></table>`)}`
      break
    case 'auto-match':
      content = `${card('Khớp tự động theo từ điển / regex', `<table><thead><tr><th>Raw value</th><th>Vendor</th><th>Phương pháp</th><th>Confidence</th></tr></thead><tbody><tr><td>www.microsoft.com</td><td>Microsoft 365</td><td>${badge('Exact dictionary', 'success')}</td><td>${badge('Cao', 'success')}</td></tr><tr><td>ATLASSIAN*JIRA CLOUD</td><td>Atlassian</td><td>${badge('Regex pattern', 'info')}</td><td>${badge('Khá', 'info')}</td></tr></tbody></table>`)}<div class="notice success"><strong>Tự động chuẩn hóa không phải tự phê duyệt</strong><span>Hệ thống chỉ chuẩn hóa vendor; bước Catalog vẫn quyết định có finding hay không.</span></div>`
      break
    case 'assisted-confirm':
      content = `<section class="split"><div>${card('Gợi ý cần IT Admin xác nhận', `<div class="alert danger"><strong>Confidence thấp · không tự động chuẩn hóa</strong><span>AI chỉ gợi ý; mức tin cậy hiển thị theo phương pháp khớp.</span></div>${field('Giá trị thô', p.raw)}${field('Vendor được gợi ý', p.normalized)}${field('Lý do xác nhận', 'Khớp với nhà bán lại PAYPAL*CANVA')}${button('Xác nhận Canva')}`)}</div><div>${card('Căn cứ', `<div class="kv"><span>Evidence</span><strong>${p.id}</strong></div><div class="kv"><span>Phương pháp</span><strong>${p.method}</strong></div><div class="kv"><span>Confidence</span><strong>${p.confidence}</strong></div><p> Bắt buộc IT Admin xác nhận trước khi sang Catalog.</p>`)}</div></section>`
      break
    case 'catalog-compare':
      content = `${card('VendorDictionary ↔ SaaS Catalog', `<table><thead><tr><th>Vendor chuẩn</th><th>Trong Dictionary</th><th>Trong Catalog đã duyệt</th><th>Kết quả</th></tr></thead><tbody><tr><td>Microsoft 365</td><td>${badge('Có', 'success')}</td><td>${badge('Có', 'success')}</td><td>Không tạo finding</td></tr><tr><td>Canva</td><td>${badge('Có', 'success')}</td><td>${badge('Chưa có', 'warning')}</td><td>${badge('Cần xem xét', 'danger')}</td></tr><tr><td>Loom</td><td>${badge('Có', 'success')}</td><td>${badge('Chưa có', 'warning')}</td><td>${badge('Cần xem xét', 'danger')}</td></tr></tbody></table>`)}<div class="notice info"><strong>Từ điển không phải Catalog</strong><span>Vendor được nhận diện không đồng nghĩa tổ chức đã phê duyệt dùng vendor đó.</span></div>`
      break
    case 'catalog-present':
      content = `<div class="result-card success-result"><b>✓</b><h2>Microsoft 365 đã nằm trong danh mục đã duyệt</h2><p>${i.id} được liên kết với CAT-M365-01; evidence được lưu cho giải trình.</p>${badge('Không tạo finding', 'success')}</div>${card('Dấu vết đối chiếu', `<div class="kv"><span>Raw</span><strong>${i.raw}</strong></div><div class="kv"><span>Normalized</span><strong>${i.normalized}</strong></div><div class="kv"><span>Catalog</span><strong>CAT-M365-01 · Approved</strong></div>`)}`
      break
    case 'dedupe-finding':
      content = `<div class="notice warning"><strong>Không tạo finding thứ hai</strong><span>${esc(data.dedupe.update)}</span></div>${card('Hợp nhất evidence vào finding mở', `<div class="dedupe"><div><span>Evidence ban đầu</span><strong>${p.id}</strong><small>Finance · ${p.raw}</small></div><b>+</b><div><span>Evidence mới</span><strong>${data.dedupe.evidenceId}</strong><small>Collector · canva.com</small></div><b>→</b><div><span>Finding mở</span><strong>${f.id}</strong><small>Last seen ${f.lastSeen}</small></div></div>`)}`
      break
    case 'finding-queue':
      content = `${card('6 finding cần xem xét', `<table><thead><tr><th>Finding</th><th>Vendor</th><th>Risk</th><th>Evidence</th><th>Owner</th></tr></thead><tbody><tr><td>${f.id}</td><td>${f.vendor}</td><td>${badge(f.risk, 'danger')}</td><td>Finance + Collector</td><td>${f.owner}</td></tr><tr><td>FND-2026-046</td><td>Loom</td><td>${badge('Trung bình', 'warning')}</td><td>Collector</td><td>Chưa gán</td></tr><tr><td>FND-2026-047</td><td>Typeform</td><td>${badge('Cao', 'danger')}</td><td>Finance</td><td>Nguyễn Hoàng Long</td></tr></tbody></table>`)}<div class="notice info"><strong>Risk là ưu tiên xem xét</strong><span>Risk tier không thay thế quyết định của IT Admin.</span></div>`
      break
    case 'finding-detail':
      content = `<section class="split"><div>${card(`${f.id} · ${f.vendor}`, `<div class="notice danger"><strong>${f.status} · Risk ${f.risk}</strong><span>${f.users} người liên quan · ${f.monthlyCost}</span></div><div class="evidence-chain"><div><b>1</b><strong>${p.id}</strong><span>${p.raw} → ${p.normalized}</span></div><div><b>2</b><strong>${data.dedupe.evidenceId}</strong><span>Collector confirmed · 7 người</span></div></div>`)}</div><div>${card('Căn cứ bất biến', `<div class="kv"><span>Phương pháp</span><strong>${p.method}</strong></div><div class="kv"><span>Confidence</span><strong>${p.confidence}</strong></div><div class="kv"><span>Last seen</span><strong>${f.lastSeen}</strong></div>`)}</div></section>`
      break
    case 'owner-context':
      content = `<section class="split"><div>${card('Bối cảnh nghiệp vụ', `<div class="person-row"><b>LH</b><div><strong>${f.owner}</strong><span>Manager trong cây trực tiếp</span></div>${badge('Đã phản hồi', 'success')}</div><blockquote>“${data.managerContext}”</blockquote><div class="notice info"><strong>Phạm vi hợp lệ</strong><span>Manager chỉ cung cấp bối cảnh trong cây quản lý trực tiếp; Cost Center dùng khi cần gom chi phí.</span></div>`)}</div><div>${card('Owner finding', `${field('Người chịu trách nhiệm', 'Lê Thu Hà')}<div class="kv"><span>Nhân viên liên quan</span><strong>07</strong></div><div class="kv"><span>Audit</span><strong>Context received</strong></div>`)}</div></section>`
      break
    case 'it-decision':
      content = `<section class="split"><div>${card('Review cuối của IT Admin', `<div class="kv"><span>Finding</span><strong>${f.id}</strong></div><div class="kv"><span>Evidence</span><strong>Finance + Collector</strong></div><div class="kv"><span>Context</span><strong>Đã nhận từ Manager</strong></div><div class="notice warning"><strong>Quyết định sẽ ghi Audit Trail</strong><span>Không có nút tự thu hồi hoặc tự duyệt chi tại UF-12.</span></div>`)}</div><div>${card('Chọn kết cục', `<div class="decision-choice false"><b>A</b><div><strong>Báo nhầm</strong><small>Đóng; tái xuất hiện sẽ mở lại</small></div></div><div class="decision-choice approve"><b>B</b><div><strong>Đã duyệt</strong><small>Hợp thức hóa vào Catalog</small></div></div><div class="decision-choice reject"><b>C</b><div><strong>Chưa duyệt</strong><small>Handoff UF-08, không tự revoke</small></div></div>`)}</div></section>`
      break
    case 'false-positive':
      content = `<section class="branch-banner branch-b"><span class="branch-letter">A</span><div><strong>Nhánh Báo nhầm</strong><p>Finding được đóng có audit; đây không phải xóa evidence.</p></div>${badge('Đã đóng', 'warning')}</section><div class="result-card"><b>↺</b><h2>${data.falsePositive.id} đã đóng là Báo nhầm</h2><p>${data.falsePositive.vendor} · ${data.falsePositive.closedAt}</p><div class="notice info"><strong>Xuất hiện lại sẽ Mở lại</strong><span>BR-31.3 giữ lịch sử cũ và đưa finding về hàng đợi, không tạo finding mới.</span></div></div>`
      break
    case 'approve-catalog':
      content = `<section class="branch-banner branch-a"><span class="branch-letter">B</span><div><strong>Nhánh Đã duyệt · Hợp thức hóa</strong><p>Đây là kết cục tích cực: catalog hiện tại chưa đáp ứng nhu cầu hợp lệ.</p></div>${badge('BR-34.1', 'success')}</section>${card('Khai báo Canva vào SaaS Catalog', `<div class="form-grid">${field('Vendor', 'Canva')}${field('Tên ứng dụng', 'Canva Pro')}${field('Business Owner *', 'Lê Thu Hà')}${field('Mức nhạy cảm *', 'Nội bộ')}${field('Domain', 'canva.com')}${field('SSO', 'Chưa hỗ trợ')}</div><div class="notice warning"><strong>Request mua sẽ được tạo chính thức</strong><span>Chưa đồng nghĩa đã duyệt chi hoặc đã thay đổi hóa đơn.</span></div>`)}`
      break
    case 'approve-success':
      content = `<section class="branch-banner branch-a"><span class="branch-letter">B</span><div><strong>Nhánh Đã duyệt hoàn tất tại UF-12</strong><p>Catalog, request mua và quyền chính thức đã được ghi nhận.</p></div>${badge('Audit recorded', 'success')}</section><div class="metrics">${stat('Catalog', data.branches.approved.catalogId, 'Canva Pro', 'green')}${stat('Request mua', data.branches.approved.purchaseRequest, 'Chờ luồng duyệt chi', 'amber')}${stat('Quyền chính thức', String(data.branches.approved.officialAssignments), 'Không bắt xin lại', 'blue')}</div>${card('Ranh giới trạng thái', `<div class="notice warning"><strong>${data.branches.approved.purchaseRequest} chưa đồng nghĩa đã duyệt chi</strong><span>UF-12 tạo request mua chính thức; quyết định chi theo luồng phê duyệt riêng.</span></div><div class="notice success"><strong>7 Assignment đã được regularize</strong><span>Nguồn: Regularized from ${f.id} · BR-34.2.</span></div>`)}`
      break
    case 'reject-handoff':
      content = `<section class="branch-banner branch-c"><span class="branch-letter">C</span><div><strong>Nhánh Chưa duyệt</strong><p>Quyết định được giao sang UF-08 để thực thi có bằng chứng.</p></div>${badge('Handoff UF-08', 'danger')}</section><section class="split"><div>${card('Provisioning handoff', `<div class="kv"><span>Task</span><strong>${data.branches.unapproved.taskId}</strong></div><div class="kv"><span>Nguồn quyết định</span><strong>${f.id}</strong></div><div class="kv"><span>Đích</span><strong>${data.branches.unapproved.handoff}</strong></div><div class="notice warning"><strong>Chưa có thay đổi quyền</strong><span>${data.branches.unapproved.message}</span></div>`)}</div><div>${card('Hành động sau UF-08', `<p>Thu hồi hoặc hướng người dùng sang công cụ có sẵn chỉ được ghi sau khi UF-08 có bằng chứng thực thi.</p>${button('Mở UF-08 →')}`)}</div></section>`
      break
    case 'audit-summary':
      content = `<section class="branch-banner branch-a"><span class="branch-letter">✓</span><div><strong>Discovery khép kín bằng audit</strong><p>Ba kết cục là các nhánh thay thế, không phải cùng lúc trên một finding.</p></div>${badge('20 màn đồng bộ', 'info')}</section>${card('Timeline chuẩn của FND-2026-045', `<div class="timeline">${data.audit.map((event, index) => `<div><b>${index + 1}</b><span>${esc(event)}</span><small>17/09/2026</small></div>`).join('')}</div>`)}${card('Ba kết cục loại trừ', `<div class="outcomes"><div>${badge('Báo nhầm', 'warning')}<span>Đóng và có thể mở lại</span></div><div>${badge('Đã duyệt', 'success')}<span>Catalog + request mua</span></div><div>${badge('Chưa duyệt', 'danger')}<span>Handoff UF-08</span></div></div>`)}`
      break
  }
  return `${stageHead}${content}<div class="action-bar"><span>Run ${data.run.id} · ${screen.branch}</span>${button(screen.id === '20' ? 'Xem báo cáo Discovery' : 'Tiếp tục →')}</div>`
}

function renderApp(data, screenId) {
  const screen = data.screens.find((item) => item.id === String(screenId).padStart(2, '0')) || data.screens[0]
  const ledger = data.ledgers[screen.ledgerKey]
  return `<main class="app" data-screen="${screen.id}" data-stage="${screen.stage}" data-total-stages="6" data-open="${ledger.open}" data-pending-it="${ledger.pendingIt}" data-tasks="${ledger.tasks}">${sidebar(screen)}<section class="workspace"><header class="topbar"><div class="search">⌕ Tìm kiếm trong SaaS-Sentry...</div><div>?</div><div>◇</div><strong>IT Admin⌄</strong><b class="avatar">IT</b></header><div class="content"><div class="breadcrumb">Khuyến nghị › Discovery › ${data.run.id}</div>${tracker(data, screen)}<section class="screen-body">${body(data, screen)}</section></div></section>${contextPanel(data, screen, ledger)}</main>`
}

if (typeof module !== 'undefined') module.exports = { renderApp }
if (typeof window !== 'undefined') window.UF12Renderer = { renderApp }
