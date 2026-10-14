export type ProvisioningPlanType =
  | 'Workspace Doanh nghiệp'
  | 'Gói cá nhân qua email công ty'
  | 'Khóa bản quyền & Token API'
  | 'Mô hình AI nội bộ'

export type ProvisioningPlanCode = 'K1' | 'K2' | 'K3' | 'K4' | 'K5'

export type ProvisioningTask = {
  account: string
  action: 'provision' | 'deprovision'
  app: string
  channel: string
  createdAt: string
  decisionSource: string
  department: string
  evidence?: string
  id: string
  isSharedAccount?: boolean
  lastError?: string
  planType: ProvisioningPlanType
  planTypeCode?: ProvisioningPlanCode
  retryCount?: number
  sla: string
  status: 'pendingAccept' | 'manual' | 'retry' | 'authError' | 'capacity' | 'completed' | 'inProgress'
  steps?: string[]
  user: string
}

export const itProvisioningTasks: ProvisioningTask[] = [
  {
    account: 'an.nguyen@company.com',
    action: 'provision',
    app: 'GitHub Copilot (OpenAI Codex)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '13/10/2026 09:14',
    decisionSource: 'Yêu cầu REQ-2026-0917-084',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2041',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    sla: '3 giờ 18 phút',
    status: 'pendingAccept',
    steps: [
      'Gửi lời mời tham gia GitHub Organization cho an.nguyen@company.com',
      'Phân quyền giấy phép Copilot Enterprise (OpenAI Codex) trong nhóm Kỹ thuật',
      'Chờ nhân viên đăng nhập chấp nhận lời mời để kích hoạt seat (BRD 5.12.3)'
    ],
    user: 'Nguyễn Minh An'
  },
  {
    account: 'tran.minh@company.com',
    action: 'deprovision',
    app: 'Claude Enterprise (Anthropic)',
    channel: 'Thao tác thủ công',
    createdAt: '13/10/2026 08:45',
    decisionSource: 'Nghỉ việc OFF-2026-044',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2042',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    sla: '2 giờ 54 phút',
    status: 'manual',
    steps: [
      'Đăng nhập bảng điều khiển Anthropic Console',
      'Xóa tài khoản tran.minh@company.com khỏi tổ chức Claude Enterprise',
      'Bàn giao các Prompt mẫu, Artifacts và Projects cho Trưởng nhóm',
      'Tải lên ảnh chụp màn hình xác nhận đã xóa tài khoản'
    ],
    user: 'Trần Minh'
  },
  {
    account: 'lethuha-dev',
    action: 'provision',
    app: 'GitHub Copilot (OpenAI Codex)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '12/10/2026 16:30',
    decisionSource: 'Yêu cầu REQ-2026-0916-219',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2037',
    lastError: 'API 429 Too Many Requests — Vượt quá giới hạn gọi API nhà cung cấp OpenAI/GitHub. Thời gian giãn cách thử lại: 3600 giây',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    retryCount: 3,
    sla: '1 giờ 12 phút',
    status: 'retry',
    steps: [
      'Gọi API GitHub Organization mời cấp quyền Copilot Codex',
      'Hệ thống tự động chờ và thử lại lần 3/6 theo cơ chế giãn cách số mũ (BRD 6.2)',
      'Nếu hết lượt thử lại, IT Admin có thể chuyển sang làm tay kèm bằng chứng (QĐ-62i)'
    ],
    user: 'Lê Thu Hà'
  },
  {
    account: 'long.do@company.com',
    action: 'deprovision',
    app: 'Claude Enterprise (Anthropic)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '12/10/2026 14:10',
    decisionSource: 'Yêu cầu REQ-2026-0916-102',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2038',
    lastError: 'Mã xác thực OAuth token hết hạn — Cần IT Admin cập nhật khóa kết nối API với Anthropic Console',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    retryCount: 6,
    sla: '4 giờ 00 phút',
    status: 'authError',
    steps: [
      'Kiểm tra lại quyền Admin API Token trong Anthropic Console',
      'Thử kết nối lại hoặc chuyển sang thu hồi thủ công'
    ],
    user: 'Đỗ Hoàng Long'
  },
  {
    account: 'thao.pham@company.com',
    action: 'provision',
    app: 'ChatGPT Enterprise (OpenAI)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '11/10/2026 09:00',
    decisionSource: 'Yêu cầu REQ-2026-0915-048',
    department: 'Vận hành doanh nghiệp',
    id: 'PV-2039',
    lastError: 'Tổ chức OpenAI đã đạt hạn mức tối đa 50 tài khoản — Cần mua thêm hoặc thu hồi seat lãng phí trước khi gán mới (INV-01)',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    sla: '0 giờ 45 phút',
    status: 'capacity',
    steps: [
      'Kiểm tra bảng tối ưu license (UF-10) để thu hồi seat G2/G3 nhàn rỗi',
      'Sau khi seat trống, bấm thử lại để connector cấp phát tự động'
    ],
    user: 'Phạm Thanh Thảo'
  },
  {
    account: 'huyen.le@company.com',
    action: 'provision',
    app: 'Google Gemini Code Assist',
    channel: 'Thao tác thủ công — Cấp khóa bản quyền & Token',
    createdAt: '13/10/2026 10:05',
    decisionSource: 'Yêu cầu REQ-2026-0917-091',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2043',
    planType: 'Khóa bản quyền & Token API',
    planTypeCode: 'K4',
    sla: '5 giờ 30 phút',
    status: 'manual',
    steps: [
      'Mở kho khóa bản quyền (ITA-33) để lấy mã kích hoạt Google Gemini Code Assist',
      'Gán mã khóa cho thiết bị máy tính công ty DEV-WIN-2026-041',
      'Xác nhận kích hoạt và lưu Audit Trail kiểm toán (FR-2.10)'
    ],
    user: 'Lê Thanh Huyền'
  },
  {
    account: 'khang.vu@company.com',
    action: 'provision',
    app: 'Mô hình AI nội bộ (Self-hosted LLM Gateway)',
    channel: 'Thao tác thủ công — Máy chủ suy luận nội bộ',
    createdAt: '13/10/2026 07:30',
    decisionSource: 'Yêu cầu REQ-2026-0917-095',
    department: 'Hạ tầng công nghệ',
    id: 'PV-2044',
    planType: 'Mô hình AI nội bộ',
    planTypeCode: 'K5',
    sla: '8 giờ 00 phút',
    status: 'manual',
    steps: [
      'Phân quyền truy cập cụm máy chủ GPU suy luận nội bộ qua VPN/Zero Trust',
      'Cấp Token truy cập AI Gateway nội bộ cho khang.vu@company.com',
      'Xác nhận kiểm thử kết nối và hoàn tất tác vụ ngoài hệ thống (QĐ-50a)'
    ],
    user: 'Vũ Quang Khang'
  },
  {
    account: 'hieu.nguyen@company.com',
    action: 'provision',
    app: 'ChatGPT Team (OpenAI)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '13/10/2026 06:00',
    decisionSource: 'Yêu cầu REQ-2026-0917-088',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2045',
    planType: 'Gói cá nhân qua email công ty',
    planTypeCode: 'K1',
    sla: '—',
    status: 'completed',
    user: 'Nguyễn Trung Hiếu'
  },
  {
    account: 'lan.dao@company.com',
    action: 'provision',
    app: 'Google Gemini Business (Workspace)',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '13/10/2026 08:00',
    decisionSource: 'Yêu cầu REQ-2026-0917-090',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2046',
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    sla: '1 giờ 50 phút',
    status: 'inProgress',
    user: 'Đào Ngọc Lan'
  },
  {
    account: 'shared-ai-research@company.com',
    action: 'deprovision',
    app: 'Claude Enterprise (Tài khoản nghiên cứu dùng chung)',
    channel: 'Thao tác thủ công — Đổi thông tin xác thực',
    createdAt: '13/10/2026 09:30',
    decisionSource: 'Nghỉ việc OFF-2026-044',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2047',
    isSharedAccount: true,
    planType: 'Workspace Doanh nghiệp',
    planTypeCode: 'K2',
    sla: '2 giờ 00 phút',
    status: 'manual',
    steps: [
      'Thành viên nhóm Trần Minh rời công ty — Kích hoạt việc đổi mật khẩu & 2FA (FR-2.11, ITA-34)',
      'Đổi mật khẩu tài khoản Claude Enterprise dùng chung ngoài hệ thống',
      'Đổi thiết bị xác thực hai lớp (2FA) và cập nhật danh sách thành viên được phép',
      'Xác nhận hoàn tất và ghi vết kiểm toán Audit Trail'
    ],
    user: 'Trần Minh'
  }
]

