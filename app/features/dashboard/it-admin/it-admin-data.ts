export type AllocationType = 'ai-agent' | 'license-key' | 'saas-workspace'

export type ProvisioningPlanType =
  | 'Tài khoản & Mật khẩu AI Agent'
  | 'Mã khóa bản quyền phần mềm'
  | 'Gói Workspace Doanh nghiệp'
  | 'Gói cá nhân qua email công ty'
  | 'Dịch vụ AI máy chủ nội bộ'

export type AgentCredentials = {
  agentId?: string
  username: string
  initialPassword?: string
  apiSecretToken?: string
  assignedScope?: string
  isPasswordRevealed?: boolean
}

export type AssignedLicenseKeyInfo = {
  keyId: string
  productKey: string
  maskedKey: string
  targetDevice: string
  isReversibleToPool: boolean
}

export type RevocationDetails = {
  reason: string
  handoverConfirmed: boolean
  credentialsRevoked: boolean
  deviceDeactivated?: boolean
  keyReturnedToPool?: boolean
}

export type ProvisioningTask = {
  account: string
  action: 'provision' | 'deprovision'
  allocationType: AllocationType
  allocationTypeName: string
  app: string
  channel: string
  createdAt: string
  decisionSource: string
  department: string
  evidence?: string
  id: string
  lastError?: string
  planType: ProvisioningPlanType
  retryCount?: number
  sla: string
  status: 'pendingAccept' | 'manual' | 'retry' | 'authError' | 'capacity' | 'completed' | 'inProgress'
  steps?: string[]
  user: string
  agentCredentials?: AgentCredentials
  assignedLicenseKey?: AssignedLicenseKeyInfo
  revocationDetails?: RevocationDetails
}

export const itProvisioningTasks: ProvisioningTask[] = [
  {
    account: 'agent-codex-devops@company.ai',
    action: 'provision',
    allocationType: 'ai-agent',
    allocationTypeName: 'Tài khoản & Mật khẩu AI Agent',
    app: 'GitHub Copilot Coding Agent',
    channel: 'Cấp phát tài khoản & Mật khẩu khởi tạo',
    createdAt: '13/10/2026 09:14',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0917-084',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2041',
    planType: 'Tài khoản & Mật khẩu AI Agent',
    sla: '3 giờ 18 phút',
    status: 'manual',
    steps: [
      'Khởi tạo tên tài khoản Agent định danh agent-codex-devops@company.ai',
      'Tạo mật khẩu an toàn ban đầu và sinh Khóa bí mật API Secret Token',
      'Phân quyền truy cập kho lưu trữ mã nguồn cho nhóm Kỹ thuật phần mềm',
      'Bàn giao thông tin tài khoản an toàn cho nhân sự chịu trách nhiệm'
    ],
    user: 'Nguyễn Minh An (Chịu trách nhiệm quản lý Agent)',
    agentCredentials: {
      agentId: 'AGT-CODEX-01',
      username: 'agent-codex-devops@company.ai',
      initialPassword: 'Cp8$kL2#mP9@vX7!',
      apiSecretToken: 'sec_live_gh_copilot_9942a78e1b3c0d',
      assignedScope: 'Repository Read & Write, Code Review & Generation'
    }
  },
  {
    account: 'huyen.le@company.com',
    action: 'provision',
    allocationType: 'license-key',
    allocationTypeName: 'Mã khóa bản quyền phần mềm',
    app: 'Microsoft 365 Enterprise (Office 365 E5)',
    channel: 'Cấp 1 mã key từ kho bản quyền công ty',
    createdAt: '13/10/2026 10:05',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0917-091',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2043',
    planType: 'Mã khóa bản quyền phần mềm',
    sla: '5 giờ 30 phút',
    status: 'manual',
    steps: [
      'Chọn 1 mã khóa còn hiệu lực từ Kho khóa bản quyền Microsoft 365',
      'Gán mã key cho thiết bị máy tính công ty DEV-WIN-2026-041',
      'Kích hoạt bộ ứng dụng Office và lưu vết kiểm toán an toàn thông tin'
    ],
    user: 'Lê Thanh Huyền',
    assignedLicenseKey: {
      keyId: 'KEY-M365-01',
      productKey: 'M365E-9482-B27D-8F2A-91K3',
      maskedKey: 'M365E-••••-••••-8F2A-••••',
      targetDevice: 'DEV-WIN-2026-041 (Lenovo ThinkPad X1)',
      isReversibleToPool: true
    }
  },
  {
    account: 'tran.minh@company.com',
    action: 'deprovision',
    allocationType: 'license-key',
    allocationTypeName: 'Mã khóa bản quyền phần mềm',
    app: 'Microsoft 365 Enterprise (Office 365 E5)',
    channel: 'Gỡ kích hoạt thiết bị & Thu hồi mã key về kho',
    createdAt: '13/10/2026 08:45',
    decisionSource: 'Quy trình nhân sự nghỉ việc OFF-2026-044',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2042',
    planType: 'Mã khóa bản quyền phần mềm',
    sla: '2 giờ 54 phút',
    status: 'manual',
    steps: [
      'Gỡ kích hoạt mã bản quyền Office 365 trên máy tính công ty DEV-WIN-2026-077',
      'Thu hồi mã key trở lại Kho khóa bản quyền để sẵn sàng cấp cho nhân viên khác',
      'Xác nhận bàn giao dữ liệu OneDrive/Outlook và hoàn tất thu hồi'
    ],
    user: 'Trần Minh',
    revocationDetails: {
      reason: 'Nhân viên thôi việc, thu hồi mã bản quyền phần mềm về kho',
      handoverConfirmed: true,
      credentialsRevoked: false,
      deviceDeactivated: false,
      keyReturnedToPool: false
    }
  },
  {
    account: 'agent-claude-qa@company.ai',
    action: 'deprovision',
    allocationType: 'ai-agent',
    allocationTypeName: 'Tài khoản & Mật khẩu AI Agent',
    app: 'Claude Autonomous QA Agent',
    channel: 'Vô hiệu hóa tài khoản & Hủy thông tin xác thực',
    createdAt: '13/10/2026 09:30',
    decisionSource: 'Quy trình nhân sự nghỉ việc OFF-2026-044',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2047',
    planType: 'Tài khoản & Mật khẩu AI Agent',
    sla: '2 giờ 00 phút',
    status: 'manual',
    steps: [
      'Vô hiệu hóa tài khoản đăng nhập AI Agent agent-claude-qa@company.ai',
      'Hủy mật khẩu khởi tạo và thu hồi toàn bộ API Secret Token',
      'Ngắt kết nối các webhook kiểm thử tự động đang hoạt động',
      'Cập nhật trạng thái ngừng hoạt động và lưu vết kiểm toán'
    ],
    user: 'Trần Minh (Chịu trách nhiệm cũ)',
    revocationDetails: {
      reason: 'Nhân sự phụ trách nghỉ việc, vô hiệu hóa tài khoản và hủy API Token',
      handoverConfirmed: true,
      credentialsRevoked: false
    }
  },
  {
    account: 'lethuha-dev@company.com',
    action: 'provision',
    allocationType: 'license-key',
    allocationTypeName: 'Mã khóa bản quyền phần mềm',
    app: 'JetBrains All Products Pack',
    channel: 'Cấp 1 mã key từ kho bản quyền công ty',
    createdAt: '12/10/2026 16:30',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0916-219',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2037',
    lastError: 'Quá hạn mức số lượt gọi API máy chủ kích hoạt JetBrains. Thời gian giãn cách thử lại: 3600 giây',
    planType: 'Mã khóa bản quyền phần mềm',
    retryCount: 3,
    sla: '1 giờ 12 phút',
    status: 'retry',
    steps: [
      'Kết nối máy chủ kích hoạt license trực tuyến JetBrains',
      'Hệ thống tự động chờ và thử lại kết nối theo cơ chế giãn cách',
      'Nếu không thành công, IT Admin có thể gán mã key ngoại tuyến từ Kho khóa'
    ],
    user: 'Lê Thu Hà'
  },
  {
    account: 'long.do@company.com',
    action: 'deprovision',
    allocationType: 'saas-workspace',
    allocationTypeName: 'Gói Workspace Doanh nghiệp',
    app: 'Claude Enterprise (Anthropic)',
    channel: 'Kết nối tự động qua API Connector',
    createdAt: '12/10/2026 14:10',
    decisionSource: 'Yêu cầu thu hồi REQ-2026-0916-102',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2038',
    lastError: 'Mã xác thực token kết nối với Anthropic Console đã hết hạn — Cần cập nhật khóa kết nối',
    planType: 'Gói Workspace Doanh nghiệp',
    retryCount: 6,
    sla: '4 giờ 00 phút',
    status: 'authError',
    steps: [
      'Kiểm tra lại quyền Admin API Token trong Anthropic Console',
      'Thử kết nối lại hoặc chuyển sang thu hồi thủ công trên bảng điều khiển'
    ],
    user: 'Đỗ Hoàng Long'
  },
  {
    account: 'thao.pham@company.com',
    action: 'provision',
    allocationType: 'saas-workspace',
    allocationTypeName: 'Gói Workspace Doanh nghiệp',
    app: 'ChatGPT Enterprise (OpenAI)',
    channel: 'Kết nối tự động qua API Connector',
    createdAt: '11/10/2026 09:00',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0915-048',
    department: 'Vận hành doanh nghiệp',
    id: 'PV-2039',
    lastError: 'Tổ chức đã đạt hạn mức tối đa 50 tài khoản — Cần mua thêm hoặc thu hồi tài khoản không dùng trước khi gán mới',
    planType: 'Gói Workspace Doanh nghiệp',
    sla: '0 giờ 45 phút',
    status: 'capacity',
    steps: [
      'Kiểm tra danh sách tài khoản nhàn rỗi để thu hồi tái phân bổ',
      'Sau khi có vị trí trống, bấm thử lại để hệ thống cấp phát tự động'
    ],
    user: 'Phạm Thanh Thảo'
  },
  {
    account: 'lan.dao@company.com',
    action: 'provision',
    allocationType: 'saas-workspace',
    allocationTypeName: 'Gói Workspace Doanh nghiệp',
    app: 'Google Gemini Business (Workspace)',
    channel: 'Kết nối tự động qua API Connector',
    createdAt: '13/10/2026 08:00',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0917-090',
    department: 'Thiết kế sản phẩm',
    id: 'PV-2046',
    planType: 'Gói Workspace Doanh nghiệp',
    sla: '1 giờ 50 phút',
    status: 'inProgress',
    user: 'Đào Ngọc Lan'
  },
  {
    account: 'hieu.nguyen@company.com',
    action: 'provision',
    allocationType: 'license-key',
    allocationTypeName: 'Mã khóa bản quyền phần mềm',
    app: 'Microsoft 365 Business Standard',
    channel: 'Cấp 1 mã key từ kho bản quyền công ty',
    createdAt: '13/10/2026 06:00',
    decisionSource: 'Yêu cầu cấp phát REQ-2026-0917-088',
    department: 'Kỹ thuật phần mềm',
    id: 'PV-2045',
    planType: 'Mã khóa bản quyền phần mềm',
    sla: '—',
    status: 'completed',
    user: 'Nguyễn Trung Hiếu',
    assignedLicenseKey: {
      keyId: 'KEY-M365-04',
      productKey: 'M365E-3312-77XA-5K99-12QQ',
      maskedKey: 'M365E-••••-••••-5K99-••••',
      targetDevice: 'DEV-MBP-2026-012',
      isReversibleToPool: true
    }
  }
]

