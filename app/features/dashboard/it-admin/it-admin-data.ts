export type ProvisioningPlanType =
  | 'Workspace Doanh nghiệp'
  | 'Gói cá nhân qua email công ty'
  | 'Khóa bản quyền & Token API'
  | 'Mô hình AI nội bộ'

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
    sla: '3 giờ 18 phút',
    status: 'pendingAccept',
    steps: [
      'Gửi lời mời tham gia GitHub Organization cho an.nguyen@company.com',
      'Phân quyền giấy phép Copilot Enterprise trong nhóm Kỹ thuật',
      'Chờ nhân viên đăng nhập chấp nhận lời mời để kích hoạt'
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
    sla: '2 giờ 54 phút',
    status: 'manual',
    steps: [
      'Đăng nhập bảng quản trị Anthropic Console',
      'Xóa tài khoản tran.minh@company.com khỏi tổ chức Claude Enterprise',
      'Chuyển giao quyền sở hữu các Prompt mẫu và Project Workspace cho Trưởng nhóm',
      'Tải lên ảnh chụp màn hình xác nhận đã thu hồi'
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
    department: 'Thiết kế sản phẩm',
    id: 'PV-2037',
    lastError: 'API 429 Too Many Requests — Vượt quá giới hạn gọi API nhà cung cấp. Thời gian chờ thử lại: 3600 giây',
    planType: 'Workspace Doanh nghiệp',
    retryCount: 3,
    sla: '1 giờ 12 phút',
    status: 'retry',
    steps: [
      'Gọi API GitHub Organization mời cấp quyền Copilot',
      'Hệ thống tự động chờ và thử lại lần 3/6 theo cơ chế giãn cách',
      'Nếu hết lượt thử lại, chuyển sang IT Admin gán thủ công'
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
    lastError: 'Mã xác thực OAuth token hết hạn — Cần cấu hình lại thông tin kết nối API với Anthropic',
    planType: 'Workspace Doanh nghiệp',
    retryCount: 6,
    sla: '4 giờ 00 phút',
    status: 'authError',
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
    lastError: 'Tổ chức OpenAI đã đạt hạn mức tối đa 50 tài khoản — Cần nâng gói trước khi thêm mới',
    planType: 'Workspace Doanh nghiệp',
    sla: '0 giờ 45 phút',
    status: 'capacity',
    user: 'Phạm Thanh Thảo'
  },
  {
    account: 'huyen.le@company.com',
    action: 'provision',
    app: 'Cursor AI Pro',
    channel: 'Thao tác thủ công — Cấp khóa bản quyền',
    createdAt: '13/10/2026 10:05',
    decisionSource: 'Yêu cầu REQ-2026-0917-091',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2043',
    planType: 'Khóa bản quyền & Token API',
    sla: '5 giờ 30 phút',
    status: 'manual',
    steps: [
      'Mở kho khóa bản quyền để lấy mã kích hoạt Cursor AI Pro',
      'Gán mã khóa cho thiết bị máy tính DEV-WIN-2026-041',
      'Xác nhận kích hoạt và tải lên ảnh chứng minh'
    ],
    user: 'Lê Thanh Huyền'
  },
  {
    account: 'khang.vu@company.com',
    action: 'provision',
    app: 'Mô hình AI nội bộ (Self-hosted LLM)',
    channel: 'Thao tác thủ công — Máy chủ nội bộ',
    createdAt: '13/10/2026 07:30',
    decisionSource: 'Yêu cầu REQ-2026-0917-095',
    department: 'Hạ tầng công nghệ',
    id: 'PV-2044',
    planType: 'Mô hình AI nội bộ',
    sla: '8 giờ 00 phút',
    status: 'manual',
    steps: [
      'Phân quyền truy cập cụm máy chủ GPU suy luận nội bộ',
      'Cấp Token truy cập API Gateway nội bộ cho khang.vu@company.com',
      'Xác nhận hoàn tất và kiểm tra kết nối'
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
    sla: '—',
    status: 'completed',
    user: 'Nguyễn Trung Hiếu'
  },
  {
    account: 'lan.dao@company.com',
    action: 'provision',
    app: 'Google Gemini Business',
    channel: 'Kết nối tự động (API Connector)',
    createdAt: '13/10/2026 08:00',
    decisionSource: 'Yêu cầu REQ-2026-0917-090',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2046',
    planType: 'Workspace Doanh nghiệp',
    sla: '1 giờ 50 phút',
    status: 'inProgress',
    user: 'Đào Ngọc Lan'
  },
  {
    account: 'shared-midjourney@company.com',
    action: 'deprovision',
    app: 'Midjourney AI (Tài khoản dùng chung)',
    channel: 'Thao tác thủ công — Đổi thông tin xác thực',
    createdAt: '13/10/2026 09:30',
    decisionSource: 'Nghỉ việc OFF-2026-044',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2047',
    isSharedAccount: true,
    planType: 'Gói cá nhân qua email công ty',
    sla: '2 giờ 00 phút',
    status: 'manual',
    steps: [
      'Đổi mật khẩu tài khoản Midjourney dùng chung ngoài hệ thống',
      'Đổi thiết bị xác thực hai lớp (2FA) và cập nhật danh sách người dùng được phép',
      'Đóng tác vụ và ghi nhận vào lịch sử kiểm toán'
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
  maskedKey: string
  product: string
  status: 'available' | 'assigned' | 'expired'
}

export const itLicenseKeys: LicenseKey[] = [
  {
    expiresAt: '31/12/2027',
    id: 'LK-AI-001',
    key: 'CURSOR-PRO-2026-4F8A-9B2C-KEY',
    maskedKey: 'CURSOR-****-****-4F8A-****',
    product: 'Cursor AI Pro',
    status: 'available'
  },
  {
    expiresAt: '31/12/2027',
    id: 'LK-AI-002',
    key: 'CURSOR-PRO-2026-7D1E-3A5F-KEY',
    maskedKey: 'CURSOR-****-****-7D1E-****',
    product: 'Cursor AI Pro',
    status: 'available'
  },
  {
    activatedDevice: 'DEV-MBP-2026-088 (MacBook Pro M3)',
    assignedTo: 'Nguyễn Minh An (NV-0042)',
    expiresAt: '31/12/2027',
    id: 'LK-AI-003',
    key: 'OPENAI-CODEX-TOKEN-1C4B-8E7D',
    maskedKey: 'OPENAI-****-****-1C4B-****',
    product: 'OpenAI Codex & API Access',
    status: 'assigned'
  },
  {
    expiresAt: '15/06/2026',
    id: 'LK-AI-004',
    key: 'PERPLEXITY-ENT-2025-2F6G-5H9J',
    maskedKey: 'PERPLEX-****-****-2F6G-****',
    product: 'Perplexity Pro Enterprise',
    status: 'expired'
  },
  {
    expiresAt: '30/06/2027',
    id: 'LK-AI-005',
    key: 'ANTHROPIC-CLAUDE-3K7L-6M0N-KEY',
    maskedKey: 'CLAUDE-****-****-3K7L-****',
    product: 'Claude Enterprise (Anthropic)',
    status: 'available'
  }
]

export type UsageDataSource = {
  coverage: string
  id: string
  lastSync: string
  name: string
  status: 'needsUpdate' | 'active' | 'blocked'
  type: string
}

export const itUsageSources: UsageDataSource[] = [
  {
    coverage: '01/12/2024 – 31/12/2024',
    id: 'SRC-OPENAI',
    lastSync: '15/12/2024 (Quá 30 ngày)',
    name: 'OpenAI Admin Center (ChatGPT & Codex)',
    status: 'needsUpdate',
    type: 'Báo cáo sử dụng CSV'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-ANTHROPIC',
    lastSync: 'Hôm nay 06:00',
    name: 'Anthropic Console (Claude Enterprise)',
    status: 'active',
    type: 'Kết nối tự động API'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-GEMINI',
    lastSync: 'Hôm qua 22:30',
    name: 'Google Gemini & Vertex AI Workspace',
    status: 'active',
    type: 'Kết nối tự động API'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-COPILOT',
    lastSync: 'Hôm nay 08:15',
    name: 'GitHub Copilot Organization Metrics',
    status: 'active',
    type: 'Nhật ký Git & Tiện ích IDE'
  },
  {
    coverage: 'Không áp dụng (Chỉ theo dõi thành viên)',
    id: 'SRC-INTERNAL-BOT',
    lastSync: 'Hôm nay 07:00',
    name: 'Chatbot AI hội thoại nội bộ',
    status: 'blocked',
    type: 'Chỉ theo dõi thành viên (Bảo vệ riêng tư)'
  }
]

export type UnmatchedProfile = {
  candidate?: string
  candidateDepartment?: string
  confidence?: string
  id: string
  normalized: string
  raw: string
  status: 'suggested' | 'noCandidate' | 'conflict'
}

export const itUnmatchedProfiles: UnmatchedProfile[] = [
  {
    candidate: 'Nguyễn Văn An (NV-0042)',
    candidateDepartment: 'Kỹ thuật phần mềm',
    confidence: '94%',
    id: 'UQ-0184',
    normalized: 'an.nguyen',
    raw: 'an.nguyen@ai-workspace.company.com',
    status: 'suggested'
  },
  {
    id: 'UQ-0185',
    normalized: 'contractor_ai_partner_99',
    raw: 'contractor_ai_partner_99@dev-partner.net',
    status: 'noCandidate'
  },
  {
    candidate: 'Trần Quang Huy (82%) | Trần Huy (80%)',
    candidateDepartment: 'Sản phẩm / Vận hành',
    confidence: '82% / 80%',
    id: 'UQ-0186',
    normalized: 'huy.tran',
    raw: 'huy.tran@openai-team.org',
    status: 'conflict'
  }
]

export type ShadowFinding = {
  app: string
  context: string
  id: string
  risk: 'high' | 'medium' | 'low'
  source: string
  users: number
}

export const itShadowFindings: ShadowFinding[] = [
  {
    app: 'ChatGPT Plus (Tài khoản cá nhân tự mua)',
    context: 'Đội ngũ Marketing tự thanh toán thẻ cá nhân để soạn thảo nội dung truyền thông',
    id: 'FND-2026-045',
    risk: 'medium',
    source: 'Sao kê thẻ tín dụng doanh nghiệp (PAYPAL*OPENAI)',
    users: 7
  },
  {
    app: 'Claude Pro (Tài khoản cá nhân tự phát)',
    context: 'Lập trình viên đăng nhập email cá nhân vào Claude để viết và tối ưu mã nguồn',
    id: 'FND-2026-046',
    risk: 'high',
    source: 'Hệ thống định danh Single Sign-On (Google SSO)',
    users: 12
  },
  {
    app: 'Perplexity Pro (Nghiên cứu ngoài luồng)',
    context: 'Bộ phận Nghiên cứu thị trường đăng ký gói tra cứu tài liệu chuyên sâu',
    id: 'FND-2026-047',
    risk: 'low',
    source: 'Bộ thu thập tiện ích trình duyệt trên thiết bị công ty',
    users: 3
  }
]

export type ReconciliationDiscrepancy = {
  action: string
  app: string
  diff: string
  id: string
  title: string
  type: 'invoice' | 'shadowAccess' | 'pendingAcceptance'
}

export const itReconciliationItems: ReconciliationDiscrepancy[] = [
  {
    action: 'Cập nhật đăng ký hợp đồng lên 55 tài khoản',
    app: 'ChatGPT Enterprise (OpenAI)',
    diff: 'Hóa đơn OpenAI: 55 tài khoản | Quản trị nội bộ: 50 tài khoản | Đang dùng: 48 tài khoản (Chênh lệch +5)',
    id: 'DISC-OAI-01',
    title: 'Lệch số lượng hóa đơn (+5 tài khoản ChatGPT)',
    type: 'invoice'
  },
  {
    action: 'Điều tra an ninh & Thu hồi Token khẩn',
    app: 'Claude Enterprise (Anthropic)',
    diff: 'Tài khoản `external-ai-bot` có quyền Admin tạo API Key nhưng không có phân công trong hệ thống',
    id: 'DISC-ANT-02',
    title: 'Quyền truy cập AI ngoài luồng (Shadow Access)',
    type: 'shadowAccess'
  },
  {
    action: 'Chuyển tác vụ PV-2041 sang Hoàn tất',
    app: 'Google Gemini Business',
    diff: 'Lời mời `an.nguyen@company.com` đã được nhân viên đăng nhập kích hoạt thành viên thành công',
    id: 'DISC-GEM-03',
    title: 'Tác vụ chờ chấp nhận đã kích hoạt thành viên',
    type: 'pendingAcceptance'
  }
]

export type CollectorDevice = {
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
    department: 'Kỹ thuật phần mềm',
    device: 'Apple MacBook Pro M3',
    employee: 'Nguyễn Minh An',
    gateway: 'open',
    id: 'DEV-MBP-2026-088',
    lastSync: 'Hôm nay 09:20',
    version: 'Bộ theo dõi AI v1.2'
  },
  {
    department: 'Thiết kế sản phẩm',
    device: 'Lenovo ThinkPad X1 Carbon',
    employee: 'Lê Thu Hà',
    gateway: 'open',
    id: 'DEV-WIN-2026-041',
    lastSync: 'Hôm nay 08:45',
    version: 'Bộ theo dõi AI v1.2'
  },
  {
    department: 'Thiết kế sản phẩm',
    device: 'Dell XPS 15 9530',
    employee: 'Trần Minh',
    gateway: 'locked',
    id: 'DEV-WIN-2026-077',
    lastSync: 'Chưa có dữ liệu',
    version: 'Bộ theo dõi AI v1.2 (Chờ nhân viên đồng ý)'
  }
]
