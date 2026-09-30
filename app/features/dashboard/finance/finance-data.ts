export interface BudgetInquiry {
  id: string
  requestCode: string
  saasName: string
  requesterName: string
  amount: number
  costCenter: string
  askedAt: string
  status: 'PENDING' | 'RESPONDED'
  financeResponse?: 'WITHIN_LIMIT' | 'EXCEEDS_LIMIT' | 'NO_BUDGET'
  financeNote?: string
}

export const MOCK_BUDGET_INQUIRIES: BudgetInquiry[] = [
  {
    id: 'inq-01',
    requestCode: 'REQ-2026-089',
    saasName: 'Figma Enterprise (15 seats)',
    requesterName: 'Trần Vũ Bảo',
    amount: 13500000,
    costCenter: 'CC-DESIGN-01',
    askedAt: '2026-09-28T15:10:00Z',
    status: 'PENDING'
  },
  {
    id: 'inq-02',
    requestCode: 'REQ-2026-078',
    saasName: 'Cursor AI Pro (10 seats)',
    requesterName: 'Phạm Hoàng Nam',
    amount: 8200000,
    costCenter: 'CC-EXEC-01',
    askedAt: '2026-09-25T12:00:00Z',
    status: 'RESPONDED',
    financeResponse: 'WITHIN_LIMIT',
    financeNote: 'Ngân sách Q3 còn đủ chi trả. Không chặn quy trình duyệt chi.'
  }
]

export interface CommitmentRecord {
  id: string
  commitmentCode: string
  requestRefCode: string
  saasName: string
  costCenter: string
  amount: number
  createdAt: string
  status: 'HELD' | 'RECONCILED' | 'RELEASED'
}

export const MOCK_COMMITMENTS: CommitmentRecord[] = [
  {
    id: 'cmt-01',
    commitmentCode: 'CMT-2026-044',
    requestRefCode: 'REQ-2026-089',
    saasName: 'Figma Enterprise (15 seats)',
    costCenter: 'CC-DESIGN-01',
    amount: 13500000,
    createdAt: '2026-09-28T16:00:00Z',
    status: 'HELD'
  },
  {
    id: 'cmt-02',
    commitmentCode: 'CMT-2026-039',
    requestRefCode: 'REQ-2026-065',
    saasName: 'Jira Service Management',
    costCenter: 'CC-OPS-03',
    amount: 24000000,
    createdAt: '2026-09-20T10:30:00Z',
    status: 'RECONCILED'
  },
  {
    id: 'cmt-03',
    commitmentCode: 'CMT-2026-028',
    requestRefCode: 'REQ-2026-041',
    saasName: 'Miro Team Plan',
    costCenter: 'CC-PRODUCT-02',
    amount: 7500000,
    createdAt: '2026-09-12T14:15:00Z',
    status: 'RELEASED'
  }
]

export interface RenewalScheduleItem {
  id: string
  subscriptionName: string
  vendor: string
  seats: number
  cancellationDeadline: string
  renewalDate: string
  annualCost: number
  unassignedSeats: number
  inactiveUsers: number
  potentialSavings: number
  status: 'PENDING_DECISION' | 'DECIDED_RENEW' | 'DECIDED_DOWNSIZE' | 'AUTO_RENEWED_INCIDENT'
}

export const MOCK_RENEWAL_ITEMS: RenewalScheduleItem[] = [
  {
    id: 'sub-01',
    subscriptionName: 'GitHub Enterprise & Copilot Business',
    vendor: 'GitHub / Microsoft',
    seats: 50,
    cancellationDeadline: '2026-10-05',
    renewalDate: '2026-11-05',
    annualCost: 45000000,
    unassignedSeats: 10,
    inactiveUsers: 5,
    potentialSavings: 13500000,
    status: 'PENDING_DECISION'
  },
  {
    id: 'sub-02',
    subscriptionName: 'Slack Enterprise Grid',
    vendor: 'Salesforce',
    seats: 120,
    cancellationDeadline: '2026-10-15',
    renewalDate: '2026-11-15',
    annualCost: 96000000,
    unassignedSeats: 15,
    inactiveUsers: 12,
    potentialSavings: 21600000,
    status: 'PENDING_DECISION'
  },
  {
    id: 'sub-03',
    subscriptionName: 'Jira Software Enterprise',
    vendor: 'Atlassian',
    seats: 80,
    cancellationDeadline: '2026-09-20',
    renewalDate: '2026-10-20',
    annualCost: 64000000,
    unassignedSeats: 8,
    inactiveUsers: 4,
    potentialSavings: 9600000,
    status: 'AUTO_RENEWED_INCIDENT'
  }
]