export type LicenseKey = {
  activatedDevice?: string
  allowReassignment: boolean
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
    allowReassignment: true,
    expiresAt: '31/12/2027',
    id: 'KEY-M365-01',
    key: 'M365E-9482-B27D-8F2A-91K3',
    lastAudit: '12/10/2026 14:20 bởi Quang Huy (IT Admin)',
    maskedKey: 'M365E-••••-••••-8F2A-••••',
    product: 'Microsoft 365 Enterprise (Office 365 E5)',
    status: 'available',
    tokenQuota: 'Cấp phép trọn bộ Office, Teams, SharePoint'
  },
  {
    allowReassignment: true,
    expiresAt: '31/12/2027',
    id: 'KEY-OFF-02',
    key: 'OFF21-5X89-22KM-3C7D-PL44',
    lastAudit: '11/10/2026 10:05 bởi Quang Huy (IT Admin)',
    maskedKey: 'OFF21-••••-••••-3C7D-••••',
    product: 'Microsoft Office Professional Plus 2021',
    status: 'available',
    tokenQuota: 'Bản quyền vĩnh viễn trên máy tính'
  },
  {
    allowReassignment: true,
    expiresAt: '31/12/2027',
    id: 'KEY-JB-03',
    key: 'JBAPP-8841-KK39-9E11-2026',
    lastAudit: '13/10/2026 09:15 bởi Quang Huy (IT Admin)',
    maskedKey: 'JBAPP-••••-••••-9E11-••••',
    product: 'JetBrains All Products Pack',
    status: 'available',
    tokenQuota: 'Bao gồm IntelliJ IDEA, WebStorm, PyCharm'
  },
  {
    activatedDevice: 'DEV-WIN-2026-041 (Lenovo ThinkPad X1)',
    allowReassignment: true,
    assignedTo: 'Lê Thanh Huyền',
    expiresAt: '31/12/2027',
    id: 'KEY-M365-04',
    key: 'M365E-3312-77XA-5K99-12QQ',
    lastAudit: '13/10/2026 10:10 bởi Quang Huy (IT Admin)',
    maskedKey: 'M365E-••••-••••-5K99-••••',
    product: 'Microsoft 365 Enterprise (Office 365 E5)',
    status: 'assigned',
    tokenQuota: 'Đang kích hoạt trên máy DEV-WIN-2026-041'
  },
  {
    allowReassignment: false,
    expiresAt: '31/12/2028',
    id: 'KEY-WIN-05',
    key: 'WIN11-4491-CC82-4B82-99XX',
    lastAudit: '15/06/2025 bởi Quang Huy (IT Admin)',
    maskedKey: 'WIN11-••••-••••-4B82-••••',
    product: 'Windows 11 Enterprise LTSC',
    status: 'available',
    tokenQuota: 'Bản quyền kích hoạt máy trạm chuyên dụng'
  },
  {
    allowReassignment: true,
    expiresAt: '30/06/2027',
    id: 'KEY-AI-06',
    key: 'CODEX-7788-1122-4F8A-9900',
    lastAudit: '08/10/2026 16:40 bởi Quang Huy (IT Admin)',
    maskedKey: 'CODEX-••••-••••-4F8A-••••',
    product: 'OpenAI Codex & API Developer Token',
    status: 'available',
    tokenQuota: 'Hạn mức 50M tokens/tháng cho Agent'
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
    name: 'Anthropic Console (Claude Enterprise & Telemetry)',
    status: 'active',
    type: 'Kết nối tự động API & Telemetry'
  },
  {
    coverage: '01/02/2026 – 15/02/2026',
    detectableWaste: ['G1', 'G2', 'G3', 'G4'],
    eventCount: '104.2K sự kiện',
    id: 'SRC-GEMINI',
    isCommApp: false,
    lastSync: 'Hôm qua 22:30',
    name: 'Google Gemini Business & Workspace Admin',
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
    name: 'GitHub Copilot Organization Metrics',
    status: 'active',
    type: 'Nhật ký Git Telemetry & Extension IDE'
  },
  {
    coverage: 'Chỉ theo dõi danh sách thành viên',
    detectableWaste: ['G1', 'G2'],
    eventCount: '0 (Chặn log)',
    id: 'SRC-INTERNAL-BOT',
    isCommApp: true,
    lastSync: 'Hôm nay 07:00',
    name: 'Chatbot hội thoại nội bộ',
    status: 'blocked',
    type: 'Rào chắn bảo mật (Chỉ theo dõi danh sách thành viên, không thu nội dung hội thoại)'
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
    context: 'Lập trình viên và nhân viên tự thanh toán thẻ cá nhân để dùng công cụ AI, nguy cơ rò rỉ dữ liệu',
    estimatedMonthlyCost: 3_500_000,
    id: 'FND-2026-045',
    risk: 'medium',
    source: 'Sao kê thẻ tín dụng doanh nghiệp (PAYPAL*OPENAI)',
    users: 7
  },
  {
    app: 'Claude Pro (Tài khoản cá nhân Anthropic)',
    context: 'Nhân viên đăng nhập email cá nhân vào Claude để phân tích kiến trúc backend nội bộ',
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
    source: 'Bộ thu thập tiện ích thiết bị công ty',
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
    action: 'Điều tra chênh lệch cùng Tài chính & Ghi nhận lỗi hóa đơn nếu Vendor tính sai',
    active: 225,
    app: 'Microsoft 365 Enterprise E5',
    billed: 250,
    caseStatus: 'open',
    declared: 230,
    diff: 'Hóa đơn: 250 seat | Hợp đồng duyệt: 230 seat | Đang gán: 225 seat (Lệch thừa +20 seat trên hóa đơn)',
    financeBasis: 'Hóa đơn MS-INV-2026-04 do Tài chính cung cấp ghi nhận tính phí 250 seats',
    id: 'DISC-MS365-01',
    title: 'Lệch số lượng hóa đơn Microsoft 365 (+20 seat)',
    type: 'invoice'
  },
  {
    action: 'Cô lập quyền truy cập ngoài luồng & Chuyển Người duyệt chi quyết định hợp thức hóa hoặc thu hồi',
    active: 46,
    app: 'Figma Organization',
    billed: 45,
    caseStatus: 'investigating',
    declared: 45,
    diff: 'Tài khoản dev-contractor@partner.com giữ quyền Editor trên Figma Console nhưng không có hồ sơ duyệt chi',
    financeBasis: 'Không có quyết định duyệt chi hoặc đề xuất phần mềm hợp lệ cho tài khoản ngoài quy trình',
    id: 'DISC-FIGMA-02',
    title: 'Tài khoản ngoài quy trình trên portal nhà cung cấp (Figma Editor)',
    type: 'shadowAccess'
  },
  {
    action: 'Thực thi kích hoạt 5 license còn thiếu trên License Server hoặc hủy lệnh nếu không còn nhu cầu',
    active: 115,
    app: 'JetBrains All Products Pack',
    billed: 120,
    caseStatus: 'open',
    declared: 120,
    diff: 'Hợp đồng: 120 seat | Máy chủ JetBrains kích hoạt: 115 seat (Thiếu 5 tài khoản chưa cấp trên Portal Vendor)',
    financeBasis: 'Đã phê duyệt ngân sách cho 120 lập trình viên theo quyết định chi số REQ-2026-081',
    id: 'DISC-JET-03',
    title: 'Thiếu tài khoản ở phía Vendor (5 license JetBrains)',
    type: 'invoice'
  },
  {
    action: 'Đã xác minh và lưu vết kiểm toán — Không có sai lệch tồn đọng',
    active: 300,
    app: 'Google Workspace Enterprise',
    billed: 300,
    caseStatus: 'resolved',
    declared: 300,
    diff: 'Khớp 100% giữa hóa đơn, hợp đồng nội bộ và 300 thành viên đang hoạt động',
    financeBasis: 'Khớp hoàn toàn 300/300 tài khoản giữa Google Admin Console và danh sách nhân sự nội bộ',
    id: 'DISC-GWS-04',
    title: 'Hồ sơ đã đối soát khớp hoàn toàn',
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
    allowlistDomains: ['office.com', 'jetbrains.com', 'figma.com', 'github.com'],
    department: 'Kỹ thuật phần mềm',
    device: 'Apple MacBook Pro M3',
    employee: 'Nguyễn Minh An',
    gateway: 'open',
    id: 'DEV-MBP-2026-088',
    lastSync: 'Hôm nay 09:20',
    version: 'Bộ theo dõi phần mềm v1.2'
  },
  {
    activeMinutesToday: 120,
    allowlistDomains: ['office.com', 'figma.com', 'slack.com'],
    department: 'Thiết kế sản phẩm',
    device: 'Lenovo ThinkPad X1 Carbon',
    employee: 'Lê Thu Hà',
    gateway: 'open',
    id: 'DEV-WIN-2026-041',
    lastSync: 'Hôm nay 08:45',
    version: 'Bộ theo dõi phần mềm v1.2'
  },
  {
    activeMinutesToday: 0,
    allowlistDomains: ['office.com', 'zoom.us'],
    department: 'Thiết kế sản phẩm',
    device: 'Dell XPS 15 9530',
    employee: 'Trần Minh',
    gateway: 'locked',
    id: 'DEV-WIN-2026-077',
    lastSync: 'Chưa có dữ liệu',
    version: 'Bộ theo dõi phần mềm v1.2 (Chờ nhân viên đồng ý)'
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
    commercialUse: { note: string; passed: boolean }
    cancellationNotice: { note: string; passed: boolean }
    dataAndIpRights: { note: string; passed: boolean }
    dataResidency: { note: string; passed: boolean }
    deviceLimits: { note: string; passed: boolean }
  }
  vendor: string
  wasteBreakdown: { unassignedG1: number; unusedG3: number }
}

