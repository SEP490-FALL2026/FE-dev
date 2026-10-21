import { monthlyBudgetLines } from './finance-data'

/*
 * Annual budget planning demo data (Finance FIN-40 → FIN-47, Spending Approver APV-05). Amounts are VND borne
 * cost. FY2026 is the active fiscal year; FY2027 is being planned: Managers submit proposals, Finance reviews,
 * negotiates each SaaS line, adds base cost and buffer, then sends department budgets to the Spending Approver.
 */

export const activeFiscalYear = 2026
export const planningFiscalYear = 2027
export const financeReviewer = 'Ngọc Lan'
export const budgetApprover = 'Phạm Hoàng Nam'

// ---------------------------------------------------------------- Statuses

export type BudgetStatus = 'ACTIVE' | 'APPROVED' | 'DRAFT' | 'EXPIRED' | 'PENDING_APPROVAL' | 'UNDER_FINANCE_REVIEW'

/** Display order of the lifecycle. */
export const budgetStatuses: readonly BudgetStatus[] = [
  'DRAFT',
  'UNDER_FINANCE_REVIEW',
  'PENDING_APPROVAL',
  'APPROVED',
  'ACTIVE',
  'EXPIRED'
]

// ---------------------------------------------------------------- Fiscal periods (FIN-43)

export interface FiscalPeriod {
  approvedTotal: number | null
  end: string
  /** Date the next planning cycle opens (Managers start submitting proposals). */
  planningOpensAt: string
  start: string
  status: BudgetStatus
  year: number
}

export const fiscalPeriods: FiscalPeriod[] = [
  {
    approvedTotal: 1_880_000_000,
    end: '2025-12-31',
    planningOpensAt: '2024-10-01',
    start: '2025-01-01',
    status: 'EXPIRED',
    year: 2025
  },
  {
    approvedTotal: 2_076_000_000,
    end: '2026-12-31',
    planningOpensAt: '2025-10-01',
    start: '2026-01-01',
    status: 'ACTIVE',
    year: 2026
  },
  {
    approvedTotal: null,
    end: '2027-12-31',
    planningOpensAt: '2026-10-01',
    start: '2027-01-01',
    status: 'UNDER_FINANCE_REVIEW',
    year: 2027
  }
]

// ---------------------------------------------------------------- Approved annual budget FY2026 (overview, FIN-06, FIN-45)

export interface DepartmentAnnualBudget {
  /** Approved annual total = base + buffer. */
  base: number
  buffer: number
  costCenter: string
  department: string
  manager: string
  status: BudgetStatus
}

export const annualBudgets2026: DepartmentAnnualBudget[] = [
  {
    base: 870_000_000,
    buffer: 85_000_000,
    costCenter: 'CC-ENG',
    department: 'Phòng Kỹ thuật',
    manager: 'Lê Hoàng Anh',
    status: 'ACTIVE'
  },
  {
    base: 400_000_000,
    buffer: 35_000_000,
    costCenter: 'CC-DES',
    department: 'Phòng Thiết kế',
    manager: 'Lê Thu Hà',
    status: 'ACTIVE'
  },
  {
    base: 260_000_000,
    buffer: 23_000_000,
    costCenter: 'CC-OPS',
    department: 'Phòng Vận hành',
    manager: 'Đặng Thanh Hà',
    status: 'ACTIVE'
  },
  {
    base: 110_000_000,
    buffer: 10_000_000,
    costCenter: 'CC-MKT',
    department: 'Phòng Marketing',
    manager: 'Trịnh Quốc Bảo',
    status: 'ACTIVE'
  },
  {
    base: 72_000_000,
    buffer: 8_000_000,
    costCenter: 'CC-SAL',
    department: 'Phòng Kinh doanh',
    manager: 'Hoàng Gia Linh',
    status: 'ACTIVE'
  },
  {
    base: 185_000_000,
    buffer: 18_000_000,
    costCenter: 'CC-COMPANY',
    department: 'Toàn công ty',
    manager: 'Nguyễn Minh Khôi',
    status: 'ACTIVE'
  }
]

export const annualTotal = (budget: Pick<DepartmentAnnualBudget, 'base' | 'buffer'>) => budget.base + budget.buffer

/** Spent so far in FY2026 per Cost Center (borne cost), from the same monthly figures the budget screens use. */
export function usedThisYear(costCenter: string) {
  return monthlyBudgetLines.filter((line) => line.costCenter === costCenter).reduce((sum, line) => sum + line.actual, 0)
}

// ---------------------------------------------------------------- Commitments approved but not yet paid (FIN-20)