export interface ShadowItTransaction {
  id: string
  serviceName: string
  vendor: string
  spenderName: string
  spenderRole: string
  cardLast4: string
  amount: number
  date: string
  status: 'FLAGGED' | 'INQUIRED' | 'LEGALIZED' | 'REJECTED'
}

export const MOCK_SHADOW_IT_TRANSACTIONS: ShadowItTransaction[] = [
  {
    id: 'sit-01',
    serviceName: 'OpenAI ChatGPT Plus',
    vendor: 'OpenAI LLC',
    spenderName: 'Lê Hoàng Anh',
    spenderRole: 'Senior AI Engineer',
    cardLast4: '8812',
    amount: 520000,
    date: '2026-09-27',
    status: 'FLAGGED'
  },
  {
    id: 'sit-02',
    serviceName: 'Canva Pro Annual',
    vendor: 'Canva Pty Ltd',
    spenderName: 'Nguyễn Thị Mai',
    spenderRole: 'Marketing Specialist',
    cardLast4: '3341',
    amount: 2400000,
    date: '2026-09-24',
    status: 'INQUIRED'
  },
  {
    id: 'sit-03',
    serviceName: 'Vercel Pro Team Plan',
    vendor: 'Vercel Inc.',
    spenderName: 'Đỗ Văn Thành',
    spenderRole: 'Frontend Tech Lead',
    cardLast4: '9012',
    amount: 1450000,
    date: '2026-09-18',
    status: 'LEGALIZED'
  }
]

export interface SoftwareExpenseItem {
  id: string
  name: string
  vendor: string
  logo: string
  pricingModel: string
  totalSeats: number
  assignedSeats: number
  annualCost: number
  costCenter: string
  paymentMethod: 'INVOICE' | 'CARD'
  cardLast4?: string
  status: 'ACTIVE' | 'PENDING_RENEWAL'
}

export const MOCK_SOFTWARE_DIRECTORY: SoftwareExpenseItem[] = [
  {
    id: 'soft-01',
    name: 'Figma Enterprise',
    vendor: 'Figma Inc.',
    logo: '🎨',
    pricingModel: 'Per Seat / Month',
    totalSeats: 35,
    assignedSeats: 25,
    annualCost: 31500000,
    costCenter: 'CC-DESIGN-01',
    paymentMethod: 'INVOICE',
    status: 'ACTIVE'
  },
  {
    id: 'soft-02',
    name: 'GitHub Copilot Business',
    vendor: 'GitHub / Microsoft',
    logo: '🐙',
    pricingModel: 'Per Seat / Month',
    totalSeats: 50,
    assignedSeats: 40,
    annualCost: 45000000,
    costCenter: 'CC-ENG-02',
    paymentMethod: 'INVOICE',
    status: 'PENDING_RENEWAL'
  },
  {
    id: 'soft-03',
    name: 'Notion AI Workspace',
    vendor: 'Notion Labs',
    logo: '📝',
    pricingModel: 'Per Seat / Month',
    totalSeats: 40,
    assignedSeats: 35,
    annualCost: 28800000,
    costCenter: 'CC-OPS-03',
    paymentMethod: 'CARD',
    cardLast4: '4892',
    status: 'ACTIVE'
  }
]

export const financeMetrics = {
  arr: 680000000,
  mrr: 56600000,
  activeSubscriptions: 24,
  realizedSavings: 112000000
}

export const financeCostCenters = [
  {
    code: 'CC-ENG-02',
    name: 'Engineering & Core Backend',
    allocatedBudget: 250000000,
    spent: 185000000,
    commitments: 35000000
  },
  {
    code: 'CC-DESIGN-01',
    name: 'Product Design & UX',
    allocatedBudget: 120000000,
    spent: 82000000,
    commitments: 13500000
  },
  {
    code: 'CC-OPS-03',
    name: 'Operations & IT Infrastructure',
    allocatedBudget: 80000000,
    spent: 45000000,
    commitments: 10000000
  }
]

export const financeTopVendors = [
  { name: 'GitHub Enterprise & Copilot', spend: 180000000, percentage: 26, logo: '🐙' },
  { name: 'Salesforce Slack Grid', spend: 144000000, percentage: 21, logo: '💬' },
  { name: 'Atlassian Jira & Confluence', spend: 120000000, percentage: 18, logo: '📊' },
  { name: 'Figma Enterprise', spend: 96000000, percentage: 14, logo: '🎨' },
  { name: 'Notion AI Workspace', spend: 60000000, percentage: 9, logo: '📝' }
]

export const financeSnapshotData = {
  period: 'Q3-2026',
  totalBudget: 500000000,
  actualSpend: 312000000,
  heldCommitments: 45000000,
  remainingBudget: 143000000,
  pendingApprovals: 68000000
}