export const itRenewalProposals: RenewalProposal[] = [
  {
    app: 'Microsoft 365 Enterprise E5',
    autoRenew: true,
    businessOwner: 'Nguyễn Hải Đăng (Trưởng phòng Hạ tầng CNTT)',
    businessOwnerOpinion: 'Đồng thuận cắt giảm 40 seat lãng phí (25 seat chưa gán + 15 seat không hoạt động), duy trì 210 seat cho toàn công ty.',
    contractEnd: '30/04/2026',
    currentAnnualCost: 1_250_000_000,
    currentSeats: 250,
    daysToDeadline: 14,
    id: 'RNW-2026-001',
    immediateSavings: 0,
    newAnnualCost: 1_050_000_000,
    noticeDeadline: '31/03/2026',
    recommendedSeats: 210,
    renewalSavings: 200_000_000,
    status: 'warningT15',
    termsChecklist: {
      accountSharing: {
        note: 'Bản quyền theo người dùng định danh. Cấm dùng chung tài khoản.',
        passed: true
      },
      commercialUse: {
        note: 'Cấp phép thương mại đầy đủ cho toàn bộ tổ chức.',
        passed: true
      },
      cancellationNotice: {
        note: 'Thời hạn gửi thông báo giảm số lượng hoặc hủy trước tối thiểu 30 ngày.',
        passed: true
      },
      dataAndIpRights: {
        note: 'Dữ liệu thuộc sở hữu khách hàng, Microsoft cam kết bảo mật theo tiêu chuẩn doanh nghiệp.',
        passed: true
      },
      dataResidency: {
        note: 'Lưu trữ đám mây Microsoft Cloud phân vùng khu vực Đông Nam Á / APAC.',
        passed: true
      },
      deviceLimits: {
        note: 'Mỗi tài khoản cho phép đăng nhập tối đa 5 thiết bị làm việc công ty.',
        passed: true
      }
    },
    vendor: 'Microsoft Corporation',
    wasteBreakdown: { unassignedG1: 25, unusedG3: 15 }
  },
  {
    app: 'JetBrains All Products Pack',
    autoRenew: true,
    businessOwner: 'Phạm Minh Tuấn (Giám đốc Kỹ thuật)',
    businessOwnerOpinion: 'Đồng ý giảm 15 license của các vị trí đã thôi việc và thử việc không đạt, giữ 105 license cho kỹ sư phần mềm.',
    contractEnd: '31/05/2026',
    currentAnnualCost: 480_000_000,
    currentSeats: 120,
    daysToDeadline: 6,
    id: 'RNW-2026-002',
    immediateSavings: 20_000_000,
    newAnnualCost: 420_000_000,
    noticeDeadline: '30/04/2026',
    recommendedSeats: 105,
    renewalSavings: 60_000_000,
    status: 'warningT7',
    termsChecklist: {
      accountSharing: {
        note: 'Giấy phép gán cho cá nhân lập trình viên hoặc tài khoản dịch vụ có lead phụ trách.',
        passed: true
      },
      commercialUse: {
        note: 'Được phép thương mại hóa mã nguồn và sản phẩm phát triển qua IDE.',
        passed: true
      },
      cancellationNotice: {
        note: 'Thời hạn thông báo điều chỉnh hợp đồng trước 30 ngày.',
        passed: true
      },
      dataAndIpRights: {
        note: 'Mã nguồn xử lý cục bộ trên máy trạm lập trình viên, không đồng bộ lên đám mây vendor.',
        passed: true
      },
      dataResidency: {
        note: 'Máy chủ kích hoạt và quản lý bản quyền JetBrains Hub đặt tại nội bộ/EU.',
        passed: true
      },
      deviceLimits: {
        note: 'Tối đa 2 máy trạm lập trình công ty được cài đặt cho mỗi lập trình viên.',
        passed: true
      }
    },
    vendor: 'JetBrains s.r.o.',
    wasteBreakdown: { unassignedG1: 8, unusedG3: 7 }
  },
  {
    app: 'Figma Organization',
    autoRenew: true,
    businessOwner: 'Trần Thu Hà (Trưởng phòng Thiết kế)',
    businessOwnerOpinion: 'Số lượng 45 seat đang sử dụng hiệu quả cao bởi đội ngũ UI/UX. Đề xuất gia hạn nguyên trạng số lượng.',
    contractEnd: '15/06/2026',
    currentAnnualCost: 243_000_000,
    currentSeats: 45,
    daysToDeadline: 21,
    id: 'RNW-2026-003',
    immediateSavings: 0,
    newAnnualCost: 243_000_000,
    noticeDeadline: '15/05/2026',
    recommendedSeats: 45,
    renewalSavings: 0,
    status: 'draft',
    termsChecklist: {
      accountSharing: {
        note: 'Mỗi tài khoản Editor gán với một nhà thiết kế cụ thể trong tổ chức.',
        passed: true
      },
      commercialUse: {
        note: 'Quyền sở hữu toàn bộ file thiết kế và hệ thống Design System thuộc công ty.',
        passed: true
      },
      cancellationNotice: {
        note: 'Báo hủy trước 30 ngày tính từ ngày kết thúc hợp đồng.',
        passed: true
      },
      dataAndIpRights: {
        note: 'Figma không sử dụng dữ liệu thiết kế doanh nghiệp để đào tạo tính năng AI công cộng.',
        passed: true
      },
      dataResidency: {
        note: 'Lưu trữ đám mây đạt chứng chỉ an toàn SOC 2 Type II và ISO 27001.',
        passed: true
      },
      deviceLimits: {
        note: 'Đăng nhập không giới hạn thiết bị nhưng chỉ 1 phiên chỉnh sửa chủ động.',
        passed: true
      }
    },
    vendor: 'Figma Inc.',
    wasteBreakdown: { unassignedG1: 0, unusedG3: 0 }
  }
]

// ============================================================================
// IT ADMIN ARCHITECTURE (SPEC IT-00 TO IT-11 & ACCEPTANCE CRITERIA IT-AC-01 TO 15)
// ============================================================================

export type ItDepartment = {
  id: string
  name: string
  code: string
  managerName: string
  managerEmail: string
  batchCount: number
  totalRequests: number
  requestCounts: {
    pendingConfig: number // Chờ cấu hình/mua
    ready: number // Sẵn sàng cấp
    inProgress: number // Đang cấp
    needsCheck: number // Cần kiểm tra kết quả
    needsHandover: number // Cần xử lý bàn giao
    failed: number // Cấp thất bại
    completed: number // Hoàn thành
  }
}

export type ItBatch = {
  id: string
  departmentId: string
  departmentName: string
  name: string // e.g. "Đợt 1 - tháng 10/2026"
  month: string // e.g. "10/2026"
  startDate: string
  endDate: string
  status: 'open' | 'locked' // Đang mở / Đã khóa
  totalRequests: number
  readyCount: number
  inProgressCount: number
  completedCount: number
  failedCount: number
  isUnbatchedGroup?: boolean
}

export type ItProvisioningStatus =
  | 'pendingConfig' // Chờ cấu hình/mua
  | 'ready' // Sẵn sàng cấp
  | 'inProgress' // Đang cấp
  | 'needsCheck' // Cần kiểm tra kết quả
  | 'needsHandover' // Cần xử lý bàn giao
  | 'failed' // Cấp thất bại
  | 'completed' // Hoàn thành

export type ItProvisioningCredentialType = 'account' | 'apiKey' | 'directAccess'

export type ItProvisioningItem = {
  id: string
  originalRequestId: string // Mã đề nghị gốc
  departmentId: string
  departmentName: string
  batchId: string | null // null = Chưa xếp đợt
  requesterName: string
  requesterEmail: string
  beneficiaryName: string
  beneficiaryEmail: string
  beneficiaryRole: string
  softwareName: string
  planName: string
  quantity: 1 // Đúng 1 đơn vị cấp
  unit: string // 'Tài khoản' | 'API Key' | 'Quyền truy cập SSO'
  credentialType: ItProvisioningCredentialType
  submittedAt: string
  purpose: string
  status: ItProvisioningStatus
  feasibility: {
    isConfigured: boolean
    purchasedRemaining: number
    isApiReady: boolean
    blockReason?: string
  }
  provisioningResult?: {
    grantedAt?: string
    operatorName?: string
    providerRef?: string
    grantedPlan?: string
    accountDetails?: {
      username: string
      initialPassword?: string
      setupLink?: string
      activated: boolean
    }
    apiKeyDetails?: {
      keyName: string
      maskedKey: string
      fullKey?: string
      createdAt: string
      expiresAt: string
      scopes: string
    }
    directAccessDetails?: {
      accountId: string
      workspaceId: string
      status: string
    }
    lastError?: string
    transactionCode?: string
    recoveryGuide?: string
  }
  auditTrail: Array<{
    timestamp: string
    action: string
    actor: string
    details: string
  }>
}

export type ItReconciliationRow = {
  id: string
  period: string
  departmentId: string
  departmentName: string
  softwareName: string
  planName: string
  unit: string
  validDemand: number
  purchasedValid: number
  grantedValid: number
  availableRemaining: number
  missing: number
  surplus: number
  status: 'deficit' | 'surplus' | 'matched' | 'insufficientData' | 'needsVerification'
  constituentRequests: string[]
  constituentPurchases: Array<{
    docId: string
    docType: 'invoice' | 'contract'
    docNumber: string
    date: string
    qty: number
    vendor: string
  }>
  conflictData?: {
    contractQty: number
    contractDoc: string
    invoiceQty: number
    invoiceDoc: string
    resolvedQty?: number
    resolutionReason?: string
  }
}

export type ItPurchaseDoc = {
  id: string
  docNumber: string
  type: 'invoice' | 'contract'
  vendor: string
  issueDate: string
  validPeriod: string
  currency: string
  software: string
  plan: string
  qty: number
  unitPrice: number
  totalAmount: number
  status: 'draft' | 'reading' | 'needsCheck' | 'verified' | 'error'
  scanPreviewText?: string
  departmentScope: string
  mappedCatalogId?: string
  linkedDocId?: string
}

export type ItDeptUsageSummary = {
  departmentId: string
  departmentName: string
  peopleWithData: number
  devicesActive: number
  lastSync: string
  totalDurationHours: number
  totalSessions: number
  totalTokens: string
  missingDataCount: number
  collectorStatus: 'healthy' | 'offline'
  offlineSince?: string
}