export type LicenseKey = {
  activatedDevice?: string
  assignedTo?: string
  expiresAt: string
  id: string
  key: string
  lastAudit?: string
  maskedKey: string
  product: string
  status: 'available' | 'assigned' | 'expired'
  tokenQuota?: string
}

export const itLicenseKeys: LicenseKey[] = [
  {
    expiresAt: '31/12/2027',
    id: 'LK-AI-001',
    key: 'OPENAI-CODEX-ENT-2026-4F8A-9B2C-KEY',
    lastAudit: '12/10/2026 14:20 bởi Quang Huy (IT Admin)',
    maskedKey: 'CODEX-****-****-4F8A-****',
    product: 'OpenAI Codex & API Developer Token',
    status: 'available',
    tokenQuota: '50M tokens/tháng'
  },
  {
    expiresAt: '31/12/2027',
    id: 'LK-AI-002',
    key: 'CLAUDE-CODE-PRO-2026-7D1E-3A5F-KEY',
    lastAudit: '11/10/2026 10:05 bởi Quang Huy (IT Admin)',
    maskedKey: 'CLAUDE-****-****-7D1E-****',
    product: 'Claude Code (Anthropic Terminal Agent)',
    status: 'available',
    tokenQuota: '40M tokens/tháng'
  },
  {
    activatedDevice: 'DEV-MBP-2026-088 (MacBook Pro M3)',
    assignedTo: 'Nguyễn Minh An (NV-0042)',
    expiresAt: '31/12/2027',
    id: 'LK-AI-003',
    key: 'GEMINI-CODE-ASSIST-1C4B-8E7D-KEY',
    lastAudit: '13/10/2026 09:15 bởi Quang Huy (IT Admin)',
    maskedKey: 'GEMINI-****-****-1C4B-****',
    product: 'Google Gemini Code Assist (Google Cloud)',
    status: 'assigned',
    tokenQuota: 'Không giới hạn (Gói Doanh nghiệp)'
  },
  {
    expiresAt: '15/06/2026',
    id: 'LK-AI-004',
    key: 'OPENAI-CHATGPT-ENT-2025-2F6G-5H9J',
    lastAudit: '15/06/2025 bởi Quang Huy (IT Admin)',
    maskedKey: 'OAI-****-****-2F6G-****',
    product: 'ChatGPT Enterprise Dedicated Workspace Key',
    status: 'expired',
    tokenQuota: 'Hết hạn sử dụng'
  },
  {
    expiresAt: '30/06/2027',
    id: 'LK-AI-005',
    key: 'ANTHROPIC-CLAUDE-3K7L-6M0N-KEY',
    lastAudit: '08/10/2026 16:40 bởi Quang Huy (IT Admin)',
    maskedKey: 'CLAUDE-****-****-3K7L-****',
    product: 'Claude Enterprise 3.7 Sonnet Seat Key',
    status: 'available',
    tokenQuota: '80M tokens/tháng'
  }
]

