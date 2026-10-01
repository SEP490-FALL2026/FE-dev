export interface ApprovalTask {
  id: string
  code: string
  title: string
  saasName: string
  saasLogo: string
  taskType: 'EXPENSE' | 'RENEWAL' | 'NEW_SAAS'
  requesterName: string
  requesterRole: string
  costCenter: string
  amount: number
  currency: string
  seatCount?: number
  slaHoursRemaining: number
  isOverdue: boolean
  isSodConflict: boolean
  managerApproved: boolean
  itRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  cancellationDeadline?: string
}

export const MOCK_APPROVAL_TASKS: ApprovalTask[] = [
  {
    id: 'req-01',
    code: 'REQ-2026-089',
    title: 'Xin cấp 15 seat Figma Organization cho Dự án Fintech Redesign',
    saasName: 'Figma Enterprise',
    saasLogo: '🎨',
    taskType: 'EXPENSE',
    requesterName: 'Trần Vũ Bảo',
    requesterRole: 'Lead Product Designer',
    costCenter: 'CC-DESIGN-01 (Product Design)',
    amount: 13500000,
    currency: 'VND',
    seatCount: 15,
    slaHoursRemaining: 6,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: true,
    createdAt: '2026-09-28T14:30:00Z'
  },
  {
    id: 'req-02',
    code: 'REQ-2026-092',
    title: 'Kỳ gia hạn hợp đồng GitHub Enterprise & Copilot (Hạn chót báo hủy)',
    saasName: 'GitHub Copilot Business',
    saasLogo: '🐙',
    taskType: 'RENEWAL',
    requesterName: 'Nguyễn Văn Minh',
    requesterRole: 'VP of Engineering',
    costCenter: 'CC-ENG-02 (Core Backend)',
    amount: 45000000,
    currency: 'VND',
    seatCount: 50,
    slaHoursRemaining: 14,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: true,
    cancellationDeadline: '2026-10-05',
    createdAt: '2026-09-27T09:00:00Z'
  },
  {
    id: 'req-03',
    code: 'REQ-2026-078',
    title: 'Yêu cầu đăng ký SaaS mới: Cursor AI Pro cho Đội phát triển AI',
    saasName: 'Cursor AI IDE',
    saasLogo: '⚡',
    taskType: 'NEW_SAAS',
    requesterName: 'Phạm Hoàng Nam',
    requesterRole: 'Chief Executive Officer',
    costCenter: 'CC-EXEC-01 (Executive)',
    amount: 8200000,
    currency: 'VND',
    seatCount: 10,
    slaHoursRemaining: -4,
    isOverdue: true,
    isSodConflict: true,
    managerApproved: true,
    itRiskLevel: 'MEDIUM',
    createdAt: '2026-09-25T11:20:00Z'
  },
  {
    id: 'req-04',
    code: 'REQ-2026-095',
    title: 'Mua bổ sung 25 seat Notion AI Team Workspace',
    saasName: 'Notion AI',
    saasLogo: '📝',
    taskType: 'EXPENSE',
    requesterName: 'Đặng Thanh Hà',
    requesterRole: 'Head of Operations',
    costCenter: 'CC-OPS-03 (Operations)',
    amount: 18750000,
    currency: 'VND',
    seatCount: 25,
    slaHoursRemaining: 36,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: false,
    createdAt: '2026-09-29T08:00:00Z'
  }
]

export interface CostCenterReport {
  id: string
  code: string
  name: string
  period: string
  budget: number
  spent: number
  commitments: number
  status: 'NORMAL' | 'WARNING' | 'DANGER'
}

export const costCenterReports: CostCenterReport[] = [
  {
    id: 'CC-ENG-02',
    code: 'CC-ENG-02',
    name: 'Engineering & Core Backend',
    period: 'Q1-2026',
    budget: 250000000,
    spent: 185000000,
    commitments: 35000000,
    status: 'WARNING'
  },
  {
    id: 'CC-DESIGN-01',
    code: 'CC-DESIGN-01',
    name: 'Product Design & UX',
    period: 'Q1-2026',
    budget: 120000000,
    spent: 82000000,
    commitments: 13500000,
    status: 'NORMAL'
  },
  {
    id: 'CC-OPS-03',
    code: 'CC-OPS-03',
    name: 'Operations & IT Infrastructure',
    period: 'Q1-2026',
    budget: 80000000,
    spent: 45000000,
    commitments: 10000000,
    status: 'NORMAL'
  },
  {
    id: 'CC-MKT-04',
    code: 'CC-MKT-04',
    name: 'Marketing & Growth Tech',
    period: 'Q2-2026',
    budget: 150000000,
    spent: 138000000,
    commitments: 18000000,
    status: 'DANGER'
  }
]

export const topVendors = [
  { name: 'GitHub Enterprise & Copilot', spend: 180000000, percentage: 26, category: 'Dev Tools' },
  { name: 'Salesforce Slack Grid', spend: 144000000, percentage: 21, category: 'Collaboration' },
  { name: 'Atlassian Jira & Confluence', spend: 120000000, percentage: 18, category: 'Management' },
  { name: 'Figma Enterprise', spend: 96000000, percentage: 14, category: 'Design' },
  { name: 'Notion AI Workspace', spend: 60000000, percentage: 9, category: 'Productivity' }
]

export const urgentPendingItems = [
  {
    id: 'req-01',
    type: 'EXPENSE',
    title: 'Nâng cấp 15 Figma Enterprise seats',
    requester: 'Lê Minh Tuấn (Design Lead)',
    costCenter: 'CC-DESIGN-01',
    amount: 45000000,
    slaHours: 4,
    urgency: 'HIGH'
  },
  {
    id: 'req-02',
    type: 'RENEWAL',
    title: 'Gia hạn Datadog APM Enterprise (100 Hosts)',
    requester: 'Nguyễn Văn Hải (DevOps Lead)',
    costCenter: 'CC-ENG-02',
    amount: 97500000,
    slaHours: 12,
    urgency: 'HIGH'
  }
]

export const approverMetrics = {
  pendingValue: 142500000,
  urgentCount: 2,
  totalArr: 680000000,
  realizedSavings: 112000000
}

export const approverBudgetSnapshot = {
  period: 'Q3-2026',
  totalBudget: 500000000,
  actualSpend: 312000000,
  heldCommitments: 45000000,
  remainingBudget: 143000000,
  pendingApprovals: 68000000
}