export type TokenTrendPoint = {
  label: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export type TokenUsageAnalytics = {
  isAgent: boolean
  growthRate: number // Phần trăm tăng trưởng (+) hoặc thụt lùi (-)
  growthStatus: 'increasing' | 'decreasing' | 'steady'
  periodSummaries: {
    day: { current: number; previous: number; percent: number }
    week: { current: number; previous: number; percent: number }
    month: { current: number; previous: number; percent: number }
  }
  dayData: TokenTrendPoint[]
  weekData: TokenTrendPoint[]
  monthData: TokenTrendPoint[]
}

export type ItEmployeeUsageRecord = {
  id: string
  name: string
  email: string
  departmentId: string
  departmentName: string
  software: string
  activeDays: number
  frequency: string
  durationMinutes: number
  lastUsed: string
  inputTokens: number
  outputTokens: number
  isEstimatedTokens: boolean
  tokenSource: string
  tokenAnalytics?: TokenUsageAnalytics
  sessions: Array<{
    id: string
    app: string
    startTime: string
    endTime: string
    duration: string
    device: string
    source: string
  }>
  promptHistory: Array<{
    id: string
    time: string
    tool: string
    promptPreview: string
    fullPrompt: string
    response: string
    masked: boolean
  }> | null
  collectorHealth?: {
    status: 'connected' | 'disconnected'
    disconnectedAt?: string
    lastDataPoint?: string
  }
}

export type ItOptimizationAlertItem = {
  id: string
  employeeId?: string
  type: 'lowUsage' | 'idleLong' | 'delayedReclaim' | 'missingData'
  severity: 'high' | 'medium' | 'low'
  departmentId: string
  departmentName: string
  employeeName: string
  employeeEmail: string
  softwareName: string
  planName: string
  reclaimImpact: {
    canReuse: boolean
    reclaimRefundText: string
  }
  evidence: {
    threshold: string
    observationPeriod: string
    lastUsed: string
    usageStats: string
    tokens: string
    costPerMonth: number
    daysWaiting: number
    dataSource: string
  }
  status: 'pending' | 'reclaiming' | 'reclaimed' | 'reclaimFailed' | 'kept'
  keepReason?: string
}

export type ItExternalRequestItem = {
  id: string
  departmentId: string
  departmentName: string
  requesterName: string
  requesterEmail: string
  softwareName: string
  planName: string
  productUrl: string
  submittedAt: string
  purpose: string
  beneficiaries: Array<{ name: string; email: string; role: string }>
  estimatedCost: string
  duration: string
  status: 'pendingDecision' | 'accepted' | 'rejected' | 'pendingConfig' | 'ready'
  rejectReason?: string
  decisionNotes?: string
  decisionBy?: string
  decisionAt?: string
}

export type ItCatalogItem = {
  id: string
  softwareName: string
  vendor: string
  planName: string
  provisioningType: 'Tài khoản' | 'API key' | 'Quyền truy cập SSO'
  status: 'allowed' | 'stopped' | 'draft' // Cho phép xin / Ngừng cho xin / Nháp
  departments: string[]
  openRequests: number
  purchasedCount: number
  availableCount: number
  apiReady: boolean
  description: string
  hasHistory: boolean
}

// ----------------------------------------------------------------------------
// INITIAL FIXTURE DATA
// ----------------------------------------------------------------------------

export const initialItDepartments: ItDepartment[] = [
  {
    id: 'dept-eng',
    name: 'Kỹ thuật phần mềm',
    code: 'ENG',
    managerName: 'Trần Văn Hùng',
    managerEmail: 'hung.tran@company.com',
    batchCount: 2,
    totalRequests: 8,
    requestCounts: {
      pendingConfig: 1,
      ready: 4,
      inProgress: 1,
      needsCheck: 1,
      needsHandover: 1,
      failed: 1,
      completed: 2
    }
  },
  {
    id: 'dept-design',
    name: 'Thiết kế & Marketing',
    code: 'DES',
    managerName: 'Lê Thị Mai',
    managerEmail: 'mai.le@company.com',
    batchCount: 1,
    totalRequests: 3,
    requestCounts: {
      pendingConfig: 1,
      ready: 1,
      inProgress: 0,
      needsCheck: 0,
      needsHandover: 0,
      failed: 0,
      completed: 1
    }
  },
  {
    id: 'dept-finance',
    name: 'Tài chính Kế toán',
    code: 'FIN',
    managerName: 'Phạm Thị Lan',
    managerEmail: 'lan.pham@company.com',
    batchCount: 0,
    totalRequests: 0,
    requestCounts: {
      pendingConfig: 0,
      ready: 0,
      inProgress: 0,
      needsCheck: 0,
      needsHandover: 0,
      failed: 0,
      completed: 0
    }
  }
]

export const initialItBatches: ItBatch[] = [
  {
    id: 'batch-eng-01',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    name: 'Đợt 1 - tháng 10/2026',
    month: '10/2026',
    startDate: '01/10/2026',
    endDate: '15/10/2026',
    status: 'locked',
    totalRequests: 4,
    readyCount: 2,
    inProgressCount: 0,
    completedCount: 2,
    failedCount: 0
  },
  {
    id: 'batch-eng-02',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    name: 'Đợt 2 - tháng 10/2026',
    month: '10/2026',
    startDate: '16/10/2026',
    endDate: '31/10/2026',
    status: 'open',
    totalRequests: 3,
    readyCount: 1,
    inProgressCount: 1,
    completedCount: 0,
    failedCount: 1
  },
  {
    id: 'batch-des-01',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    name: 'Đợt 1 - tháng 10/2026',
    month: '10/2026',
    startDate: '05/10/2026',
    endDate: '25/10/2026',
    status: 'open',
    totalRequests: 2,
    readyCount: 1,
    inProgressCount: 0,
    completedCount: 1,
    failedCount: 0
  }
]

export const initialItProvisioningItems: ItProvisioningItem[] = [
  // IT-AC-01 & IT-AC-02: Nguyễn Minh An có 2 yêu cầu độc lập trong Đợt 1
  {
    id: 'REQ-2026-0917-084',
    originalRequestId: 'REQ-2026-0917-084',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-01',
    requesterName: 'Nguyễn Minh An',
    requesterEmail: 'an.nguyen@company.com',
    beneficiaryName: 'Nguyễn Minh An',
    beneficiaryEmail: 'an.nguyen@company.com',
    beneficiaryRole: 'Kỹ sư phần mềm cao cấp (Senior Backend Engineer)',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '13/10/2026 09:14',
    purpose: 'Phân tích tài liệu kiến trúc kỹ thuật và sinh boilerplate code microservices',
    status: 'ready', // Sẵn sàng cấp
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 2,
      isApiReady: true
    },
    auditTrail: [
      {
        timestamp: '13/10/2026 09:14',
        action: 'Gửi yêu cầu',
        actor: 'Nguyễn Minh An',
        details: 'Đã gửi yêu cầu cấp phát ChatGPT Plus'
      },
      {
        timestamp: '13/10/2026 09:30',
        action: 'Chấp nhận & Xếp đợt',
        actor: 'Trần Văn Hùng (Manager)',
        details: 'Đã phê duyệt và xếp vào Đợt 1 - tháng 10/2026'
      }
    ]
  },
  {
    id: 'REQ-2026-0917-085',
    originalRequestId: 'REQ-2026-0917-085',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-01',
    requesterName: 'Nguyễn Minh An',
    requesterEmail: 'an.nguyen@company.com',
    beneficiaryName: 'Nguyễn Minh An',
    beneficiaryEmail: 'an.nguyen@company.com',
    beneficiaryRole: 'Kỹ sư phần mềm cao cấp (Senior Backend Engineer)',
    softwareName: 'GitHub Copilot',
    planName: 'Business',
    quantity: 1,
    unit: 'Quyền truy cập SSO',
    credentialType: 'directAccess',
    submittedAt: '13/10/2026 09:15',
    purpose: 'Gợi ý code tự động trên IDE VS Code và tự động viết unit tests',
    status: 'ready', // Sẵn sàng cấp
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 4,
      isApiReady: true
    },
    auditTrail: [
      {
        timestamp: '13/10/2026 09:15',
        action: 'Gửi yêu cầu',
        actor: 'Nguyễn Minh An',
        details: 'Đã gửi yêu cầu cấp phát GitHub Copilot Business'
      }
    ]
  },

  // IT-AC-02A: Một đề nghị xin cho 3 người tách thành 3 mục riêng
  {
    id: 'REQ-MULTI-01',
    originalRequestId: 'REQ-2026-MULTI-03',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-01',
    requesterName: 'Trần Văn Hùng (Manager)',
    requesterEmail: 'hung.tran@company.com',
    beneficiaryName: 'Phạm Đức Anh',
    beneficiaryEmail: 'anh.pham@company.com',
    beneficiaryRole: 'Lập trình viên Frontend (Web Team)',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '14/10/2026 10:00',
    purpose: 'Hỗ trợ dịch tài liệu và tối ưu hiệu năng frontend',
    status: 'ready',
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 2,
      isApiReady: true
    },
    auditTrail: [
      {
        timestamp: '14/10/2026 10:00',
        action: 'Tách từ đề nghị nhóm',
        actor: 'Hệ thống IT',
        details: 'Tách mục cấp phát 1/3 từ mã đề nghị gốc REQ-2026-MULTI-03'
      }
    ]
  },
  {
    id: 'REQ-MULTI-02',
    originalRequestId: 'REQ-2026-MULTI-03',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-01',
    requesterName: 'Trần Văn Hùng (Manager)',
    requesterEmail: 'hung.tran@company.com',
    beneficiaryName: 'Vũ Hoàng Long',
    beneficiaryEmail: 'long.vu@company.com',
    beneficiaryRole: 'Kỹ sư DevOps & Cloud',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '14/10/2026 10:00',
    purpose: 'Viết kịch bản tự động hóa hạ tầng Terraform',
    status: 'completed',
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 2,
      isApiReady: true
    },
    provisioningResult: {
      grantedAt: '14/10/2026 14:20',
      operatorName: 'Quang Huy (IT Admin)',
      providerRef: 'OAI-SUB-89410-EXT',
      grantedPlan: 'ChatGPT - Plus',
      accountDetails: {
        username: 'long.vu@company.com',
        initialPassword: 'Cp8$kL2#mP9@vX7!',
        setupLink: 'https://auth.openai.com/org/invite/acc_998124',
        activated: true
      }
    },
    auditTrail: [
      {
        timestamp: '14/10/2026 14:20',
        action: 'Cấp phát thành công',
        actor: 'Quang Huy (IT Admin)',
        details: 'Cấp thành công tài khoản OpenAI Workspace qua API'
      }
    ]
  },
  {
    id: 'REQ-MULTI-03',
    originalRequestId: 'REQ-2026-MULTI-03',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: null, // Chưa xếp đợt
    requesterName: 'Trần Văn Hùng (Manager)',
    requesterEmail: 'hung.tran@company.com',
    beneficiaryName: 'Đặng Thu Hà',
    beneficiaryEmail: 'ha.dang@company.com',
    beneficiaryRole: 'Chuyên viên QA/Automation Test',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '14/10/2026 10:00',
    purpose: 'Sinh test case kiểm thử tự động',
    status: 'ready',
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 2,
      isApiReady: true
    },
    auditTrail: [
      {
        timestamp: '14/10/2026 10:00',
        action: 'Tách từ đề nghị nhóm',
        actor: 'Hệ thống IT',
        details: 'Tách mục cấp phát 3/3 từ mã đề nghị gốc REQ-2026-MULTI-03. Đang ở hàng đợi Chưa xếp đợt'
      }
    ]
  },

  // IT-AC-04 & 04A: Đợt 2 có ca thất bại, timeout kiểm tra lại, và ca cần xử lý bàn giao
  {
    id: 'REQ-ENG-0201',
    originalRequestId: 'REQ-ENG-0201',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-02',
    requesterName: 'Bùi Anh Quân',
    requesterEmail: 'quan.bui@company.com',
    beneficiaryName: 'Bùi Anh Quân',
    beneficiaryEmail: 'quan.bui@company.com',
    beneficiaryRole: 'Kỹ sư AI/ML',
    softwareName: 'Claude',
    planName: 'Pro 5x',
    quantity: 1,
    unit: 'API Key',
    credentialType: 'apiKey',
    submittedAt: '16/10/2026 11:20',
    purpose: 'Tích hợp Claude Sonnet 3.5 vào pipeline phân tích dữ liệu',
    status: 'failed', // Cấp thất bại
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 1,
      isApiReady: true
    },
    provisioningResult: {
      lastError: 'Anthropic API 402: Organization workspace balance insufficient / Rate limit hit',
      providerRef: 'ANTH-ERR-402-9901'
    },
    auditTrail: [
      {
        timestamp: '16/10/2026 11:35',
        action: 'API Cấp phát thất bại',
        actor: 'Hệ thống API Cấp phát',
        details: 'Nhà cung cấp trả về lỗi 402 Payment Required. Chưa tạo key'
      }
    ]
  },
  {
    id: 'REQ-ENG-0202',
    originalRequestId: 'REQ-ENG-0202',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-02',
    requesterName: 'Hoàng Quốc Việt',
    requesterEmail: 'viet.hoang@company.com',
    beneficiaryName: 'Hoàng Quốc Việt',
    beneficiaryEmail: 'viet.hoang@company.com',
    beneficiaryRole: 'Lập trình viên Backend',
    softwareName: 'Claude',
    planName: 'Pro 5x',
    quantity: 1,
    unit: 'API Key',
    credentialType: 'apiKey',
    submittedAt: '16/10/2026 14:05',
    purpose: 'Nghiên cứu mô hình ngôn ngữ lớn nội bộ',
    status: 'needsCheck', // Cần kiểm tra kết quả
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 1,
      isApiReady: true
    },
    provisioningResult: {
      transactionCode: 'TX-ANTH-PENDING-44810',
      lastError: 'HTTP Timeout sau 30s — Chưa nhận phản hồi xác nhận từ cổng đối tác Anthropic'
    },
    auditTrail: [
      {
        timestamp: '16/10/2026 14:06',
        action: 'API Timeout',
        actor: 'Hệ thống IT',
        details: 'Gọi API sinh key nhưng timeout mạng. Đang chờ IT Admin bấm Kiểm tra lại trạng thái'
      }
    ]
  },
  {
    id: 'REQ-ENG-0203',
    originalRequestId: 'REQ-ENG-0203',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: 'batch-eng-02',
    requesterName: 'Ngô Thùy Trang',
    requesterEmail: 'trang.ngo@company.com',
    beneficiaryName: 'Ngô Thùy Trang',
    beneficiaryEmail: 'trang.ngo@company.com',
    beneficiaryRole: 'Data Engineer',
    softwareName: 'JetBrains All Products',
    planName: 'Commercial Key',
    quantity: 1,
    unit: 'API Key',
    credentialType: 'apiKey',
    submittedAt: '17/10/2026 08:45',
    purpose: 'Sử dụng IntelliJ IDEA Ultimate và DataGrip bản quyền công ty',
    status: 'needsHandover', // Cần xử lý bàn giao
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 1,
      isApiReady: true
    },
    provisioningResult: {
      transactionCode: 'JB-ORDER-99412-CONFIRMED',
      recoveryGuide: 'Key đã kích hoạt ở Vendor JetBrains Hub nhưng việc mã hóa lưu Vault nội bộ bị gián đoạn. IT Admin bấm Khôi phục để đọc lại mã key từ JetBrains API và lưu an toàn.',
      apiKeyDetails: {
        keyName: 'JB-COMM-2026-N09',
        maskedKey: 'JB-9921-••••-••••-9871',
        createdAt: '17/10/2026 08:47',
        expiresAt: '17/10/2027',
        scopes: 'All Products Pack, Commercial License'
      }
    },
    auditTrail: [
      {
        timestamp: '17/10/2026 08:47',
        action: 'Lỗi bàn giao Vault',
        actor: 'Hệ thống IT',
        details: 'Vendor xác nhận thành công mã JB-ORDER-99412-CONFIRMED, nhưng hệ thống nội bộ lỗi lưu trữ bàn giao'
      }
    ]
  },

  // IT-AC-05: Gói thiếu quyền đã mua hoặc chưa cấu hình API -> khóa nút cấp
  {
    id: 'REQ-ENG-BLOCKED',
    originalRequestId: 'REQ-ENG-BLOCKED',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    batchId: null, // Chưa xếp đợt
    requesterName: 'Lê Thanh Bình',
    requesterEmail: 'binh.le@company.com',
    beneficiaryName: 'Lê Thanh Bình',
    beneficiaryEmail: 'binh.le@company.com',
    beneficiaryRole: 'Kỹ sư Hệ thống',
    softwareName: 'Cursor AI',
    planName: 'Team',
    quantity: 1,
    unit: 'Quyền truy cập SSO',
    credentialType: 'directAccess',
    submittedAt: '18/10/2026 15:30',
    purpose: 'Sử dụng Cursor AI IDE cho dự án Golang',
    status: 'pendingConfig', // Chờ cấu hình/mua
    feasibility: {
      isConfigured: false,
      purchasedRemaining: 0,
      isApiReady: false,
      blockReason: 'Chưa có quyền sử dụng đã mua và cổng API cấp phát tự động đang ở trạng thái Nháp (chưa sẵn sàng)'
    },
    auditTrail: [
      {
        timestamp: '18/10/2026 15:30',
        action: 'Chờ cấu hình/mua',
        actor: 'Hệ thống IT',
        details: 'Yêu cầu được chuyển vào hàng đợi chờ IT Admin nhập chứng từ mua (IT-06) và kích hoạt API trong danh mục (IT-11)'
      }
    ]
  },

  // Phòng Thiết kế & Marketing
  {
    id: 'REQ-DES-0101',
    originalRequestId: 'REQ-DES-0101',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    batchId: 'batch-des-01',
    requesterName: 'Huyền Lê',
    requesterEmail: 'huyen.le@company.com',
    beneficiaryName: 'Huyền Lê',
    beneficiaryEmail: 'huyen.le@company.com',
    beneficiaryRole: 'Trưởng nhóm UI/UX Designer',
    softwareName: 'Figma',
    planName: 'Organization',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '06/10/2026 09:00',
    purpose: 'Quản trị hệ thống Design System và phân quyền bản vẽ thiết kế sản phẩm',
    status: 'completed',
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 3,
      isApiReady: true
    },
    provisioningResult: {
      grantedAt: '06/10/2026 11:15',
      operatorName: 'Quang Huy (IT Admin)',
      providerRef: 'FIGMA-SEAT-ORG-4421',
      grantedPlan: 'Figma Organization',
      accountDetails: {
        username: 'huyen.le@company.com',
        initialPassword: 'Fg#2026!DesignerP@ss',
        setupLink: 'https://figma.com/organization/invite/tk_44129',
        activated: true
      }
    },
    auditTrail: [
      {
        timestamp: '06/10/2026 11:15',
        action: 'Cấp phát hoàn thành',
        actor: 'Quang Huy (IT Admin)',
        details: 'Đã cấp seat Figma Organization và gửi thông báo bàn giao'
      }
    ]
  },
  {
    id: 'REQ-DES-0102',
    originalRequestId: 'REQ-DES-0102',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    batchId: 'batch-des-01',
    requesterName: 'Trịnh Thảo Vy',
    requesterEmail: 'vy.trinh@company.com',
    beneficiaryName: 'Trịnh Thảo Vy',
    beneficiaryEmail: 'vy.trinh@company.com',
    beneficiaryRole: 'Content & Copywriter',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    quantity: 1,
    unit: 'Tài khoản',
    credentialType: 'account',
    submittedAt: '08/10/2026 14:00',
    purpose: 'Sáng tạo nội dung bài viết truyền thông và chiến dịch mạng xã hội',
    status: 'ready',
    feasibility: {
      isConfigured: true,
      purchasedRemaining: 2,
      isApiReady: true
    },
    auditTrail: [
      {
        timestamp: '08/10/2026 14:00',
        action: 'Gửi yêu cầu',
        actor: 'Trịnh Thảo Vy',
        details: 'Chờ IT Admin cấp phát trong Đợt 1'
      }
    ]
  }
]