export type UsageDataSource = {
  coverage: string
  detectableWaste?: ('G1' | 'G2' | 'G3' | 'G4')[]
  eventCount?: string
  id: string
  isCommApp?: boolean
  lastSync: string
  name: string
  status: 'needsUpdate' | 'active' | 'blocked'
  type: string
}

export const itUsageSources: UsageDataSource[] = [
  {
    coverage: '01/01/2026 – 31/01/2026',
    detectableWaste: ['G1', 'G2', 'G3', 'G4'],
    eventCount: '142.8K sự kiện',
    id: 'SRC-OPENAI',
    isCommApp: false,
    lastSync: '15/01/2026 (Quá 30 ngày)',
    name: 'OpenAI Admin Center (ChatGPT Enterprise & Codex)',
    status: 'needsUpdate',
    type: 'Báo cáo sử dụng CSV (Xuất từ Admin Console)'
  },
  {
    coverage: '01/02/2026 – 15/02/2026',
    detectableWaste: ['G1', 'G2', 'G3', 'G4'],
    eventCount: '89.4K sự kiện',
    id: 'SRC-ANTHROPIC',
    isCommApp: false,
    lastSync: 'Hôm nay 06:00',
    name: 'Anthropic Console (Claude Enterprise & Claude Code OTel)',
    status: 'active',
    type: 'Kết nối tự động API & OTel Telemetry'
  },
  {
    coverage: '01/02/2026 – 15/02/2026',
    detectableWaste: ['G1', 'G2', 'G3', 'G4'],
    eventCount: '104.2K sự kiện',
    id: 'SRC-GEMINI',
    isCommApp: false,
    lastSync: 'Hôm qua 22:30',
    name: 'Google Gemini Business & Vertex AI Workspace',
    status: 'active',
    type: 'Kết nối tự động API'
  },
  {
    coverage: '01/02/2026 – 15/02/2026',
    detectableWaste: ['G1', 'G2', 'G3', 'G4'],
    eventCount: '156.1K sự kiện',
    id: 'SRC-COPILOT',
    isCommApp: false,
    lastSync: 'Hôm nay 08:15',
    name: 'GitHub Copilot Organization Metrics (OpenAI Codex)',
    status: 'active',
    type: 'Nhật ký Git Telemetry & Extension IDE'
  },
  {
    coverage: 'Chỉ theo dõi danh sách thành viên (Roster Only)',
    detectableWaste: ['G1', 'G2'],
    eventCount: '0 (Chặn log)',
    id: 'SRC-INTERNAL-BOT',
    isCommApp: true,
    lastSync: 'Hôm nay 07:00',
    name: 'Chatbot AI hội thoại nội bộ (Internal LLM Bot)',
    status: 'blocked',
    type: 'Rào chắn bảo mật ADR-10 (Chỉ theo dõi thành viên, không thu activity)'
  }
]