export interface UnpaidCommitment {
  amount: number
  approvedAt: string
  code: string
  costCenter: string
  /** RECORDED = Finance recorded it, invoice not paid yet; NOT_RECORDED = still waiting for Finance. */
  stage: 'NOT_RECORDED' | 'RECORDED'
  expectedPaymentAt: string
  software: string
}

export const unpaidCommitments: UnpaidCommitment[] = [
  {
    amount: 9_020_000,
    approvedAt: '2026-10-10',
    code: 'CMT-2026-051',
    costCenter: 'CC-ENG',
    expectedPaymentAt: '2026-10-25',
    software: 'Cursor Pro · 10 suất',
    stage: 'NOT_RECORDED'
  },
  {
    amount: 15_400_000,
    approvedAt: '2026-10-08',
    code: 'CMT-2026-049',
    costCenter: 'CC-MKT',
    expectedPaymentAt: '2026-10-20',
    software: 'Adobe Creative Cloud · 3 suất',
    stage: 'NOT_RECORDED'
  },
  {
    amount: 26_400_000,
    approvedAt: '2026-09-22',
    code: 'CMT-2026-044',
    costCenter: 'CC-ENG',
    expectedPaymentAt: '2026-10-30',
    software: 'Datadog APM Pro · 8 máy chủ',
    stage: 'RECORDED'
  },
  {
    amount: 12_600_000,
    approvedAt: '2026-09-30',
    code: 'CMT-2026-047',
    costCenter: 'CC-OPS',
    expectedPaymentAt: '2026-11-05',
    software: 'Jira Service Management · 10 agent',
    stage: 'RECORDED'
  },
  {
    amount: 6_300_000,
    approvedAt: '2026-10-02',
    code: 'CMT-2026-048',
    costCenter: 'CC-DES',
    expectedPaymentAt: '2026-10-28',
    software: 'Figma Organization · 10 suất',
    stage: 'RECORDED'
  }
]

// ---------------------------------------------------------------- SaaS groups and allocation (FIN-45)

export type SaasGroup = 'AI' | 'COLLABORATION' | 'DESIGN' | 'DEV_TOOLS' | 'MARKETING' | 'OTHER'

export const saasGroups: readonly SaasGroup[] = ['COLLABORATION', 'DEV_TOOLS', 'DESIGN', 'AI', 'MARKETING', 'OTHER']

/** FY2026 approved budget split per Cost Center into SaaS groups; the gap to the approved total is unallocated. */
export const groupAllocations2026: Record<string, Partial<Record<SaasGroup, number>>> = {
  'CC-COMPANY': { COLLABORATION: 150_000_000, OTHER: 53_000_000 },
  'CC-DES': { AI: 30_000_000, COLLABORATION: 60_000_000, DESIGN: 345_000_000 },
  'CC-ENG': { AI: 180_000_000, COLLABORATION: 140_000_000, DEV_TOOLS: 600_000_000, OTHER: 35_000_000 },
  'CC-MKT': { DESIGN: 30_000_000, MARKETING: 53_000_000 },
  'CC-OPS': { COLLABORATION: 90_000_000, DEV_TOOLS: 160_000_000, OTHER: 33_000_000 },
  'CC-SAL': { COLLABORATION: 20_000_000, MARKETING: 36_000_000 }
}

// ---------------------------------------------------------------- SaaS catalog with cost owner (FIN-46)

export type CatalogStatus = 'IN_CATALOG' | 'NEW_UNDER_REVIEW' | 'NOT_ALLOWED'

export interface SaasItem {
  annualCost: number
  catalogStatus: CatalogStatus
  costCenter: string
  group: SaasGroup
  id: string
  name: string
  seats: number
  vendor: string
}