// ----------------------------------------------------------------------------
// RECONCILIATION DATA (IT-05) & IT-AC-07, 07A, 08
// ----------------------------------------------------------------------------

export const initialItReconciliationRows: ItReconciliationRow[] = [
  // IT-AC-08: Nhu cầu 10, đã mua 8, đã cấp 6 -> Mua thiếu 2, còn cấp được 2
  {
    id: 'REC-01',
    period: '10/2026',
    departmentId: 'all',
    departmentName: 'Toàn công ty',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    unit: 'Tài khoản',
    validDemand: 10, // 10 yêu cầu hợp lệ
    purchasedValid: 8, // Chứng từ xác nhận 8 quyền
    grantedValid: 6, // Đã cấp 6 quyền
    availableRemaining: 2, // max(0, 8 - 6) = 2
    missing: 2, // max(0, 10 - 8) = 2
    surplus: 0,
    status: 'deficit', // Mua thiếu
    constituentRequests: ['REQ-2026-0917-084', 'REQ-MULTI-01', 'REQ-MULTI-02', 'REQ-MULTI-03', 'REQ-DES-0102'],
    constituentPurchases: [
      // IT-AC-07: Hợp đồng và Hóa đơn của cùng giao dịch mua 8 quyền được liên kết và tính 1 lần!
      {
        docId: 'DOC-CT-2026-041',
        docType: 'contract',
        docNumber: 'HD-OPENAI-2026-01',
        date: '01/10/2026',
        qty: 8,
        vendor: 'OpenAI, LLC'
      },
      {
        docId: 'DOC-INV-2026-089',
        docType: 'invoice',
        docNumber: 'INV-OAI-1026-894',
        date: '02/10/2026',
        qty: 8,
        vendor: 'OpenAI, LLC'
      }
    ]
  },

  // IT-AC-07A: Ca hợp đồng và hóa đơn ghi khác số lượng -> Cần xác minh
  {
    id: 'REC-02',
    period: '10/2026',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    softwareName: 'GitHub Copilot',
    planName: 'Business',
    unit: 'Seat',
    validDemand: 8,
    purchasedValid: 10,
    grantedValid: 6,
    availableRemaining: 4,
    missing: 0,
    surplus: 2,
    status: 'needsVerification', // Cần xác minh
    constituentRequests: ['REQ-2026-0917-085'],
    constituentPurchases: [
      {
        docId: 'DOC-CT-2026-050',
        docType: 'contract',
        docNumber: 'HD-MSFT-GH-2026',
        date: '15/09/2026',
        qty: 12,
        vendor: 'GitHub / Microsoft'
      },
      {
        docId: 'DOC-INV-2026-102',
        docType: 'invoice',
        docNumber: 'INV-MS-2026-441',
        date: '01/10/2026',
        qty: 10,
        vendor: 'GitHub / Microsoft'
      }
    ],
    conflictData: {
      contractQty: 12,
      contractDoc: 'HD-MSFT-GH-2026 (Hợp đồng ghi 12 seat theo thỏa thuận khung)',
      invoiceQty: 10,
      invoiceDoc: 'INV-MS-2026-441 (Hóa đơn kỳ này vendor chỉ tính tiền 10 seat)'
    }
  },

  // Dòng Figma Organization: Khớp hoàn toàn
  {
    id: 'REC-03',
    period: '10/2026',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    softwareName: 'Figma',
    planName: 'Organization',
    unit: 'Seat',
    validDemand: 12,
    purchasedValid: 15,
    grantedValid: 12,
    availableRemaining: 3,
    missing: 0,
    surplus: 3,
    status: 'surplus', // Mua dư 3 seat
    constituentRequests: ['REQ-DES-0101'],
    constituentPurchases: [
      {
        docId: 'DOC-INV-FIGMA-01',
        docType: 'invoice',
        docNumber: 'INV-FIGMA-2026-99',
        date: '01/06/2026',
        qty: 15,
        vendor: 'Figma Inc.'
      }
    ]
  },

  // Dòng chưa đủ dữ liệu mua: Cursor AI Team (chưa nhập chứng từ)
  {
    id: 'REC-04',
    period: '10/2026',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    softwareName: 'Cursor AI',
    planName: 'Team',
    unit: 'Seat',
    validDemand: 3,
    purchasedValid: 0,
    grantedValid: 0,
    availableRemaining: 0,
    missing: 3,
    surplus: 0,
    status: 'insufficientData', // Chưa đủ dữ liệu mua
    constituentRequests: ['REQ-ENG-BLOCKED'],
    constituentPurchases: []
  }
]