export type UnmatchedProfile = {
  candidate?: string
  candidateDepartment?: string
  confidence?: string
  eventCount?: number
  id: string
  normalized: string
  raw: string
  status: 'suggested' | 'noCandidate' | 'conflict'
  vendorName?: string
}

export const itUnmatchedProfiles: UnmatchedProfile[] = [
  {
    candidate: 'Nguyễn Minh An (NV-0042)',
    candidateDepartment: 'Kỹ thuật phần mềm',
    confidence: '94%',
    eventCount: 382,
    id: 'UQ-0184',
    normalized: 'an.nguyen',
    raw: 'an.nguyen@ai-workspace.company.com',
    status: 'suggested',
    vendorName: 'OpenAI Enterprise'
  },
  {
    eventCount: 147,
    id: 'UQ-0185',
    normalized: 'contractor_gemini_dev_99',
    raw: 'contractor_gemini_dev_99@partner-cloud.net',
    status: 'noCandidate',
    vendorName: 'Google Gemini Code Assist'
  },
  {
    candidate: 'Trần Quang Huy (82%) | Trần Huy (80%)',
    candidateDepartment: 'Kỹ thuật phần mềm / Vận hành',
    confidence: '82% / 80%',
    eventCount: 519,
    id: 'UQ-0186',
    normalized: 'huy.tran',
    raw: 'huy.tran@anthropic-claude.team',
    status: 'conflict',
    vendorName: 'Claude Enterprise (Anthropic)'
  }
]

export type ShadowFinding = {
  app: string
  context: string
  estimatedMonthlyCost?: number
  id: string
  risk: 'high' | 'medium' | 'low'
  source: string
  users: number
}

export const itShadowFindings: ShadowFinding[] = [
  {
    app: 'ChatGPT Plus (Tài khoản cá nhân tự mua ngoài luồng)',
    context: 'Lập trình viên và nhân viên Content tự thanh toán thẻ cá nhân để dùng GPT-4o, nguy cơ rò rỉ mã nguồn',
    estimatedMonthlyCost: 3_500_000,
    id: 'FND-2026-045',
    risk: 'medium',
    source: 'Sao kê thẻ tín dụng doanh nghiệp (PAYPAL*OPENAI)',
    users: 7
  },
  {
    app: 'Claude Pro (Tài khoản cá nhân Anthropic)',
    context: 'Lập trình viên đăng nhập email cá nhân vào Claude 3.7 Sonnet để phân tích kiến trúc backend nội bộ',
    estimatedMonthlyCost: 6_000_000,
    id: 'FND-2026-046',
    risk: 'high',
    source: 'Hệ thống định danh Single Sign-On (Google IdP OAuth Logs)',
    users: 12
  },
  {
    app: 'Google Gemini Advanced (Cá nhân ngoài Workspace)',
    context: 'Bộ phận Nghiên cứu đăng ký gói Gemini cá nhân thay vì dùng bản Gemini Business có thỏa thuận bảo mật',
    estimatedMonthlyCost: 1_500_000,
    id: 'FND-2026-047',
    risk: 'low',
    source: 'Bộ thu thập tiện ích thiết bị công ty (ITA-16)',
    users: 3
  }
]