export const saasItems: SaasItem[] = [
  {
    annualCost: 45_000_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-ENG',
    group: 'DEV_TOOLS',
    id: 'saas-github',
    name: 'GitHub Enterprise & Copilot',
    seats: 50,
    vendor: 'GitHub (Microsoft)'
  },
  {
    annualCost: 136_800_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-ENG',
    group: 'DEV_TOOLS',
    id: 'saas-jira',
    name: 'Jira Software',
    seats: 60,
    vendor: 'Atlassian'
  },
  {
    annualCost: 62_400_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-ENG',
    group: 'AI',
    id: 'saas-cursor',
    name: 'Cursor Pro',
    seats: 10,
    vendor: 'Anysphere'
  },
  {
    annualCost: 189_000_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-DES',
    group: 'DESIGN',
    id: 'saas-figma',
    name: 'Figma Organization',
    seats: 25,
    vendor: 'Figma'
  },
  {
    annualCost: 96_000_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-COMPANY',
    group: 'COLLABORATION',
    id: 'saas-slack',
    name: 'Slack Enterprise Grid',
    seats: 120,
    vendor: 'Salesforce'
  },
  {
    annualCost: 45_000_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-OPS',
    group: 'COLLABORATION',
    id: 'saas-miro',
    name: 'Miro Team',
    seats: 15,
    vendor: 'Miro'
  },
  {
    annualCost: 54_000_000,
    catalogStatus: 'IN_CATALOG',
    costCenter: 'CC-MKT',
    group: 'DESIGN',
    id: 'saas-adobe',
    name: 'Adobe Creative Cloud',
    seats: 3,
    vendor: 'Adobe'
  },
  {
    annualCost: 48_000_000,
    catalogStatus: 'NEW_UNDER_REVIEW',
    costCenter: 'CC-MKT',
    group: 'MARKETING',
    id: 'saas-hubspot',
    name: 'HubSpot Marketing Starter',
    seats: 1,
    vendor: 'HubSpot'
  },
  {
    annualCost: 78_000_000,
    catalogStatus: 'NEW_UNDER_REVIEW',
    costCenter: 'CC-ENG',
    group: 'AI',
    id: 'saas-chatgpt',
    name: 'ChatGPT Team',
    seats: 10,
    vendor: 'OpenAI'
  },
  {
    annualCost: 28_800_000,
    catalogStatus: 'NOT_ALLOWED',
    costCenter: 'CC-MKT',
    group: 'DESIGN',
    id: 'saas-canva',
    name: 'Canva Pro',
    seats: 4,
    vendor: 'Canva'
  }
]

// ---------------------------------------------------------------- Budget check before the Spending Approver (FIN-08)

export type BudgetCheckResult = 'CC_EXPIRED' | 'INSUFFICIENT' | 'OUT_OF_CATALOG' | 'PASSED'

export interface BudgetCheck {
  amount: number
  checkedAt: string
  costCenter: string
  id: string
  remainingBefore: number | null
  requestCode: string
  requester: string
  result: BudgetCheckResult
  software: string
}

export const budgetChecks: BudgetCheck[] = [
  {
    amount: 9_020_000,
    checkedAt: '2026-10-09T10:05:00+07:00',
    costCenter: 'CC-ENG',
    id: 'chk-078',
    remainingBefore: 115_500_000,
    requestCode: 'REQ-2026-078',
    requester: 'Lê Hoàng Anh',
    result: 'PASSED',
    software: 'Cursor Pro · 10 suất'
  },
  {
    amount: 14_175_000,
    checkedAt: '2026-10-11T14:02:00+07:00',
    costCenter: 'CC-DES',
    id: 'chk-089',
    remainingBefore: 51_625_000,
    requestCode: 'REQ-2026-089',
    requester: 'Trần Vũ Bảo',
    result: 'PASSED',
    software: 'Figma Organization · 15 suất'
  },
  {
    amount: 4_200_000,
    checkedAt: '2026-10-08T10:01:00+07:00',
    costCenter: 'CC-MKT',
    id: 'chk-101',
    remainingBefore: null,
    requestCode: 'REQ-2026-101',
    requester: 'Lý Thu Trang',
    result: 'OUT_OF_CATALOG',
    software: 'HubSpot Marketing Starter'
  },
  {
    amount: 6_615_000,
    checkedAt: '2026-10-12T08:16:00+07:00',
    costCenter: 'CC-OPS',
    id: 'chk-104',
    remainingBefore: 7_385_000,
    requestCode: 'REQ-2026-104',
    requester: 'Đặng Thanh Hà',
    result: 'PASSED',
    software: 'Datadog APM Pro · 5 máy chủ'
  },
  {
    amount: 31_680_000,
    checkedAt: '2026-10-12T09:40:00+07:00',
    costCenter: 'CC-OPS',
    id: 'chk-106',
    remainingBefore: 768_000,
    requestCode: 'REQ-2026-106',
    requester: 'Phan Minh Quân',
    result: 'INSUFFICIENT',
    software: 'PagerDuty Business · 12 suất'
  },
  {
    amount: 5_400_000,
    checkedAt: '2026-10-12T09:55:00+07:00',
    costCenter: 'CC-PRD',
    id: 'chk-107',
    remainingBefore: null,
    requestCode: 'REQ-2026-107',
    requester: 'Võ Thanh Nhàn',
    result: 'CC_EXPIRED',
    software: 'Maze Starter'
  },
  {
    amount: 18_600_000,
    checkedAt: '2026-10-09T14:00:00+07:00',
    costCenter: 'CC-ENG',
    id: 'chk-099',
    remainingBefore: 4_200_000,
    requestCode: 'REQ-2026-099',
    requester: 'Lê Hoàng Anh',
    result: 'INSUFFICIENT',
    software: 'Snyk Team · 12 nhà phát triển'
  },
  {
    amount: 28_800_000,
    checkedAt: '2026-10-10T15:20:00+07:00',
    costCenter: 'CC-ENG',
    id: 'chk-097',
    remainingBefore: 106_480_000,
    requestCode: 'REQ-2026-097',
    requester: 'Nguyễn Minh Khôi',
    result: 'PASSED',
    software: 'Notion AI Business · 40 suất'
  }
]

