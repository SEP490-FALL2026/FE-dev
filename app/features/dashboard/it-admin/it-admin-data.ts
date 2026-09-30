export type ProvisioningTask = {
  account: string
  action: 'provision' | 'deprovision'
  app: string
  channel: string
  decisionSource: string
  id: string
  sla: string
  status: 'pendingAccept' | 'manual' | 'retry' | 'authError' | 'capacity'
  user: string
}

export const itProvisioningTasks: ProvisioningTask[] = [
  {
    account: 'minhanh-dev',
    action: 'provision',
    app: 'GitHub Business',
    channel: 'Connector',
    decisionSource: 'REQ-2026-0917-084',
    id: 'PV-2041',
    sla: '3h 18m',
    status: 'pendingAccept',
    user: 'Nguyễn Minh An'
  },
  {
    account: 'tran.minh@company.com',
    action: 'deprovision',
    app: 'Figma Professional',
    channel: 'Manual',
    decisionSource: 'OFF-2026-044',
    id: 'PV-2042',
    sla: '2h 54m',
    status: 'manual',
    user: 'Trần Minh'
  },
  {
    account: 'lethuha-dev',
    action: 'provision',
    app: 'GitHub Business',
    channel: 'Connector → Manual',
    decisionSource: 'REQ-2026-0916-219',
    id: 'PV-2037',
    sla: '1h 12m',
    status: 'retry',
    user: 'Lê Thu Hà'
  },
  {
    account: 'long.do@company.com',
    action: 'deprovision',
    app: 'Figma Professional',
    channel: 'Connector',
    decisionSource: 'REQ-2026-0916-102',
    id: 'PV-2038',
    sla: '4h 00m',
    status: 'authError',
    user: 'Đỗ Hoàng Long'
  },
  {
    account: 'thao.pham@company.com',
    action: 'provision',
    app: 'Slack Business+',
    channel: 'Connector',
    decisionSource: 'REQ-2026-0915-048',
    id: 'PV-2039',
    sla: '0h 45m',
    status: 'capacity',
    user: 'Phạm Thanh Thảo'
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
    id: 'SRC-M365',
    lastSync: '15/12/2024 (Quá 30 ngày)',
    name: 'Microsoft 365 Admin Center',
    status: 'needsUpdate',
    type: 'CSV Usage Report'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-GW',
    lastSync: 'Hôm nay 06:00',
    name: 'Google Workspace',
    status: 'active',
    type: 'API Connector'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-FIG',
    lastSync: 'Hôm qua 22:30',
    name: 'Figma Organization',
    status: 'active',
    type: 'API Connector'
  },
  {
    coverage: '01/01/2025 – 15/01/2025',
    id: 'SRC-GH',
    lastSync: 'Hôm nay 08:15',
    name: 'GitHub Enterprise',
    status: 'active',
    type: 'Git Commits & Extension'
  },
  {
    coverage: 'Không áp dụng (Roster)',
    id: 'SRC-ZM',
    lastSync: 'Hôm nay 07:00',
    name: 'Zoom Workplace',
    status: 'blocked',
    type: 'Roster Only (ADR-10)'
  },
  {
    coverage: 'Không áp dụng (Roster)',
    id: 'SRC-SLK',
    lastSync: 'Hôm nay 07:00',
    name: 'Slack Business+',
    status: 'blocked',
    type: 'Roster Only (ADR-10)'
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
    candidateDepartment: 'Engineering',
    confidence: '94%',
    id: 'UQ-0184',
    normalized: 'an.nguyen',
    raw: 'an.nguyen@saas-sentry.test',
    status: 'suggested'
  },
  {
    id: 'UQ-0185',
    normalized: 'contractor_ext_99',
    raw: 'contractor_ext_99@partner.net',
    status: 'noCandidate'
  },
  {
    candidate: 'Trần Quang Huy (82%) | Trần Huy (80%)',
    candidateDepartment: 'Product / Operations',
    confidence: '82% / 80%',
    id: 'UQ-0186',
    normalized: 'huy.tran',
    raw: 'huy.tran@saas-sentry.test',
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
    app: 'Canva Pro',
    context: 'Đội Marketing dùng thiết kế banner sự kiện nhanh',
    id: 'FND-2026-045',
    risk: 'medium',
    source: 'Sao kê thẻ tín dụng (PAYPAL*CANVA)',
    users: 7
  },
  {
    app: 'Grammarly Business',
    context: 'Bộ phận Content & Sales sửa ngữ pháp email quốc tế',
    id: 'FND-2026-046',
    risk: 'high',
    source: 'Hệ định danh IdP (Google SSO)',
    users: 12
  },
  {
    app: 'Airtable Team',
    context: 'Quản lý dự án nội bộ nhóm R&D',
    id: 'FND-2026-047',
    risk: 'low',
    source: 'Bộ thu thập tiện ích trình duyệt',
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
    action: 'Cập nhật hợp đồng lên 55 seat',
    app: 'Slack Business+',
    diff: 'Hóa đơn: 55 seat | Nội bộ: 50 seat | Thực tế dùng: 48 seat (+5 seat)',
    id: 'DISC-SLK-01',
    title: 'Lệch số lượng hóa đơn (+5 seat)',
    type: 'invoice'
  },
  {
    action: 'Điều tra an ninh & Thu hồi khẩn',
    app: 'GitHub Enterprise',
    diff: 'User `dev-external-bot` có quyền Admin trên repo nhưng không có Assignment',
    id: 'DISC-GH-02',
    title: 'Quyền ngoài luồng (Shadow Access)',
    type: 'shadowAccess'
  },
  {
    action: 'Chuyển task PV-2041 sang Hoàn tất',
    app: 'Figma Professional',
    diff: 'Lời mời `minhanh-dev` đã được chấp nhận thành viên active trên Figma',
    id: 'DISC-FIG-03',
    title: 'Tác vụ chờ chấp nhận đã kích hoạt',
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
    department: 'Engineering',
    device: 'Apple MacBook Pro M3',
    employee: 'Nguyễn Minh An',
    gateway: 'open',
    id: 'DEV-MBP-2026-088',
    lastSync: 'Hôm nay 09:20',
    version: 'v1.2'
  },
  {
    department: 'Design',
    device: 'Lenovo ThinkPad X1 Carbon',
    employee: 'Lê Thu Hà',
    gateway: 'open',
    id: 'DEV-WIN-2026-041',
    lastSync: 'Hôm nay 08:45',
    version: 'v1.2'
  },
  {
    department: 'Product',
    device: 'Dell XPS 15 9530',
    employee: 'Trần Minh',
    gateway: 'locked',
    id: 'DEV-WIN-2026-077',
    lastSync: 'Chưa có dữ liệu',
    version: 'v1.2 (Chờ xác nhận)'
  }
]
