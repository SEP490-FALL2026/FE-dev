'use strict'

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}

function createUF12Data() {
  const stages = [
    { id: 1, label: 'Tổng quan', hint: 'Discovery' },
    { id: 2, label: 'Tiếp nhận', hint: '3 nguồn' },
    { id: 3, label: 'Chuẩn hóa', hint: 'Match' },
    { id: 4, label: 'Finding', hint: 'Cần xem xét' },
    { id: 5, label: 'Quyết định', hint: 'IT Admin' },
    { id: 6, label: 'Kết quả', hint: 'Audit' }
  ]
  const states = [
    'dashboard',
    'source-map',
    'finance-intake',
    'idp-intake',
    'collector-intake',
    'normalize-overview',
    'auto-match',
    'assisted-confirm',
    'catalog-compare',
    'catalog-present',
    'dedupe-finding',
    'finding-queue',
    'finding-detail',
    'owner-context',
    'it-decision',
    'false-positive',
    'approve-catalog',
    'approve-success',
    'reject-handoff',
    'audit-summary'
  ]
  const stageSequence = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6, 6, 6, 6, 6]
  const screenTitles = [
    'Bàn làm việc Discovery',
    'Ba nguồn bằng chứng',
    'Tiếp nhận sao kê và hóa đơn',
    'Tiếp nhận dữ liệu IdP',
    'Bằng chứng từ bộ thu thập',
    'Chuỗi chuẩn hóa có thể giải trình',
    'Khớp tự động theo từ điển',
    'Xác nhận gợi ý Canva',
    'Đối chiếu SaaS Catalog',
    'Đã nằm trong danh mục',
    'Cập nhật finding đang mở',
    'Hàng đợi cần xem xét',
    'Chi tiết finding Canva',
    'Bối cảnh nghiệp vụ từ Manager',
    'IT Admin ra quyết định',
    'Kết quả: Báo nhầm',
    'Hợp thức hóa Canva vào Catalog',
    'Kết quả: Đã duyệt',
    'Kết quả: Chưa duyệt',
    'Timeline kiểm toán Discovery'
  ]
  const ledgers = {
    initial: { open: 6, normalized: 0, pendingIt: 0, closed: 0, approved: 0, tasks: 0 },
    intake: { open: 6, normalized: 3, pendingIt: 0, closed: 0, approved: 0, tasks: 0 },
    match: { open: 6, normalized: 9, pendingIt: 1, closed: 0, approved: 0, tasks: 0 },
    finding: { open: 6, normalized: 11, pendingIt: 1, closed: 0, approved: 0, tasks: 0 },
    decision: { open: 6, normalized: 11, pendingIt: 1, closed: 0, approved: 0, tasks: 0 },
    falsePositive: { open: 5, normalized: 11, pendingIt: 0, closed: 1, approved: 0, tasks: 0 },
    approved: { open: 5, normalized: 11, pendingIt: 0, closed: 1, approved: 1, tasks: 0 },
    unapproved: { open: 5, normalized: 11, pendingIt: 0, closed: 1, approved: 0, tasks: 1 },
    summary: { open: 5, normalized: 11, pendingIt: 0, closed: 1, approved: 1, tasks: 1 }
  }
  const ledgerByState = [
    'initial',
    'initial',
    'intake',
    'intake',
    'intake',
    'match',
    'match',
    'match',
    'match',
    'match',
    'finding',
    'finding',
    'finding',
    'finding',
    'decision',
    'falsePositive',
    'approved',
    'approved',
    'unapproved',
    'summary'
  ]
  return deepFreeze({
    actor: { name: 'IT Admin', email: 'it-admin@company.com' },
    run: { id: 'RUN-DISC-20260917-0900', generatedAt: '17/09/2026 · 09:00 ICT' },
    stages,
    sources: [
      {
        id: 'finance',
        label: 'Sao kê / hóa đơn',
        owner: 'Finance',
        evidence: 'Giá trị giao dịch',
        confidence: 'Theo phương pháp khớp',
        prohibited: []
      },
      {
        id: 'idp',
        label: 'OAuth / enterprise-app',
        owner: 'IT Admin',
        evidence: 'Ứng dụng đã được cấp quyền',
        confidence: 'Theo phương pháp khớp',
        prohibited: []
      },
      {
        id: 'collector',
        label: 'Bộ thu thập đã lọc',
        owner: 'Automation Service',
        evidence: 'Tên miền + số người + khoảng ngày',
        confidence: 'Theo phương pháp khớp',
        prohibited: ['URL đầy đủ', 'Tiêu đề trang', 'Nội dung', 'Tên miền lạ']
      }
    ],
    primaryEvidence: {
      id: 'EVD-FIN-8891',
      raw: 'PAYPAL*CANVA PRO 0926',
      normalized: 'Canva',
      method: 'AI suggestion',
      confidence: 'Thấp',
      requiresHumanConfirmation: true,
      observedAt: '16/09/2026 · 10:42 ICT'
    },
    idpEvidence: {
      id: 'EVD-IDP-4420',
      raw: 'www.microsoft.com',
      normalized: 'Microsoft 365',
      method: 'Exact dictionary',
      confidence: 'Cao'
    },
    collectorEvidence: {
      id: 'EVD-COL-1728',
      raw: 'loom.com',
      normalized: 'Loom',
      method: 'Exact dictionary',
      confidence: 'Cao',
      people: 3,
      range: '10–16/09/2026'
    },
    finding: {
      id: 'FND-2026-045',
      vendor: 'Canva Pro',
      status: 'Cần xem xét',
      risk: 'Cao',
      users: 7,
      monthlyCost: '1.800.000 đ/tháng',
      owner: 'Lê Thu Hà · NV-0311',
      createdAt: '17/09/2026 · 09:12 ICT',
      lastSeen: '17/09/2026 · 09:24 ICT'
    },
    dedupe: {
      evidenceId: 'EVD-COL-1741',
      createsNewFinding: false,
      update: 'Cập nhật lần thấy gần nhất và số lần xuất hiện vào FND-2026-045'
    },
    managerContext: 'Nhóm Marketing dùng Canva để chuẩn hóa bộ nhận diện chiến dịch.',
    falsePositive: {
      id: 'FND-2026-039',
      vendor: 'Canva Test Sandbox',
      status: 'Báo nhầm',
      closedAt: '12/09/2026 · 16:10 ICT',
      reopensWhenSeenAgain: true
    },
    branches: {
      approved: {
        catalogId: 'CAT-CANVA-01',
        purchaseRequest: 'REQ-2026-212',
        officialAssignments: 7,
        purchaseApproved: false
      },
      unapproved: {
        handoff: 'UF-08',
        taskId: 'PV-2074',
        autoRevokes: false,
        message: 'IT chuyển quyết định thực thi sang UF-08; chưa có thay đổi quyền tại UF-12.'
      }
    },
    audit: [
      'Finance import EVD-FIN-8891',
      'IT xác nhận AI suggestion → Canva',
      'Finding FND-2026-045 được cập nhật bằng EVD-COL-1741',
      'Manager Lê Thu Hà gửi bối cảnh',
      'IT Admin ghi quyết định'
    ],
    ledgers,
    screens: states.map((state, index) => ({
      id: String(index + 1).padStart(2, '0'),
      state,
      title: screenTitles[index],
      stage: stageSequence[index],
      totalStages: 6,
      ledgerKey: ledgerByState[index],
      branch:
        index === 15
          ? 'Báo nhầm'
          : index === 16 || index === 17
            ? 'Đã duyệt'
            : index === 18
              ? 'Chưa duyệt'
              : 'Discovery',
      activeNav: index >= 15 ? 'Ứng dụng' : index >= 10 ? 'Khuyến nghị' : 'Nhập dữ liệu'
    }))
  })
}

if (typeof module !== 'undefined') module.exports = { createUF12Data }
if (typeof window !== 'undefined') window.UF12Data = { createUF12Data }