// ---------------------------------------------------------------- Budget exceptions (FIN-44)

export type ExceptionAction = 'PROPOSE_TOPUP' | 'REQUEST_INFO' | 'SUBMIT_TO_APPROVER' | 'TRANSFER_COST_CENTER'

export interface BudgetException {
  amount: number
  checkId: string
  costCenter: string
  detail: string
  id: string
  kind: Exclude<BudgetCheckResult, 'PASSED'>
  manager: string
  raisedAt: string
  requestCode: string
  /** Spending Approver decision on a top-up or an exception Finance submitted (APV-07). */
  approval?: { approved: boolean; at: string; by: string; reason?: string }
  resolution?: { action: ExceptionAction; at: string; note: string; targetCostCenter?: string; topUp?: number }
  software: string
}

/** Finance actions that need the Spending Approver's decision before they take effect. */
export const actionsNeedingApproval: readonly ExceptionAction[] = ['PROPOSE_TOPUP', 'SUBMIT_TO_APPROVER']

export const budgetExceptions: BudgetException[] = [
  {
    amount: 31_680_000,
    checkId: 'chk-106',
    costCenter: 'CC-OPS',
    detail: 'Ngân sách quý 4 của CC-OPS còn 768.000 ₫ sau cam kết đang giữ; yêu cầu cần 31.680.000 ₫.',
    id: 'bex-106',
    kind: 'INSUFFICIENT',
    manager: 'Đặng Thanh Hà',
    raisedAt: '2026-10-12T09:40:00+07:00',
    requestCode: 'REQ-2026-106',
    software: 'PagerDuty Business · 12 suất'
  },
  {
    amount: 5_400_000,
    checkId: 'chk-107',
    costCenter: 'CC-PRD',
    detail: 'CC-PRD đã ngừng hiệu lực và được gộp vào CC-DES; yêu cầu vẫn gắn mã cũ.',
    id: 'bex-107',
    kind: 'CC_EXPIRED',
    manager: 'Lê Thu Hà',
    raisedAt: '2026-10-12T09:55:00+07:00',
    requestCode: 'REQ-2026-107',
    software: 'Maze Starter'
  },
  {
    amount: 4_200_000,
    checkId: 'chk-101',
    costCenter: 'CC-MKT',
    detail: 'HubSpot chưa có trong danh mục được phép; Quản trị CNTT đang đánh giá.',
    id: 'bex-101',
    kind: 'OUT_OF_CATALOG',
    manager: 'Trịnh Quốc Bảo',
    raisedAt: '2026-10-08T10:01:00+07:00',
    requestCode: 'REQ-2026-101',
    software: 'HubSpot Marketing Starter'
  },
  {
    amount: 18_600_000,
    checkId: 'chk-099',
    costCenter: 'CC-ENG',
    detail: 'Nhóm Công cụ phát triển của CC-ENG còn 4.200.000 ₫; Snyk Team cần 18.600.000 ₫ cho quý 4.',
    id: 'bex-099',
    kind: 'INSUFFICIENT',
    manager: 'Lê Hoàng Anh',
    raisedAt: '2026-10-09T14:00:00+07:00',
    requestCode: 'REQ-2026-099',
    resolution: {
      action: 'PROPOSE_TOPUP',
      at: '2026-10-10T10:30:00+07:00',
      note: 'Đề xuất bổ sung từ buffer năm của Phòng Kỹ thuật; bắt buộc sau sự cố bảo mật tháng 9.',
      topUp: 14_400_000
    },
    software: 'Snyk Team · 12 nhà phát triển'
  },
  {
    amount: 2_100_000,
    checkId: 'chk-088',
    costCenter: 'CC-SAL',
    detail: 'Yêu cầu dùng ngân sách năm 2025 đã hết hiệu lực.',
    id: 'bex-088',
    kind: 'CC_EXPIRED',
    manager: 'Hoàng Gia Linh',
    raisedAt: '2026-10-03T11:20:00+07:00',
    requestCode: 'REQ-2026-088',
    resolution: {
      action: 'TRANSFER_COST_CENTER',
      at: '2026-10-04T09:00:00+07:00',
      note: 'Chuyển sang ngân sách năm 2026 của CC-SAL.',
      targetCostCenter: 'CC-SAL'
    },
    software: 'Loom Business · 2 suất'
  }
]

// ---------------------------------------------------------------- Annual proposals FY2027 (FIN-40 → FIN-42, APV-05)