// ----------------------------------------------------------------------------
// PURCHASE DOCUMENTS & IMPORT (IT-06)
// ----------------------------------------------------------------------------

export const initialItPurchaseDocs: ItPurchaseDoc[] = [
  {
    id: 'DOC-INV-2026-089',
    docNumber: 'INV-OAI-1026-894',
    type: 'invoice',
    vendor: 'OpenAI, LLC',
    issueDate: '02/10/2026',
    validPeriod: '01/10/2026 – 31/10/2026',
    currency: 'USD',
    software: 'ChatGPT',
    plan: 'Plus',
    qty: 8,
    unitPrice: 20,
    totalAmount: 160,
    status: 'verified',
    departmentScope: 'Toàn công ty (Cấp công ty)',
    mappedCatalogId: 'CAT-01',
    linkedDocId: 'DOC-CT-2026-041',
    scanPreviewText: 'INVOICE: INV-OAI-1026-894 | Vendor: OpenAI, LLC | Date: 02 Oct 2026 | Item: ChatGPT Plus Subscription x 8 seats @ $20.00/seat | Total: $160.00 USD | Ref: HD-OPENAI-2026-01'
  },
  {
    id: 'DOC-CT-2026-041',
    docNumber: 'HD-OPENAI-2026-01',
    type: 'contract',
    vendor: 'OpenAI, LLC',
    issueDate: '01/10/2026',
    validPeriod: '01/10/2026 – 31/12/2026',
    currency: 'USD',
    software: 'ChatGPT',
    plan: 'Plus',
    qty: 8,
    unitPrice: 20,
    totalAmount: 480,
    status: 'verified',
    departmentScope: 'Toàn công ty (Cấp công ty)',
    mappedCatalogId: 'CAT-01',
    linkedDocId: 'DOC-INV-2026-089',
    scanPreviewText: 'MASTER SERVICES AGREEMENT: HD-OPENAI-2026-01 | Parties: Company & OpenAI | Scope: 8 ChatGPT Plus Seats | Effective: 01 Oct 2026 - 31 Dec 2026'
  },
  {
    id: 'DOC-INV-2026-102',
    docNumber: 'INV-MS-2026-441',
    type: 'invoice',
    vendor: 'GitHub / Microsoft',
    issueDate: '01/10/2026',
    validPeriod: '01/10/2026 – 31/10/2026',
    currency: 'USD',
    software: 'GitHub Copilot',
    plan: 'Business',
    qty: 10,
    unitPrice: 19,
    totalAmount: 190,
    status: 'needsCheck',
    departmentScope: 'Kỹ thuật phần mềm',
    mappedCatalogId: 'CAT-02',
    scanPreviewText: 'INVOICE: INV-MS-2026-441 | Billed: 10 active GitHub Copilot seats @ $19/mo | Total: $190.00'
  }
]

// ----------------------------------------------------------------------------
// USAGE ANALYTICS & DEVICE COLLECTORS (IT-07 & IT-08)
// ----------------------------------------------------------------------------

export const initialItDeptUsageSummaries: ItDeptUsageSummary[] = [
  {
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    peopleWithData: 18,
    devicesActive: 17,
    lastSync: '10 phút trước',
    totalDurationHours: 428,
    totalSessions: 1840,
    totalTokens: '4.8M',
    missingDataCount: 2, // 2 nhân sự thiếu dữ liệu / tool mất kết nối
    collectorStatus: 'healthy'
  },
  {
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    peopleWithData: 12,
    devicesActive: 10,
    lastSync: '15 phút trước',
    totalDurationHours: 310,
    totalSessions: 890,
    totalTokens: '1.2M',
    missingDataCount: 1,
    collectorStatus: 'healthy'
  },
  {
    departmentId: 'dept-finance',
    departmentName: 'Tài chính Kế toán',
    peopleWithData: 0,
    devicesActive: 0,
    lastSync: 'Chưa có dữ liệu',
    totalDurationHours: 0,
    totalSessions: 0,
    totalTokens: '0',
    missingDataCount: 0,
    collectorStatus: 'offline',
    offlineSince: '18/10/2026'
  }
]