export type ReconciliationDiscrepancy = {
  action: string
  active: number
  app: string
  billed: number
  caseStatus?: 'open' | 'investigating' | 'resolved'
  declared: number
  diff: string
  financeBasis?: string
  id: string
  title: string
  type: 'invoice' | 'shadowAccess' | 'pendingAcceptance'
  vendorErrorNote?: string
}

export const itReconciliationItems: ReconciliationDiscrepancy[] = [
  {
    action: 'Cập nhật đăng ký hợp đồng lên 55 tài khoản (ITA-66)',
    active: 48,
    app: 'ChatGPT Enterprise (OpenAI)',
    billed: 55,
    caseStatus: 'open',
    declared: 50,
    diff: 'Hóa đơn OpenAI: 55 seat | Khai báo nội bộ: 50 seat | Đang gán thực tế: 48 seat (Chênh lệch +5 seat)',
    financeBasis: 'Hóa đơn INV-OAI-2026-01 do Finance đính kèm ghi nhận thanh toán 55 seats',
    id: 'DISC-OAI-01',
    title: 'Lệch số lượng hóa đơn (+5 tài khoản ChatGPT Enterprise)',
    type: 'invoice'
  },
  {
    action: 'Điều tra an ninh & Thu hồi Token khẩn (UF-08)',
    active: 46,
    app: 'Claude Enterprise (Anthropic)',
    billed: 45,
    caseStatus: 'investigating',
    declared: 45,
    diff: 'Tài khoản `external-ai-bot` có quyền Admin tạo API Key trong Anthropic Console nhưng không có Assignment trong hệ thống',
    financeBasis: 'Không có quyết định duyệt chi cho tài khoản ngoài luồng',
    id: 'DISC-ANT-02',
    title: 'Quyền truy cập AI ngoài quy trình (Shadow Access Claude)',
    type: 'shadowAccess'
  },
  {
    action: 'Chuyển tác vụ PV-2041 sang Hoàn tất',
    active: 300,
    app: 'Google Gemini Business (Workspace)',
    billed: 300,
    caseStatus: 'resolved',
    declared: 300,
    diff: 'Lời mời `an.nguyen@company.com` đã được nhân viên đăng nhập kích hoạt thành viên thành công tại kỳ đối soát',
    financeBasis: 'Khớp 100% giữa hợp đồng, phân bổ nội bộ và thành viên active',
    id: 'DISC-GEM-03',
    title: 'Tác vụ chờ chấp nhận đã kích hoạt thành viên',
    type: 'pendingAcceptance'
  }
]

export type CollectorDevice = {
  activeMinutesToday?: number
  allowlistDomains?: string[]
  department: string
  device: string
  employee: string
  gateway: 'open' | 'locked'
  id: string
  lastSync: string
  version: string
}

export const itCollectorDevices: CollectorDevice[] = [
  {
    activeMinutesToday: 185,
    allowlistDomains: ['chatgpt.com', 'claude.ai', 'github.com/copilot'],
    department: 'Kỹ thuật phần mềm',
    device: 'Apple MacBook Pro M3',
    employee: 'Nguyễn Minh An',
    gateway: 'open',
    id: 'DEV-MBP-2026-088',
    lastSync: 'Hôm nay 09:20',
    version: 'Bộ theo dõi AI v1.2'
  },
  {
    activeMinutesToday: 120,
    allowlistDomains: ['chatgpt.com', 'gemini.google.com'],
    department: 'Thiết kế sản phẩm',
    device: 'Lenovo ThinkPad X1 Carbon',
    employee: 'Lê Thu Hà',
    gateway: 'open',
    id: 'DEV-WIN-2026-041',
    lastSync: 'Hôm nay 08:45',
    version: 'Bộ theo dõi AI v1.2'
  },
  {
    activeMinutesToday: 0,
    allowlistDomains: ['claude.ai', 'chatgpt.com'],
    department: 'Thiết kế sản phẩm',
    device: 'Dell XPS 15 9530',
    employee: 'Trần Minh',
    gateway: 'locked',
    id: 'DEV-WIN-2026-077',
    lastSync: 'Chưa có dữ liệu',
    version: 'Bộ theo dõi AI v1.2 (Chờ nhân viên đồng ý)'
  }
]