/**
 * SUBMITTED → (NEEDS_INFO ↔ SUBMITTED) → IN_ANALYSIS → NEGOTIATED → SENT (Pending Approval) → APPROVED | RETURNED |
 * REJECTED. RETURNED means the Spending Approver asked Finance to adjust and resend; REJECTED ends the version.
 */
export type ProposalStage =
  'APPROVED' | 'IN_ANALYSIS' | 'NEEDS_INFO' | 'NEGOTIATED' | 'REJECTED' | 'RETURNED' | 'SENT' | 'SUBMITTED'

/** The Spending Approver's three answers to a department budget (APV-05). */
export type DecisionOutcome = 'ADJUSTMENT_REQUESTED' | 'APPROVED' | 'REJECTED'

export interface ApproverDecision {
  at: string
  by: string
  outcome: DecisionOutcome
  reason?: string
  /** Budget version the decision applies to. */
  version: number
}

export interface ProposalLine {
  /** Active users today, from usage data; absent for a tool the department does not use yet. */
  activeUsers?: number
  /** Finance's negotiated amount and the reason when it is below the request. */
  finance?: { amount: number; reason: string }
  group: SaasGroup
  id: string
  inCatalog: boolean
  /** Price per user per month the Manager used. */
  monthlyUnitPrice: number
  months: number
  need: string
  plan: string
  /** Finance hint: cheaper plan, alternative tool or seats to drop. */
  hint?: string
  software: string
  users: number
}

export interface AnnualProposal {
  attachments: string[]
  costCenter: string
  decision?: ApproverDecision
  department: string
  /** Buffer rate Finance applies on top of the SaaS base. */
  financeBufferRate: number
  /** Non-SaaS costs (training, implementation) — requested by the Manager, adjusted by Finance. */
  financeOtherCosts: number | null
  id: string
  infoRequest?: { at: string; message: string }
  lines: ProposalLine[]
  manager: string
  otherCosts: number
  sentAt?: string
  stage: ProposalStage
  submittedAt: string
  /** Increases each time Finance sends the budget to the Spending Approver; 0 = never sent. */
  version: number
  year: number
}

export const requestedAmount = (line: Pick<ProposalLine, 'monthlyUnitPrice' | 'months' | 'users'>) =>
  line.monthlyUnitPrice * line.months * line.users

const line = (
  id: string,
  software: string,
  plan: string,
  group: SaasGroup,
  users: number,
  monthlyUnitPrice: number,
  need: string,
  extra: Partial<ProposalLine> = {}
): ProposalLine => ({ group, id, inCatalog: true, monthlyUnitPrice, months: 12, need, plan, software, users, ...extra })