export const initialItEmployeeUsageRecords: ItEmployeeUsageRecord[] = [
  // Lê Minh Tuấn (Trường hợp ít sử dụng điển hình được liên kết từ màn Tối ưu)
  {
    id: 'emp-tuan',
    name: 'Lê Minh Tuấn',
    email: 'tuan.le@company.com',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    software: 'ChatGPT',
    activeDays: 2,
    frequency: '0.1 phiên/ngày (Thụt lùi)',
    durationMinutes: 4,
    lastUsed: '28 ngày trước (02/09/2026)',
    inputTokens: 90,
    outputTokens: 30,
    isEstimatedTokens: false,
    tokenSource: 'OpenAI Workspace API Sync',
    tokenAnalytics: {
      isAgent: true,
      growthRate: -46.5,
      growthStatus: 'decreasing',
      periodSummaries: {
        day: { current: 120, previous: 250, percent: -52.0 },
        week: { current: 850, previous: 2400, percent: -64.6 },
        month: { current: 3200, previous: 8900, percent: -64.0 }
      },
      dayData: [
        { label: 'T2', inputTokens: 40, outputTokens: 10, totalTokens: 50 },
        { label: 'T3', inputTokens: 30, outputTokens: 15, totalTokens: 45 },
        { label: 'T4', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T5', inputTokens: 20, outputTokens: 5, totalTokens: 25 },
        { label: 'T6', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T7', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'CN', inputTokens: 0, outputTokens: 0, totalTokens: 0 }
      ],
      weekData: [
        { label: 'Tuần 1', inputTokens: 950, outputTokens: 450, totalTokens: 1400 },
        { label: 'Tuần 2', inputTokens: 600, outputTokens: 350, totalTokens: 950 },
        { label: 'Tuần 3', inputTokens: 400, outputTokens: 200, totalTokens: 600 },
        { label: 'Tuần 4', inputTokens: 180, outputTokens: 70, totalTokens: 250 }
      ],
      monthData: [
        { label: 'Tháng 8', inputTokens: 18500, outputTokens: 9200, totalTokens: 27700 },
        { label: 'Tháng 9', inputTokens: 6200, outputTokens: 2700, totalTokens: 8900 },
        { label: 'Tháng 10', inputTokens: 2200, outputTokens: 1000, totalTokens: 3200 }
      ]
    },
    sessions: [
      {
        id: 'SES-TUAN-01',
        app: 'ChatGPT Plus Web',
        startTime: '02/09/2026 14:10',
        endTime: '02/09/2026 14:14',
        duration: '4 phút',
        device: 'MacBook Pro 14" M2',
        source: 'OpenAI API Sync'
      }
    ],
    promptHistory: [
      {
        id: 'PRM-TUAN-01',
        time: '02/09/2026 14:12',
        tool: 'GPT-4o',
        promptPreview: 'Kiểm tra cú pháp regex cho email domain...',
        fullPrompt: 'Kiểm tra cú pháp regex cho email domain nội bộ công ty',
        response: 'Bạn có thể sử dụng mẫu regex sau: ^[a-zA-Z0-9._%+-]+@company\\.com$',
        masked: false
      }
    ]
  },

  // Đặng Hoàng Nam (Không dùng JetBrains lâu ngày)
  {
    id: 'emp-nam',
    name: 'Đặng Hoàng Nam',
    email: 'nam.dang@company.com',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    software: 'JetBrains All Products',
    activeDays: 0,
    frequency: '0 phiên/tháng (Ngừng dùng)',
    durationMinutes: 0,
    lastUsed: '62 ngày trước',
    inputTokens: 0,
    outputTokens: 0,
    isEstimatedTokens: false,
    tokenSource: 'JetBrains Hub License Manager',
    tokenAnalytics: {
      isAgent: false,
      growthRate: -100.0,
      growthStatus: 'decreasing',
      periodSummaries: {
        day: { current: 0, previous: 0, percent: 0 },
        week: { current: 0, previous: 0, percent: 0 },
        month: { current: 0, previous: 14000, percent: -100.0 }
      },
      dayData: [
        { label: 'T2', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T3', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T4', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T5', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T6', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'T7', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'CN', inputTokens: 0, outputTokens: 0, totalTokens: 0 }
      ],
      weekData: [
        { label: 'Tuần 1', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'Tuần 2', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'Tuần 3', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'Tuần 4', inputTokens: 0, outputTokens: 0, totalTokens: 0 }
      ],
      monthData: [
        { label: 'Tháng 8', inputTokens: 12000, outputTokens: 2000, totalTokens: 14000 },
        { label: 'Tháng 9', inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        { label: 'Tháng 10', inputTokens: 0, outputTokens: 0, totalTokens: 0 }
      ]
    },
    sessions: [],
    promptHistory: null
  },

  // Vũ Thị Lan (Nhân sự thiết kế nghỉ việc)
  {
    id: 'emp-lan',
    name: 'Vũ Thị Lan',
    email: 'lan.vu@company.com',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    software: 'Figma',
    activeDays: 0,
    frequency: '0 phiên (Đã thôi việc)',
    durationMinutes: 0,
    lastUsed: '04/10/2026',
    inputTokens: 0,
    outputTokens: 0,
    isEstimatedTokens: false,
    tokenSource: 'Figma Admin Audit Log',
    sessions: [],
    promptHistory: null
  },

  // Bùi Anh Quân (Claude Sonnet AI)
  {
    id: 'emp-quan',
    name: 'Bùi Anh Quân',
    email: 'quan.bui@company.com',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    software: 'Claude',
    activeDays: 4,
    frequency: '1.2 phiên/ngày',
    durationMinutes: 145,
    lastUsed: '18/10/2026 14:20',
    inputTokens: 12500,
    outputTokens: 4800,
    isEstimatedTokens: false,
    tokenSource: 'Claude Enterprise API Connector',
    tokenAnalytics: {
      isAgent: true,
      growthRate: -32.4,
      growthStatus: 'decreasing',
      periodSummaries: {
        day: { current: 1200, previous: 2100, percent: -42.8 },
        week: { current: 17300, previous: 25600, percent: -32.4 },
        month: { current: 48500, previous: 62000, percent: -21.8 }
      },
      dayData: [
        { label: 'T2', inputTokens: 2500, outputTokens: 900, totalTokens: 3400 },
        { label: 'T3', inputTokens: 3200, outputTokens: 1100, totalTokens: 4300 },
        { label: 'T4', inputTokens: 1800, outputTokens: 600, totalTokens: 2400 },
        { label: 'T5', inputTokens: 2800, outputTokens: 1200, totalTokens: 4000 },
        { label: 'T6', inputTokens: 1400, outputTokens: 600, totalTokens: 2000 },
        { label: 'T7', inputTokens: 500, outputTokens: 200, totalTokens: 700 },
        { label: 'CN', inputTokens: 300, outputTokens: 200, totalTokens: 500 }
      ],
      weekData: [
        { label: 'Tuần 1', inputTokens: 24000, outputTokens: 9200, totalTokens: 33200 },
        { label: 'Tuần 2', inputTokens: 19000, outputTokens: 7800, totalTokens: 26800 },
        { label: 'Tuần 3', inputTokens: 18500, outputTokens: 7100, totalTokens: 25600 },
        { label: 'Tuần 4', inputTokens: 12500, outputTokens: 4800, totalTokens: 17300 }
      ],
      monthData: [
        { label: 'Tháng 8', inputTokens: 58000, outputTokens: 24000, totalTokens: 82000 },
        { label: 'Tháng 9', inputTokens: 44000, outputTokens: 18000, totalTokens: 62000 },
        { label: 'Tháng 10', inputTokens: 35000, outputTokens: 13500, totalTokens: 48500 }
      ]
    },
    sessions: [
      {
        id: 'SES-01',
        app: 'Claude (Claude Code CLI & Web)',
        startTime: '18/10/2026 13:40',
        endTime: '18/10/2026 14:20',
        duration: '40 phút',
        device: 'MacBook Pro M2 - Hostname: MB-ENG-04',
        source: 'Endpoint Agent v2.4.1'
      }
    ],
    promptHistory: [
      {
        id: 'PRM-01',
        time: '18/10/2026 14:02',
        tool: 'Claude Sonnet 3.5',
        promptPreview: 'Viết thuật toán gom cụm embeddings bằng FAISS...',
        fullPrompt: 'Viết thuật toán gom cụm embeddings bằng FAISS cho 500k vectors chiều không gian 1536 với chỉ số IndexFlatL2',
        response: 'Dưới đây là mã nguồn Python sử dụng faiss-gpu để tối ưu thời gian gom cụm...',
        masked: false
      }
    ]
  },

  // Trần Đình Trọng (GitHub Copilot AI)
  {
    id: 'emp-trong',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@company.com',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    software: 'GitHub Copilot',
    activeDays: 14,
    frequency: '4.8 phiên/ngày',
    durationMinutes: 840,
    lastUsed: 'Hôm nay lúc 09:12',
    inputTokens: 32000,
    outputTokens: 10500,
    isEstimatedTokens: true,
    tokenSource: 'GitHub Org Telemetry API',
    tokenAnalytics: {
      isAgent: true,
      growthRate: 18.5,
      growthStatus: 'increasing',
      periodSummaries: {
        day: { current: 5200, previous: 4400, percent: 18.2 },
        week: { current: 42500, previous: 35800, percent: 18.7 },
        month: { current: 142000, previous: 120000, percent: 18.3 }
      },
      dayData: [
        { label: 'T2', inputTokens: 4800, outputTokens: 1600, totalTokens: 6400 },
        { label: 'T3', inputTokens: 5200, outputTokens: 1800, totalTokens: 7000 },
        { label: 'T4', inputTokens: 6100, outputTokens: 2100, totalTokens: 8200 },
        { label: 'T5', inputTokens: 5800, outputTokens: 1900, totalTokens: 7700 },
        { label: 'T6', inputTokens: 6400, outputTokens: 2200, totalTokens: 8600 },
        { label: 'T7', inputTokens: 2100, outputTokens: 600, totalTokens: 2700 },
        { label: 'CN', inputTokens: 1600, outputTokens: 300, totalTokens: 1900 }
      ],
      weekData: [
        { label: 'Tuần 1', inputTokens: 21000, outputTokens: 7000, totalTokens: 28000 },
        { label: 'Tuần 2', inputTokens: 24000, outputTokens: 8200, totalTokens: 32200 },
        { label: 'Tuần 3', inputTokens: 27000, outputTokens: 8800, totalTokens: 35800 },
        { label: 'Tuần 4', inputTokens: 32000, outputTokens: 10500, totalTokens: 42500 }
      ],
      monthData: [
        { label: 'Tháng 8', inputTokens: 68000, outputTokens: 24000, totalTokens: 92000 },
        { label: 'Tháng 9', inputTokens: 90000, outputTokens: 30000, totalTokens: 120000 },
        { label: 'Tháng 10', inputTokens: 106000, outputTokens: 36000, totalTokens: 142000 }
      ]
    },
    sessions: [
      {
        id: 'SES-TRONG-01',
        app: 'GitHub Copilot (VS Code)',
        startTime: '23/10/2026 08:30',
        endTime: '23/10/2026 09:12',
        duration: '42 phút',
        device: 'Dell Precision 5570 - Win 11',
        source: 'Telemetry API'
      }
    ],
    promptHistory: null
  },

  // Nguyễn Minh An (ChatGPT Enterprise)
  {
    id: 'emp-an',
    name: 'Nguyễn Minh An',
    email: 'an.nguyen@company.com',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    software: 'ChatGPT',
    activeDays: 18,
    frequency: '5.2 phiên/ngày',
    durationMinutes: 1240,
    lastUsed: 'Hôm nay lúc 10:05',
    inputTokens: 98000,
    outputTokens: 42000,
    isEstimatedTokens: false,
    tokenSource: 'OpenAI Workspace Compliance Log',
    tokenAnalytics: {
      isAgent: true,
      growthRate: 24.8,
      growthStatus: 'increasing',
      periodSummaries: {
        day: { current: 16500, previous: 13200, percent: 25.0 },
        week: { current: 140000, previous: 112000, percent: 25.0 },
        month: { current: 480000, previous: 385000, percent: 24.7 }
      },
      dayData: [
        { label: 'T2', inputTokens: 14000, outputTokens: 6000, totalTokens: 20000 },
        { label: 'T3', inputTokens: 16000, outputTokens: 7000, totalTokens: 23000 },
        { label: 'T4', inputTokens: 15500, outputTokens: 6500, totalTokens: 22000 },
        { label: 'T5', inputTokens: 17000, outputTokens: 7500, totalTokens: 24500 },
        { label: 'T6', inputTokens: 18000, outputTokens: 8000, totalTokens: 26000 },
        { label: 'T7', inputTokens: 10000, outputTokens: 4000, totalTokens: 14000 },
        { label: 'CN', inputTokens: 7500, outputTokens: 3000, totalTokens: 10500 }
      ],
      weekData: [
        { label: 'Tuần 1', inputTokens: 65000, outputTokens: 28000, totalTokens: 93000 },
        { label: 'Tuần 2', inputTokens: 72000, outputTokens: 31000, totalTokens: 103000 },
        { label: 'Tuần 3', inputTokens: 78000, outputTokens: 34000, totalTokens: 112000 },
        { label: 'Tuần 4', inputTokens: 98000, outputTokens: 42000, totalTokens: 140000 }
      ],
      monthData: [
        { label: 'Tháng 8', inputTokens: 210000, outputTokens: 90000, totalTokens: 300000 },
        { label: 'Tháng 9', inputTokens: 270000, outputTokens: 115000, totalTokens: 385000 },
        { label: 'Tháng 10', inputTokens: 336000, outputTokens: 144000, totalTokens: 480000 }
      ]
    },
    sessions: [
      {
        id: 'SES-AN-01',
        app: 'ChatGPT Enterprise Web',
        startTime: '23/10/2026 09:15',
        endTime: '23/10/2026 10:05',
        duration: '50 phút',
        device: 'MacBook Pro M3 Max',
        source: 'OpenAI API Sync'
      }
    ],
    promptHistory: [
      {
        id: 'PRM-AN-01',
        time: '23/10/2026 09:20',
        tool: 'GPT-4o',
        promptPreview: 'Review kiến trúc microservices và chỉ ra điểm nghẽn Redis...',
        fullPrompt: 'Review tài liệu kiến trúc kỹ thuật đính kèm. Phân tích xem cụm Redis Sentinel có nguy cơ split-brain khi độ trễ mạng vượt 200ms không?',
        response: 'Dựa trên cấu hình quorum 2 trong 3 nodes Sentinel, phân tích cho thấy kịch bản phân mảnh mạng sẽ được bảo vệ...',
        masked: false
      }
    ]
  }
]

// ----------------------------------------------------------------------------
// COST OPTIMIZATION ALERTS (Tối ưu bản quyền)
// ----------------------------------------------------------------------------

export const initialItOptimizationAlerts: ItOptimizationAlertItem[] = [
  // Cảnh báo ít dùng dẫn tới thu hồi (Tái sử dụng được seat)
  {
    id: 'ALT-OPT-01',
    employeeId: 'emp-tuan',
    type: 'lowUsage',
    severity: 'high',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    employeeName: 'Lê Minh Tuấn',
    employeeEmail: 'tuan.le@company.com',
    softwareName: 'ChatGPT',
    planName: 'Plus',
    reclaimImpact: {
      canReuse: true,
      reclaimRefundText: 'Quyền sử dụng thuộc dạng Seat/Tài khoản có thể tái cấp. Sau khi thu hồi, hệ thống cộng +1 vào Còn có thể cấp của ChatGPT Plus.'
    },
    evidence: {
      threshold: 'Ít hơn 3 phiên thao tác thực tế trong 30 ngày (Ngưỡng hệ thống)',
      observationPeriod: '01/09/2026 – 30/09/2026 (30 ngày)',
      lastUsed: '28 ngày trước (02/09/2026)',
      usageStats: 'Chỉ mở 1 phiên, thời lượng thao tác 4 phút',
      tokens: '120 tokens ghi nhận (Thụt lùi 46.5%)',
      costPerMonth: 540000,
      daysWaiting: 28,
      dataSource: 'OpenAI Audit Log qua Tool Endpoint'
    },
    status: 'pending'
  },

  // Thu hồi mã key KHÔNG thể tái sử dụng (hết hạn/không hoàn pool)
  {
    id: 'ALT-OPT-02',
    employeeId: 'emp-nam',
    type: 'idleLong',
    severity: 'high',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    employeeName: 'Đặng Hoàng Nam',
    employeeEmail: 'nam.dang@company.com',
    softwareName: 'JetBrains All Products',
    planName: 'Commercial Key (Single Dev Non-reusable)',
    reclaimImpact: {
      canReuse: false,
      reclaimRefundText: 'Mã key kích hoạt dạng một lần (Single Dev). Sau khi thu hồi, trạng thái thành Đã thu hồi nhưng KHÔNG cộng tăng số Còn có thể cấp trong kho.'
    },
    evidence: {
      threshold: 'Không có hoạt động kích hoạt hoặc thao tác IDE trên 60 ngày',
      observationPeriod: '15/08/2026 – 20/10/2026 (65 ngày)',
      lastUsed: '62 ngày trước',
      usageStats: '0 phiên thao tác trong 60 ngày gần nhất',
      tokens: '0 tokens (Thụt lùi 100%)',
      costPerMonth: 1250000,
      daysWaiting: 62,
      dataSource: 'JetBrains Hub License Manager'
    },
    status: 'pending'
  },

  // Cảnh báo chờ xử lý thu hồi lâu (Nhân sự nghỉ việc)
  {
    id: 'ALT-OPT-03',
    employeeId: 'emp-lan',
    type: 'delayedReclaim',
    severity: 'medium',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    employeeName: 'Vũ Thị Lan',
    employeeEmail: 'lan.vu@company.com',
    softwareName: 'Figma',
    planName: 'Organization',
    reclaimImpact: {
      canReuse: true,
      reclaimRefundText: 'Tài khoản Editor được thu hồi về kho công ty và có thể phân bổ ngay cho nhân sự mới.'
    },
    evidence: {
      threshold: 'Nhân sự đã nghỉ việc quá 7 ngày nhưng chưa thu hồi tài khoản',
      observationPeriod: 'Từ ngày nghỉ việc 05/10/2026 đến nay',
      lastUsed: '04/10/2026',
      usageStats: 'Đã vô hiệu hóa email công ty, seat Figma vẫn đang trả phí định kỳ',
      tokens: 'N/A',
      costPerMonth: 1080000,
      daysWaiting: 18,
      dataSource: 'Hồ sơ nhân sự nghỉ việc Super Admin'
    },
    status: 'pending'
  },

  // Cảnh báo ít dùng từ Claude AI
  {
    id: 'ALT-OPT-04',
    employeeId: 'emp-quan',
    type: 'lowUsage',
    severity: 'low',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    employeeName: 'Bùi Anh Quân',
    employeeEmail: 'quan.bui@company.com',
    softwareName: 'Claude',
    planName: 'Pro 5x',
    reclaimImpact: {
      canReuse: true,
      reclaimRefundText: 'Có thể tái cấp slot cho nhân sự dự án khác.'
    },
    evidence: {
      threshold: 'Lượng token suy giảm liên tục qua 3 tuần gần nhất',
      observationPeriod: '01/10/2026 – 23/10/2026',
      lastUsed: '18/10/2026',
      usageStats: 'Tần suất dùng giảm từ 4.5 phiên xuống 1.2 phiên/ngày',
      tokens: '17,300 tokens (Thụt lùi 32.4%)',
      costPerMonth: 750000,
      daysWaiting: 5,
      dataSource: 'Claude Enterprise API Connector'
    },
    status: 'pending'
  }
]

// ----------------------------------------------------------------------------
// EXTERNAL SOFTWARE REQUESTS (IT-10) & IT-AC-12, 13
// ----------------------------------------------------------------------------

export const initialItExternalRequests: ItExternalRequestItem[] = [
  // IT-AC-12: Chấp nhận yêu cầu bên ngoài chưa mua gói -> chuyển "Chờ cấu hình/mua"
  {
    id: 'EXT-REQ-101',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    requesterName: 'Nguyễn Văn Hoàng',
    requesterEmail: 'hoang.nguyen@company.com',
    softwareName: 'Cursor AI',
    planName: 'Team',
    productUrl: 'https://cursor.com/pricing',
    submittedAt: '19/10/2026 09:30',
    purpose: 'Trang bị AI code editor dựa trên VS Code để tăng tốc độ phát triển dự án Golang & React',
    beneficiaries: [
      { name: 'Nguyễn Văn Hoàng', email: 'hoang.nguyen@company.com', role: 'Team Lead Backend' },
      { name: 'Đỗ Tuấn Kiệt', email: 'kiet.do@company.com', role: 'Fullstack Dev' },
      { name: 'Phan Minh Đức', email: 'duc.phan@company.com', role: 'Frontend Dev' }
    ],
    estimatedCost: '$20 / người / tháng',
    duration: '12 tháng (Thuê bao năm)',
    status: 'pendingDecision'
  },

  // IT-AC-13: Từ chối yêu cầu phần mềm bên ngoài (bắt buộc nhập lý do)
  {
    id: 'EXT-REQ-102',
    departmentId: 'dept-design',
    departmentName: 'Thiết kế & Marketing',
    requesterName: 'Hoàng Yến Nhi',
    requesterEmail: 'nhi.hoang@company.com',
    softwareName: 'Midjourney',
    planName: 'Pro v6',
    productUrl: 'https://midjourney.com',
    submittedAt: '20/10/2026 14:15',
    purpose: 'Tạo hình ảnh minh họa concept cho chiến dịch truyền thông thương hiệu',
    beneficiaries: [{ name: 'Hoàng Yến Nhi', email: 'nhi.hoang@company.com', role: 'Creative Designer' }],
    estimatedCost: '$60 / tháng',
    duration: '3 tháng thử nghiệm',
    status: 'pendingDecision'
  },

  // Yêu cầu đã chấp nhận và đang ở trạng thái Chờ cấu hình/mua
  {
    id: 'EXT-REQ-103',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    requesterName: 'Đỗ Nam Trung',
    requesterEmail: 'trung.do@company.com',
    softwareName: 'Perplexity Enterprise',
    planName: 'Enterprise Pro',
    productUrl: 'https://perplexity.ai/enterprise',
    submittedAt: '15/10/2026 10:20',
    purpose: 'Tìm kiếm nghiên cứu kỹ thuật và tổng hợp tài liệu chuyên sâu',
    beneficiaries: [{ name: 'Đỗ Nam Trung', email: 'trung.do@company.com', role: 'Kỹ sư Trưởng (Staff Engineer)' }],
    estimatedCost: '$40 / tháng',
    duration: '12 tháng',
    status: 'pendingConfig',
    decisionBy: 'Quang Huy (IT Admin)',
    decisionAt: '16/10/2026 09:00',
    decisionNotes: 'Đã chấp nhận chủ trương. Cần bổ sung gói vào danh mục phòng (IT-11) và nhập hợp đồng mua (IT-06) trước khi cấp.'
  },

  // Yêu cầu đã từ chối
  {
    id: 'EXT-REQ-104',
    departmentId: 'dept-eng',
    departmentName: 'Kỹ thuật phần mềm',
    requesterName: 'Lưu Quang Khải',
    requesterEmail: 'khai.luu@company.com',
    softwareName: 'Phind AI',
    planName: 'Pro',
    productUrl: 'https://phind.com',
    submittedAt: '12/10/2026 16:00',
    purpose: 'Tra cứu câu lệnh terminal và phân tích log hệ thống',
    beneficiaries: [{ name: 'Lưu Quang Khải', email: 'khai.luu@company.com', role: 'Kỹ sư Vận hành' }],
    estimatedCost: '$20 / tháng',
    duration: '6 tháng',
    status: 'rejected',
    rejectReason: 'Không đạt tiêu chuẩn kiểm duyệt an ninh thông tin: Chính sách của Phind chưa có điều khoản cam kết không lưu trữ dữ liệu code doanh nghiệp.',
    decisionBy: 'Quang Huy (IT Admin)',
    decisionAt: '13/10/2026 11:00'
  }
]

// ----------------------------------------------------------------------------
// CATALOG BY DEPARTMENT (IT-11) & IT-AC-14, 15
// ----------------------------------------------------------------------------

export const initialItCatalogItems: ItCatalogItem[] = [
  {
    id: 'CAT-01',
    softwareName: 'ChatGPT',
    vendor: 'OpenAI, LLC',
    planName: 'Plus',
    provisioningType: 'Tài khoản',
    status: 'allowed', // Cho phép xin
    departments: ['Kỹ thuật phần mềm', 'Thiết kế & Marketing'],
    openRequests: 3,
    purchasedCount: 8,
    availableCount: 2,
    apiReady: true,
    description: 'Tài khoản ChatGPT Plus doanh nghiệp hỗ trợ GPT-4o, Canvas và duyệt web an toàn',
    hasHistory: true
  },
  {
    id: 'CAT-02',
    softwareName: 'GitHub Copilot',
    vendor: 'GitHub / Microsoft',
    planName: 'Business',
    provisioningType: 'Quyền truy cập SSO',
    status: 'allowed',
    departments: ['Kỹ thuật phần mềm'],
    openRequests: 1,
    purchasedCount: 10,
    availableCount: 4,
    apiReady: true,
    description: 'Trợ lý lập trình AI trên IDE với chính sách bảo mật mã nguồn nội bộ',
    hasHistory: true
  },
  {
    id: 'CAT-03',
    softwareName: 'Claude',
    vendor: 'Anthropic PBC',
    planName: 'Pro 5x',
    provisioningType: 'API key',
    status: 'allowed',
    departments: ['Kỹ thuật phần mềm'],
    openRequests: 2,
    purchasedCount: 5,
    availableCount: 1,
    apiReady: true,
    description: 'Mô hình Sonnet 3.5 & Opus qua API Key định danh phục vụ lập trình và phân tích',
    hasHistory: true
  },
  {
    id: 'CAT-04',
    softwareName: 'Figma',
    vendor: 'Figma Inc.',
    planName: 'Organization',
    provisioningType: 'Tài khoản',
    status: 'allowed',
    departments: ['Thiết kế & Marketing'],
    openRequests: 0,
    purchasedCount: 15,
    availableCount: 3,
    apiReady: true,
    description: 'Nền tảng thiết kế UI/UX cộng tác thời gian thực cho đội ngũ thiết kế',
    hasHistory: true
  },

  // IT-AC-14: Ngừng cho xin một gói đã có lịch sử
  {
    id: 'CAT-05',
    softwareName: 'JetBrains All Products',
    vendor: 'JetBrains s.r.o.',
    planName: 'Commercial Key',
    provisioningType: 'API key',
    status: 'stopped', // Ngừng cho xin
    departments: ['Kỹ thuật phần mềm'],
    openRequests: 0,
    purchasedCount: 12,
    availableCount: 0,
    apiReady: false,
    description: 'Gói trọn bộ IDE lập trình JetBrains. Đang tạm ngừng cấp mới để chuyển dịch sang cloud tooling.',
    hasHistory: true // Có lịch sử -> Ngừng cho xin, không xóa cứng
  },

  // IT-AC-15: Lưu gói mới khi chưa có API cấp phát -> Trạng thái Nháp
  {
    id: 'CAT-06',
    softwareName: 'Cursor AI',
    vendor: 'Anysphere Inc.',
    planName: 'Team',
    provisioningType: 'Quyền truy cập SSO',
    status: 'draft', // Nháp (Chưa cho xin)
    departments: ['Kỹ thuật phần mềm'],
    openRequests: 0,
    purchasedCount: 0,
    availableCount: 0,
    apiReady: false,
    description: 'Gói Team cấp phép qua email miền công ty. Đang chờ kết nối API cấp phát tự động trước khi bật Cho phép xin.',
    hasHistory: false
  }
]