export type RenewalProposal = {
  app: string
  autoRenew: boolean
  businessOwner: string
  businessOwnerOpinion: string
  contractEnd: string
  currentAnnualCost: number
  currentSeats: number
  daysToDeadline: number
  id: string
  immediateSavings: number
  newAnnualCost: number
  noticeDeadline: string
  recommendedSeats: number
  renewalSavings: number
  status: 'warningT15' | 'warningT7' | 'draft' | 'submitted' | 'executed'
  termsChecklist: {
    accountSharing: { note: string; passed: boolean }
    aiModelTraining: { note: string; passed: boolean }
    cancellationNotice: { note: string; passed: boolean }
    dataResidency: { note: string; passed: boolean }
    deviceLimits: { note: string; passed: boolean }
    ipIndemnity: { note: string; passed: boolean }
  }
  vendor: string
  wasteBreakdown: { unassignedG1: number; unusedG3: number }
}

export const itRenewalProposals: RenewalProposal[] = [
  {
    app: 'ChatGPT Enterprise (OpenAI)',
    autoRenew: true,
    businessOwner: 'Nguyễn Hải Đăng (Trưởng phòng Hạ tầng)',
    businessOwnerOpinion: 'Đồng thuận giảm 15 seat lãng phí, giữ 45 seat phục vụ lập trình viên nòng cốt.',
    contractEnd: '30/04/2026',
    currentAnnualCost: 450_000_000,
    currentSeats: 60,
    daysToDeadline: 14,
    id: 'RNW-2026-001',
    immediateSavings: 0,
    newAnnualCost: 337_500_000,
    noticeDeadline: '31/03/2026',
    recommendedSeats: 45,
    renewalSavings: 112_500_000,
    status: 'warningT15',
    termsChecklist: {
      accountSharing: {
        note: 'Gói Per-seat: Cấm chia sẻ tài khoản ngoài nhân sự định danh.',
        passed: true
      },
      aiModelTraining: {
        note: 'Cam kết Zero Data Retention — Không dùng dữ liệu mã nguồn doanh nghiệp để huấn luyện mô hình.',
        passed: true
      },
      cancellationNotice: {
        note: 'Bắt buộc gửi văn bản báo hủy/giảm số lượng trước 30 ngày.',
        passed: true
      },
      dataResidency: {
        note: 'Lưu trữ đám mây phân vùng US/EU đạt chuẩn SOC 2 Type II.',
        passed: true
      },
      deviceLimits: {
        note: 'Giới hạn tối đa 2 thiết bị làm việc đồng thời mỗi tài khoản.',
        passed: true
      },
      ipIndemnity: {
        note: 'OpenAI cam kết bảo hộ quyền tác giả cho sản phẩm sinh từ Enterprise model.',
        passed: true
      }
    },
    vendor: 'OpenAI LLC',
    wasteBreakdown: { unassignedG1: 8, unusedG3: 7 }
  },
  {
    app: 'Claude Enterprise (Anthropic)',
    autoRenew: true,
    businessOwner: 'Trần Thu Hà (Trưởng phòng Thiết kế)',
    businessOwnerOpinion: 'Đề xuất duy trì 40 seat, cắt giảm 10 seat chưa sử dụng từ đợt tuyển dụng cũ.',
    contractEnd: '31/05/2026',
    currentAnnualCost: 375_000_000,
    currentSeats: 50,
    daysToDeadline: 6,
    id: 'RNW-2026-002',
    immediateSavings: 15_000_000,
    newAnnualCost: 300_000_000,
    noticeDeadline: '30/04/2026',
    recommendedSeats: 40,
    renewalSavings: 75_000_000,
    status: 'warningT7',
    termsChecklist: {
      accountSharing: {
        note: 'Cấm chia sẻ tài khoản per-seat. Cho phép gán tài khoản dịch vụ có người chịu trách nhiệm.',
        passed: true
      },
      aiModelTraining: {
        note: 'Anthropic Commercial Terms: Không huấn luyện mô hình Claude trên prompt/code của khách hàng.',
        passed: true
      },
      cancellationNotice: {
        note: 'Thời hạn báo hủy tối thiểu 30 ngày trước ngày hết hạn.',
        passed: true
      },
      dataResidency: {
        note: 'Hỗ trợ mã hóa dữ liệu đầu cuối (KMS/BYOK).',
        passed: true
      },
      deviceLimits: {
        note: 'Giới hạn 1 phiên làm việc hoạt động đồng thời.',
        passed: true
      },
      ipIndemnity: {
        note: 'Có điều khoản bồi thường sở hữu trí tuệ bản quyền sinh ra.',
        passed: true
      }
    },
    vendor: 'Anthropic PBC',
    wasteBreakdown: { unassignedG1: 6, unusedG3: 4 }
  }
]