export const annualProposals: AnnualProposal[] = [
  {
    attachments: ['ke-hoach-tuyen-dung-ky-thuat-2027.pdf', 'bao-gia-cursor-2027.pdf'],
    costCenter: 'CC-ENG',
    department: 'Phòng Kỹ thuật',
    financeBufferRate: 0.08,
    financeOtherCosts: null,
    id: 'prop-eng',
    lines: [
      line(
        'eng-1',
        'GitHub Enterprise & Copilot',
        'Enterprise',
        'DEV_TOOLS',
        55,
        75_000,
        'Tuyển thêm 5 lập trình viên năm 2027.',
        {
          activeUsers: 31,
          finance: { amount: 36_000_000, reason: '19 suất không hoạt động; giữ 40 suất như đề xuất gia hạn của CNTT.' },
          hint: '31/50 suất đang hoạt động'
        }
      ),
      line('eng-2', 'Jira Software', 'Standard', 'DEV_TOOLS', 60, 190_000, 'Giữ nguyên quy mô dự án.', {
        activeUsers: 51,
        hint: '9 suất không hoạt động'
      }),
      line('eng-3', 'Cursor Pro', 'Pro', 'AI', 20, 520_000, 'Mở rộng trợ lý lập trình cho toàn đội.', {
        activeUsers: 10
      }),
      line('eng-4', 'ChatGPT Team', 'Team', 'AI', 10, 650_000, 'Thử nghiệm trợ lý chăm sóc khách hàng.', {
        hint: 'Chưa có trong danh mục — trùng một phần với Cursor Pro',
        inCatalog: false
      })
    ],
    manager: 'Lê Hoàng Anh',
    otherCosts: 40_000_000,
    stage: 'IN_ANALYSIS',
    submittedAt: '2026-10-05T09:00:00+07:00',
    version: 0,
    year: planningFiscalYear
  },
  {
    attachments: ['du-toan-thiet-ke-2027.xlsx'],
    costCenter: 'CC-DES',
    department: 'Phòng Thiết kế',
    financeBufferRate: 0.05,
    financeOtherCosts: 10_000_000,
    id: 'prop-des',
    lines: [
      line(
        'des-1',
        'Figma Organization',
        'Organization',
        'DESIGN',
        30,
        630_000,
        'Dự án Fintech Redesign cần thêm 5 suất.',
        {
          activeUsers: 21,
          finance: { amount: 189_000_000, reason: '4 ghost seat đã đề xuất thu hồi; giữ 25 suất.' },
          hint: '21/25 suất đang hoạt động'
        }
      ),
      line('des-2', 'Adobe Creative Cloud', 'All Apps', 'DESIGN', 4, 1_500_000, 'Dựng video và minh họa.', {
        activeUsers: 4,
        finance: { amount: 72_000_000, reason: '' }
      }),
      line('des-3', 'Maze', 'Starter', 'DESIGN', 3, 1_250_000, 'Kiểm thử khả dụng.', {
        finance: { amount: 27_000_000, reason: 'Thương lượng gói năm giảm 40%.' },
        inCatalog: false
      })
    ],
    manager: 'Lê Thu Hà',
    otherCosts: 15_000_000,
    stage: 'NEGOTIATED',
    submittedAt: '2026-10-03T14:30:00+07:00',
    version: 0,
    year: planningFiscalYear
  },
  {
    attachments: ['nhu-cau-van-hanh-2027.docx', 'bao-gia-pagerduty.pdf'],
    costCenter: 'CC-OPS',
    department: 'Phòng Vận hành',
    financeBufferRate: 0.08,
    financeOtherCosts: null,
    id: 'prop-ops',
    lines: [
      line('ops-1', 'Jira Service Management', 'Standard', 'DEV_TOOLS', 25, 1_100_000, 'Bàn trợ giúp nội bộ.', {
        activeUsers: 18
      }),
      line('ops-2', 'Datadog APM Pro', 'Pro', 'DEV_TOOLS', 10, 1_200_000, 'Giám sát 10 máy chủ thanh toán.', {
        activeUsers: 5
      }),
      line('ops-3', 'PagerDuty', 'Business', 'DEV_TOOLS', 12, 2_200_000, 'Trực sự cố 24/7.', { inCatalog: false }),
      line('ops-4', 'Zoom Business', 'Business', 'COLLABORATION', 20, 110_000, 'Họp với đối tác.', {
        activeUsers: 6,
        hint: 'Trùng chức năng với Google Meet'
      })
    ],
    manager: 'Đặng Thanh Hà',
    otherCosts: 25_000_000,
    stage: 'SUBMITTED',
    submittedAt: '2026-10-09T16:10:00+07:00',
    version: 0,
    year: planningFiscalYear
  },
  {
    attachments: [],
    costCenter: 'CC-MKT',
    department: 'Phòng Marketing',
    financeBufferRate: 0.05,
    financeOtherCosts: null,
    id: 'prop-mkt',
    infoRequest: {
      at: '2026-10-08T11:00:00+07:00',
      message: 'Bổ sung báo giá HubSpot và kế hoạch chiến dịch 2027 làm căn cứ cho số người dùng.'
    },
    lines: [
      line('mkt-1', 'HubSpot Marketing', 'Professional', 'MARKETING', 3, 4_000_000, 'Tự động hóa chiến dịch.', {
        inCatalog: false
      }),
      line('mkt-2', 'Adobe Creative Cloud', 'All Apps', 'DESIGN', 3, 1_500_000, 'Thiết kế nội dung quảng cáo.', {
        activeUsers: 3
      }),
      line('mkt-3', 'Semrush', 'Guru', 'MARKETING', 2, 3_300_000, 'Nghiên cứu từ khóa.')
    ],
    manager: 'Trịnh Quốc Bảo',
    otherCosts: 0,
    stage: 'NEEDS_INFO',
    submittedAt: '2026-10-06T10:20:00+07:00',
    version: 0,
    year: planningFiscalYear
  },
  {
    attachments: ['du-toan-kinh-doanh-2027.xlsx'],
    costCenter: 'CC-SAL',
    department: 'Phòng Kinh doanh',
    financeBufferRate: 0.05,
    financeOtherCosts: 5_000_000,
    id: 'prop-sal',
    lines: [
      line('sal-1', 'Salesforce Sales Cloud', 'Professional', 'MARKETING', 8, 1_900_000, 'Quản lý khách hàng.', {
        activeUsers: 7,
        finance: { amount: 159_600_000, reason: '' }
      }),
      line('sal-2', 'Loom Business', 'Business', 'COLLABORATION', 6, 375_000, 'Video giới thiệu sản phẩm.', {
        activeUsers: 2,
        finance: { amount: 9_000_000, reason: 'Chỉ 2 người dùng thường xuyên; giữ 2 suất.' }
      })
    ],
    manager: 'Hoàng Gia Linh',
    otherCosts: 5_000_000,
    sentAt: '2026-10-11T17:00:00+07:00',
    stage: 'SENT',
    submittedAt: '2026-10-02T08:45:00+07:00',
    version: 1,
    year: planningFiscalYear
  },
  {
    attachments: ['ke-hoach-cong-cu-chung-2027.pdf'],
    costCenter: 'CC-COMPANY',
    department: 'Toàn công ty',
    financeBufferRate: 0.05,
    financeOtherCosts: null,
    id: 'prop-company',
    lines: [
      line(
        'com-1',
        'Slack Enterprise Grid',
        'Enterprise Grid',
        'COLLABORATION',
        130,
        66_700,
        'Toàn công ty, thêm nhân sự mới.',
        {
          activeUsers: 109,
          hint: 'Có thể hạ xuống Business+ (4% dùng tính năng Enterprise)'
        }
      ),
      line('com-2', 'Google Workspace', 'Business Standard', 'COLLABORATION', 130, 300_000, 'Email, lịch, Meet.', {
        activeUsers: 124
      }),
      line('com-3', 'Notion AI Business', 'Business', 'AI', 40, 600_000, 'Tài liệu nội bộ.', { activeUsers: 33 })
    ],
    manager: 'Nguyễn Minh Khôi',
    otherCosts: 20_000_000,
    stage: 'SUBMITTED',
    submittedAt: '2026-10-07T09:30:00+07:00',
    version: 0,
    year: planningFiscalYear
  }
]

/** Finance's amount for a line: its negotiated figure, or the request until Finance enters one. */
export const financeAmount = (item: ProposalLine) => item.finance?.amount ?? requestedAmount(item)

export function proposalTotals(proposal: AnnualProposal) {
  const requestedSaas = proposal.lines.reduce((sum, item) => sum + requestedAmount(item), 0)
  const base = proposal.lines.reduce((sum, item) => sum + financeAmount(item), 0)
  const buffer = Math.round(base * proposal.financeBufferRate)
  const other = proposal.financeOtherCosts ?? proposal.otherCosts

  return {
    base,
    buffer,
    other,
    requested: requestedSaas + proposal.otherCosts,
    requestedSaas,
    total: base + buffer + other
  }
}

/** Budget lifecycle status shown for a department's FY2027 budget. */
export function proposalBudgetStatus(stage: ProposalStage): BudgetStatus {
  if (stage === 'NEEDS_INFO' || stage === 'REJECTED') return 'DRAFT'
  if (stage === 'SENT') return 'PENDING_APPROVAL'
  if (stage === 'APPROVED') return 'APPROVED'
  return 'UNDER_FINANCE_REVIEW'
}

// ---------------------------------------------------------------- Decision history (FIN-47)

/**
 * APPROVAL = annual budget decision; SPEND_APPROVAL = a regular in-year SaaS spend decision; EXCEPTION_APPROVAL and
 * ADJUSTMENT_APPROVAL = decisions on budget exceptions and on changes to an approved budget.
 */
export type HistoryKind =
  | 'ADJUSTMENT'
  | 'ADJUSTMENT_APPROVAL'
  | 'APPROVAL'
  | 'BUDGET_CHANGE'
  | 'BUFFER'
  | 'CUT'
  | 'EXCEPTION'
  | 'EXCEPTION_APPROVAL'
  | 'REVIEW'
  | 'SPEND_APPROVAL'

/** Kinds the Spending Approver decides (APV-06). */
export const approverHistoryKinds: readonly HistoryKind[] = [
  'APPROVAL',
  'SPEND_APPROVAL',
  'EXCEPTION_APPROVAL',
  'ADJUSTMENT_APPROVAL'
]

export const historyKinds: readonly HistoryKind[] = [
  'CUT',
  'BUFFER',
  'REVIEW',
  'APPROVAL',
  'BUDGET_CHANGE',
  'ADJUSTMENT',
  'EXCEPTION',
  'SPEND_APPROVAL',
  'EXCEPTION_APPROVAL',
  'ADJUSTMENT_APPROVAL'
]

export interface HistoryEntry {
  actor: string
  /** Amounts in VND; for BUFFER the rate (0.05 = 5%). */
  after?: number
  at: string
  before?: number
  costCenter: string
  id: string
  kind: HistoryKind
  /** Set on the Spending Approver's decisions. */
  outcome?: DecisionOutcome
  /** Data text (reason or summary) as entered by the actor. */
  note: string
  /** Annual budget version the decision applies to. */
  version?: number
  year: number
}

export const decisionHistory: HistoryEntry[] = [
  {
    actor: budgetApprover,
    after: 2_076_000_000,
    at: '2025-12-15T16:00:00+07:00',
    costCenter: 'CC-COMPANY',
    id: 'h-1',
    kind: 'APPROVAL',
    note: 'Duyệt ngân sách năm 2026 cho 6 trung tâm chi phí.',
    outcome: 'APPROVED',
    version: 2,
    year: 2026
  },
  {
    actor: budgetApprover,
    after: 2_150_000_000,
    at: '2025-12-05T10:00:00+07:00',
    costCenter: 'CC-COMPANY',
    id: 'h-0',
    kind: 'APPROVAL',
    note: 'Tổng vượt kế hoạch chi phí; yêu cầu Tài chính giảm buffer Phòng Kỹ thuật xuống 10%.',
    outcome: 'ADJUSTMENT_REQUESTED',
    version: 1,
    year: 2026
  },
  {
    actor: budgetApprover,
    after: 120_000_000,
    at: '2026-06-19T15:00:00+07:00',
    before: 105_000_000,
    costCenter: 'CC-MKT',
    id: 'h-7',
    kind: 'ADJUSTMENT_APPROVAL',
    note: 'Chấp thuận tăng ngân sách Marketing cho chiến dịch nửa cuối năm.',
    outcome: 'APPROVED',
    year: 2026
  },
  {
    actor: budgetApprover,
    after: 9_020_000,
    at: '2026-10-10T15:00:00+07:00',
    costCenter: 'CC-ENG',
    id: 'h-8',
    kind: 'SPEND_APPROVAL',
    note: 'REQ-2026-078 · Cursor Pro · 10 suất — trong ngân sách.',
    outcome: 'APPROVED',
    year: 2026
  },
  {
    actor: budgetApprover,
    after: 2_400_000,
    at: '2026-09-15T09:30:00+07:00',
    costCenter: 'CC-MKT',
    id: 'h-9',
    kind: 'EXCEPTION_APPROVAL',
    note: 'REQ-2026-071 · Canva Pro ngoài danh mục — không chấp thuận, dùng Adobe Express có sẵn.',
    outcome: 'REJECTED',
    year: 2026
  },
  {
    actor: financeReviewer,
    after: 120_000_000,
    at: '2026-06-20T10:00:00+07:00',
    before: 105_000_000,
    costCenter: 'CC-MKT',
    id: 'h-2',
    kind: 'BUDGET_CHANGE',
    note: 'Điều chỉnh tăng cho chiến dịch nửa cuối năm, đã được Người duyệt chi chấp thuận.',
    year: 2026
  },
  {
    actor: financeReviewer,
    after: 189_000_000,
    at: '2026-10-04T15:20:00+07:00',
    before: 226_800_000,
    costCenter: 'CC-DES',
    id: 'h-3',
    kind: 'CUT',
    note: 'Figma Organization: 4 ghost seat đã đề xuất thu hồi; giữ 25 suất.',
    year: 2027
  },
  {
    actor: financeReviewer,
    after: 0.05,
    at: '2026-10-04T15:30:00+07:00',
    costCenter: 'CC-DES',
    id: 'h-4',
    kind: 'BUFFER',
    note: 'Buffer 5% cho Phòng Thiết kế.',
    year: 2027
  },
  {
    actor: financeReviewer,
    at: '2026-10-08T11:00:00+07:00',
    costCenter: 'CC-MKT',
    id: 'h-5',
    kind: 'REVIEW',
    note: 'Yêu cầu bổ sung báo giá HubSpot và kế hoạch chiến dịch 2027.',
    year: 2027
  },
  {
    actor: financeReviewer,
    at: '2026-10-11T17:00:00+07:00',
    costCenter: 'CC-SAL',
    id: 'h-6',
    kind: 'REVIEW',
    note: 'Gửi ngân sách 2027 của Phòng Kinh doanh cho Người duyệt chi.',
    year: 2027
  }
]

// ---------------------------------------------------------------- Adjustments to an approved budget (FIN-45 → APV-07)

export interface BudgetAdjustment {
  after: number
  approval?: { approved: boolean; at: string; by: string; reason?: string }
  before: number
  costCenter: string
  id: string
  reason: string
  requestedAt: string
  requestedBy: string
  year: number
}

export const budgetAdjustments: BudgetAdjustment[] = [
  {
    after: 310_000_000,
    before: 283_000_000,
    costCenter: 'CC-OPS',
    id: 'adj-ops',
    reason: 'Thêm PagerDuty cho trực sự cố 24/7 từ quý 4 sau sự cố thanh toán tháng 9.',
    requestedAt: '2026-10-11T09:00:00+07:00',
    requestedBy: financeReviewer,
    year: activeFiscalYear
  }
]
