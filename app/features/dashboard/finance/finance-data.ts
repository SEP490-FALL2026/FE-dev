import type { BudgetSnapshot, CostEstimate } from '../budget-figures'

/*
 * Demo data for the Finance screens (UF-11, UF-12, UF-19). Every amount is VND borne cost
 * (price + non-deductible tax); deductible VAT is kept apart (FR-5.13, QĐ-60a).
 * Budget work runs on the current period; period close runs on the period that just ended.
 */

export const financeDataAsOf = '2026-10-12T08:30:00+07:00'

export const currentPeriod = 'Q4-2026'
export const closingPeriod = 'Q3-2026'

// ---------------------------------------------------------------- Cost Centers (FIN-22)

export interface CostCenter {
  code: string
  department?: string
  kind: 'COMPANY' | 'UNIT'
  name: string
  replacedBy?: string
  status: 'ACTIVE' | 'RETIRED'
}

export const costCenters: CostCenter[] = [
  { code: 'CC-ENG', department: 'Phòng Kỹ thuật', kind: 'UNIT', name: 'Kỹ thuật', status: 'ACTIVE' },
  { code: 'CC-DES', department: 'Phòng Thiết kế', kind: 'UNIT', name: 'Thiết kế', status: 'ACTIVE' },
  { code: 'CC-OPS', department: 'Phòng Vận hành', kind: 'UNIT', name: 'Vận hành', status: 'ACTIVE' },
  { code: 'CC-MKT', department: 'Phòng Marketing', kind: 'UNIT', name: 'Marketing', status: 'ACTIVE' },
  { code: 'CC-SAL', department: 'Phòng Kinh doanh', kind: 'UNIT', name: 'Kinh doanh', status: 'ACTIVE' },
  { code: 'CC-COMPANY', kind: 'COMPANY', name: 'Toàn công ty', status: 'ACTIVE' },
  {
    code: 'CC-PRD',
    department: 'Phòng Sản phẩm (đã gộp)',
    kind: 'UNIT',
    name: 'Sản phẩm',
    replacedBy: 'CC-DES',
    status: 'RETIRED'
  }
]

// ---------------------------------------------------------------- Budget vs actual of the current period

export const currentBudgetLines: BudgetSnapshot[] = [
  {
    actual: 96_000_000,
    asOf: financeDataAsOf,
    budget: 250_000_000,
    costCenter: 'CC-ENG',
    deductibleVat: 7_400_000,
    held: 38_500_000,
    pending: 0,
    period: currentPeriod
  },
  {
    actual: 41_000_000,
    asOf: financeDataAsOf,
    budget: 120_000_000,
    costCenter: 'CC-DES',
    deductibleVat: 3_100_000,
    held: 13_200_000,
    pending: 14_175_000,
    period: currentPeriod
  },
  {
    actual: 48_000_000,
    asOf: financeDataAsOf,
    budget: 80_000_000,
    costCenter: 'CC-OPS',
    deductibleVat: 3_900_000,
    held: 18_000_000,
    pending: 6_615_000,
    period: currentPeriod
  },
  {
    actual: 6_200_000,
    asOf: financeDataAsOf,
    budget: null,
    costCenter: 'CC-MKT',
    deductibleVat: 600_000,
    held: 24_000_000,
    pending: 4_200_000,
    period: currentPeriod
  },
  {
    actual: 0,
    asOf: financeDataAsOf,
    budget: null,
    costCenter: 'CC-SAL',
    deductibleVat: 0,
    held: 0,
    pending: 0,
    period: currentPeriod
  },
  {
    actual: 22_000_000,
    asOf: financeDataAsOf,
    budget: 60_000_000,
    costCenter: 'CC-COMPANY',
    deductibleVat: 1_800_000,
    held: 0,
    pending: 0,
    period: currentPeriod
  }
]

export function findBudgetLine(costCenter: string) {
  return currentBudgetLines.find((line) => line.costCenter === costCenter)
}

// ---------------------------------------------------------------- Budget by month (FIN-06 period views)

/** The month that contains `financeDataAsOf`; later months have no actual spend yet. */
export const currentMonth = '2026-10'
export const budgetYear = 2026

/** One Cost Center and month. Quarter and year views add months up; `budget === null` means no Budget. */
export interface MonthlyBudgetLine {
  actual: number
  budget: number | null
  costCenter: string
  held: number
  month: string
}

const M = 1_000_000

/** Splits a whole-VND amount into `parts` shares that add up exactly; the last share takes the remainder. */
export function splitEvenly(amount: number, parts: number) {
  const share = Math.floor(amount / parts)
  return Array.from({ length: parts }, (_, index) => (index === parts - 1 ? amount - share * (parts - 1) : share))
}

/** Quarter budgets Q1–Q4 and actual spend Jan–Oct, in million VND (borne cost). */
const budgetPlan: Record<string, { actual: number[]; quarters: (number | null)[] }> = {
  'CC-COMPANY': { actual: [13, 14, 14, 15, 15, 16, 13.8, 13.8, 13.9, 22], quarters: [45, 48, 50, 60] },
  'CC-DES': { actual: [30, 31, 32, 33, 34, 35, 26, 26.3, 26.3, 41], quarters: [100, 105, 110, 120] },
  'CC-ENG': { actual: [70, 72, 74, 75, 76, 78, 60.2, 61, 61.2, 96], quarters: [230, 235, 240, 250] },
  'CC-MKT': { actual: [7, 7.5, 8, 8, 9, 9, 7, 7.2, 7.5, 6.2], quarters: [25, 28, 30, null] },
  'CC-OPS': { actual: [20, 21, 21, 22, 22, 23, 21, 21, 21.1, 48], quarters: [65, 68, 70, 80] },
  'CC-SAL': { actual: [5, 5, 5, 5.5, 5.5, 6, 4.7, 4.7, 4.8, 0], quarters: [18, 18, 20, null] }
}

export const monthlyBudgetLines: MonthlyBudgetLine[] = currentBudgetLines.flatMap(({ costCenter, held }) => {
  const plan = budgetPlan[costCenter]

  return Array.from({ length: 12 }, (_, index) => {
    const month = `${budgetYear}-${String(index + 1).padStart(2, '0')}`
    const quarterBudget = plan.quarters[Math.floor(index / 3)]
    const budget = quarterBudget === null ? null : splitEvenly(Math.round(quarterBudget * M), 3)[index % 3]

    return {
      actual: Math.round((plan.actual[index] ?? 0) * M),
      budget,
      costCenter,
      held: month === currentMonth ? held : 0,
      month
    }
  })
})

// ---------------------------------------------------------------- Budget questions (FIN-05)

export type BudgetOpinion = 'NO_BUDGET' | 'OVER' | 'WITHIN'

export interface BudgetQuestion {
  answer?: { note: string; opinion: BudgetOpinion; answeredAt: string }
  askedAt: string
  askedBy: string
  costCenter: string
  estimate: CostEstimate
  id: string
  question: string
  requestCode: string
  requester: string
  /** SoD-8: the Finance user is also the Spending Approver of this request and must not answer. */
  responderIsApprover?: boolean
  software: string
  status: 'ANSWERED' | 'CLOSED_CANCELLED' | 'OPEN'
}

export const budgetQuestions: BudgetQuestion[] = [
  {
    askedAt: '2026-10-12T09:10:00+07:00',
    askedBy: 'Phạm Hoàng Nam',
    costCenter: 'CC-DES',
    estimate: { deductibleVat: 1_350_000, nonDeductibleTax: 675_000, preTax: 13_500_000 },
    id: 'bq-01',
    question: 'Phòng Thiết kế còn đủ ngân sách quý 4 để mua thêm 15 suất Figma không?',
    requestCode: 'REQ-2026-089',
    requester: 'Trần Vũ Bảo',
    software: 'Figma Organization · 15 suất',
    status: 'OPEN'
  },
  {
    askedAt: '2026-10-11T16:40:00+07:00',
    askedBy: 'Phạm Hoàng Nam',
    costCenter: 'CC-MKT',
    estimate: { deductibleVat: 400_000, nonDeductibleTax: 200_000, preTax: 4_000_000 },
    id: 'bq-02',
    question: 'Marketing chưa có ngân sách quý 4 — Tài chính có dự kiến lập trong tuần này không?',
    requestCode: 'REQ-2026-101',
    requester: 'Lý Thu Trang',
    software: 'HubSpot Marketing Starter',
    status: 'OPEN'
  },
  {
    askedAt: '2026-10-09T11:00:00+07:00',
    askedBy: 'Phạm Hoàng Nam',
    costCenter: 'CC-ENG',
    estimate: { deductibleVat: 820_000, nonDeductibleTax: 410_000, preTax: 8_200_000 },
    id: 'bq-03',
    question: 'Kiểm tra giúp ngân sách Kỹ thuật cho 10 suất Cursor Pro.',
    requestCode: 'REQ-2026-078',
    requester: 'Lê Hoàng Anh',
    answer: {
      answeredAt: '2026-10-09T14:20:00+07:00',
      note: 'Còn khoảng 115 triệu sau khi trừ cam kết đang giữ. Ý kiến tham khảo, không chặn.',
      opinion: 'WITHIN'
    },
    software: 'Cursor Pro · 10 suất',
    status: 'ANSWERED'
  },
  {
    askedAt: '2026-10-10T10:05:00+07:00',
    askedBy: 'Phạm Hoàng Nam',
    costCenter: 'CC-COMPANY',
    estimate: { deductibleVat: 2_880_000, nonDeductibleTax: 1_440_000, preTax: 28_800_000 },
    id: 'bq-04',
    question: 'Ngân sách Toàn công ty cho gói Notion AI 40 suất?',
    requestCode: 'REQ-2026-097',
    requester: 'Nguyễn Minh Khôi',
    software: 'Notion AI Business · 40 suất',
    status: 'OPEN'
  },
  {
    askedAt: '2026-10-05T08:30:00+07:00',
    askedBy: 'Phạm Hoàng Nam',
    costCenter: 'CC-OPS',
    estimate: { deductibleVat: 750_000, nonDeductibleTax: 375_000, preTax: 7_500_000 },
    id: 'bq-05',
    question: 'Ngân sách Vận hành cho Miro Team?',
    requestCode: 'REQ-2026-084',
    requester: 'Đặng Thanh Hà',
    software: 'Miro Team',
    status: 'CLOSED_CANCELLED'
  }
]

// ---------------------------------------------------------------- Commitments awaiting recording (FIN-20/21)

export interface CommitmentToRecord {
  approvedAt: string
  approvedBy: string
  budgetAttached: boolean
  code: string
  costCenter: string
  estimate: CostEstimate
  id: string
  recordingDueAt: string
  requestCode: string
  software: string
}

export const commitmentsToRecord: CommitmentToRecord[] = [
  {
    approvedAt: '2026-10-10T15:00:00+07:00',
    approvedBy: 'Phạm Hoàng Nam',
    budgetAttached: true,
    code: 'CMT-2026-051',
    costCenter: 'CC-ENG',
    estimate: { deductibleVat: 820_000, nonDeductibleTax: 410_000, preTax: 8_200_000 },
    id: 'cmt-51',
    recordingDueAt: '2026-10-14T15:00:00+07:00',
    requestCode: 'REQ-2026-078',
    software: 'Cursor Pro · 10 suất'
  },
  {
    approvedAt: '2026-10-08T10:20:00+07:00',
    approvedBy: 'Phạm Hoàng Nam',
    budgetAttached: false,
    code: 'CMT-2026-049',
    costCenter: 'CC-MKT',
    estimate: { deductibleVat: 1_400_000, nonDeductibleTax: 700_000, preTax: 14_000_000 },
    id: 'cmt-49',
    recordingDueAt: '2026-10-12T10:20:00+07:00',
    requestCode: 'REQ-2026-090',
    software: 'Adobe Creative Cloud · 3 suất'
  },
  {
    approvedAt: '2026-10-09T09:45:00+07:00',
    approvedBy: 'Phạm Hoàng Nam',
    budgetAttached: false,
    code: 'CMT-2026-050',
    costCenter: 'CC-MKT',
    estimate: { deductibleVat: 885_714, nonDeductibleTax: 442_857, preTax: 8_857_143 },
    id: 'cmt-50',
    recordingDueAt: '2026-10-13T09:45:00+07:00',
    requestCode: 'REQ-2026-093',
    software: 'Semrush Guru'
  }
]

// ---------------------------------------------------------------- Statement import (FIN-04)

export const importTemplates = [
  { id: 'standard', label: 'Mẫu chuẩn SaaS-Sentry (CSV)' },
  { id: 'vcb', label: 'Vietcombank — thẻ doanh nghiệp (CSV)' },
  { id: 'tcb', label: 'Techcombank — sao kê tài khoản (CSV)' }
] as const

export interface ImportPreviewRow {
  amount: number | null
  date: string
  description: string
  line: number
  problem?: 'DUPLICATE' | 'INVALID_DATE' | 'MISSING_AMOUNT'
}

export const importPreview = {
  alreadyImportedWarning: false,
  fileName: 'vcb-the-doanh-nghiep-10-2026.csv',
  rows: [
    { amount: 3_750_000, date: '2026-10-01', description: 'GITHUB.COM *COPILOT', line: 2 },
    { amount: 6_300_000, date: '2026-10-02', description: 'FIGMA ORGANIZATION', line: 3 },
    { amount: 520_000, date: '2026-10-03', description: 'OPENAI *CHATGPT PLUS', line: 4 },
    { amount: 1_150_000, date: '31/09/2026', description: 'NOTION LABS INC', line: 5, problem: 'INVALID_DATE' },
    { amount: null, date: '2026-10-05', description: 'CANVA* PRO', line: 6, problem: 'MISSING_AMOUNT' },
    { amount: 8_000_000, date: '2026-09-15', description: 'SLACK T0123 ENTERPRISE', line: 7, problem: 'DUPLICATE' },
    { amount: 2_450_000, date: '2026-10-06', description: 'LOOM.COM BUSINESS', line: 8 },
    { amount: 890_000, date: '2026-10-07', description: 'GOOGLE *WORKSPACE ADDON', line: 9 }
  ] satisfies ImportPreviewRow[]
}

/** What the system reports after vendor normalization and reconciliation (WF-17 / WF-17a). */
export const importReconcileResult = { exception: 1, noFollowUp: 3, vendorQueue: 1 }

// ---------------------------------------------------------------- Charge exceptions (FIN-07)

export type ExceptionReason = 'MULTIPLE_BASES' | 'NO_BASIS' | 'OUT_OF_TERM' | 'OVER_APPROVED'
export type ExceptionStatus = 'BASIS_LINKED' | 'BILLING_ERROR' | 'CHECKING' | 'SENT_TO_APPROVER'

export interface ChargeException {
  amount: number
  approvedAmount?: number
  basisTried: string[]
  cardLast4: string
  closeNote?: string
  code: string
  date: string
  evidence: string[]
  id: string
  itNote?: string
  reason: ExceptionReason
  status: ExceptionStatus
  vendor: string
}

export const chargeExceptions: ChargeException[] = [
  {
    amount: 520_000,
    basisTried: ['Danh mục: không có ChatGPT', 'Yêu cầu đã duyệt: không có'],
    cardLast4: '8812',
    code: 'CHG-1003',
    date: '2026-10-03',
    evidence: ['sao-ke-vcb-10-2026-dong-4.pdf'],
    id: 'chg-1003',
    itNote: 'Quản trị CNTT đang xác minh người dùng thẻ 8812 (Phòng Kỹ thuật).',
    reason: 'NO_BASIS',
    status: 'CHECKING',
    vendor: 'OpenAI'
  },
  {
    amount: 11_600_000,
    approvedAmount: 8_000_000,
    basisTried: ['Thuê bao Slack Enterprise Grid — 8.000.000 ₫/tháng'],
    cardLast4: '3341',
    code: 'CHG-0998',
    date: '2026-09-28',
    evidence: [],
    id: 'chg-0998',
    reason: 'OVER_APPROVED',
    status: 'CHECKING',
    vendor: 'Slack (Salesforce)'
  },
  {
    amount: 2_100_000,
    basisTried: ['Thuê bao Confluence Standard — hết hạn 31/08/2026'],
    cardLast4: '9012',
    code: 'CHG-0991',
    date: '2026-09-21',
    evidence: ['hoa-don-atlassian-0921.pdf'],
    id: 'chg-0991',
    itNote: 'Gói đã hủy ở danh mục nhưng nhà cung cấp vẫn trừ tiền.',
    reason: 'OUT_OF_TERM',
    status: 'CHECKING',
    vendor: 'Atlassian'
  },
  {
    amount: 1_850_000,
    basisTried: ['Thuê bao Miro Team', 'REQ-2026-062 Miro Business'],
    cardLast4: '4892',
    code: 'CHG-0985',
    date: '2026-09-18',
    evidence: ['hoa-don-miro-0918.pdf'],
    id: 'chg-0985',
    itNote: 'Đã liên kết với thuê bao Miro Team.',
    reason: 'MULTIPLE_BASES',
    status: 'BASIS_LINKED',
    vendor: 'Miro'
  },
  {
    amount: 2_400_000,
    basisTried: ['Danh mục: không có Canva Pro', 'Yêu cầu đã duyệt: không có'],
    cardLast4: '3341',
    code: 'CHG-0979',
    date: '2026-09-12',
    evidence: ['sao-ke-vcb-09-2026-dong-12.pdf'],
    id: 'chg-0979',
    reason: 'NO_BASIS',
    status: 'SENT_TO_APPROVER',
    vendor: 'Canva'
  }
]

// ---------------------------------------------------------------- Period close (FIN-30/31)

export interface HeldRemainder {
  code: string
  committed: number
  costCenter: string
  id: string
  invoiced: number
  lastInvoiceAt?: string
  moreInvoicesExpected: boolean
  requestCode: string
  software: string
}

export const heldRemainders: HeldRemainder[] = [
  {
    code: 'CMT-2026-031',
    committed: 26_400_000,
    costCenter: 'CC-OPS',
    id: 'rem-31',
    invoiced: 24_000_000,
    lastInvoiceAt: '2026-09-20',
    moreInvoicesExpected: false,
    requestCode: 'REQ-2026-041',
    software: 'Jira Service Management · 20 agent'
  },
  {
    code: 'CMT-2026-036',
    committed: 9_450_000,
    costCenter: 'CC-DES',
    id: 'rem-36',
    invoiced: 6_300_000,
    lastInvoiceAt: '2026-09-02',
    moreInvoicesExpected: true,
    requestCode: 'REQ-2026-052',
    software: 'Figma Organization · 10 suất'
  },
  {
    code: 'CMT-2026-039',
    committed: 5_250_000,
    costCenter: 'CC-ENG',
    id: 'rem-39',
    invoiced: 0,
    moreInvoicesExpected: true,
    requestCode: 'REQ-2026-058',
    software: 'Postman Professional'
  }
]

export const periodCloseSummary = { convertedToCost: 142_600_000, matchedInvoices: 37 }

export interface InternalCost {
  amount: number
  costCenter: string
  description: string
  id: string
}

export const internalCosts: InternalCost[] = [
  {
    amount: 12_000_000,
    costCenter: 'CC-COMPANY',
    description: 'Hệ thống chấm công nội bộ — máy chủ quý 3',
    id: 'int-1'
  },
  { amount: 7_500_000, costCenter: 'CC-ENG', description: 'CI runner nội bộ — phần Phòng Kỹ thuật', id: 'int-2' }
]

// ---------------------------------------------------------------- Allocation and budget vs actual (FIN-32/33)

export interface AllocationLine {
  costCenter: string | null
  internal: number
  personalSeats: number
  sharedAccounts: number
  sharedByRatio: number
}

/** `costCenter === null` is the "Unallocated" report line (QĐ-50c, FR-9.7) — never a Cost Center record. */
export const allocationLines: AllocationLine[] = [
  {
    costCenter: 'CC-ENG',
    internal: 7_500_000,
    personalSeats: 128_400_000,
    sharedAccounts: 4_200_000,
    sharedByRatio: 42_300_000
  },
  {
    costCenter: 'CC-DES',
    internal: 0,
    personalSeats: 61_800_000,
    sharedAccounts: 1_900_000,
    sharedByRatio: 14_900_000
  },
  {
    costCenter: 'CC-OPS',
    internal: 0,
    personalSeats: 39_200_000,
    sharedAccounts: 3_600_000,
    sharedByRatio: 20_300_000
  },
  { costCenter: 'CC-MKT', internal: 0, personalSeats: 14_100_000, sharedAccounts: 2_400_000, sharedByRatio: 5_200_000 },
  { costCenter: 'CC-SAL', internal: 0, personalSeats: 9_800_000, sharedAccounts: 0, sharedByRatio: 4_400_000 },
  {
    costCenter: 'CC-COMPANY',
    internal: 12_000_000,
    personalSeats: 0,
    sharedAccounts: 18_700_000,
    sharedByRatio: 10_800_000
  },
  { costCenter: null, internal: 0, personalSeats: 3_500_000, sharedAccounts: 0, sharedByRatio: 3_120_000 }
]

export const unallocatedOpenExceptions = 3

export interface BudgetVsActualLine {
  budget: number | null
  cashActual: number
  costCenter: string | null
  deductibleVat: number
  held: number
  periodActual: number
}

export const budgetVsActual: BudgetVsActualLine[] = [
  {
    budget: 240_000_000,
    cashActual: 196_000_000,
    costCenter: 'CC-ENG',
    deductibleVat: 14_600_000,
    held: 5_250_000,
    periodActual: 182_400_000
  },
  {
    budget: 110_000_000,
    cashActual: 70_200_000,
    costCenter: 'CC-DES',
    deductibleVat: 6_100_000,
    held: 3_150_000,
    periodActual: 78_600_000
  },
  {
    budget: 70_000_000,
    cashActual: 66_800_000,
    costCenter: 'CC-OPS',
    deductibleVat: 5_200_000,
    held: 2_400_000,
    periodActual: 63_100_000
  },
  {
    budget: 30_000_000,
    cashActual: 24_000_000,
    costCenter: 'CC-MKT',
    deductibleVat: 1_800_000,
    held: 0,
    periodActual: 21_700_000
  },
  {
    budget: 20_000_000,
    cashActual: 14_200_000,
    costCenter: 'CC-SAL',
    deductibleVat: 1_100_000,
    held: 0,
    periodActual: 14_200_000
  },
  {
    budget: 50_000_000,
    cashActual: 41_500_000,
    costCenter: 'CC-COMPANY',
    deductibleVat: 3_000_000,
    held: 0,
    periodActual: 41_500_000
  },
  { budget: null, cashActual: 6_620_000, costCenter: null, deductibleVat: 0, held: 0, periodActual: 6_620_000 }
]

/** Late items of the previous period appear as a labelled adjustment (QĐ-62m). */
export const priorPeriodAdjustment = { amount: 1_200_000, period: 'Q2-2026' }

/** L1 — committed cost read straight from contracts (FR-5.5). */
export const committedForecast = [
  { month: '2026-10-01', value: 118_000_000 },
  { month: '2026-11-01', value: 124_500_000 },
  { month: '2026-12-01', value: 131_200_000 }
]

export const upcomingRenewals = [
  { cost: 45_000_000, date: '2026-11-05', name: 'GitHub Enterprise & Copilot' },
  { cost: 96_000_000, date: '2026-11-15', name: 'Slack Enterprise Grid' }
]

export const scenarioDefaults = { costPerHire: 1_800_000, newHires: 12, newProjects: 25_000_000 }

// ---------------------------------------------------------------- Period report (FIN-34)

export const periodSavings = { immediate: 18_400_000, nextRenewal: 41_200_000, reclaimedSeats: 23 }

export const aiNarrativeAvailable = true

export const aiDraftNarrative =
  'Chi phí phần mềm quý 3/2026 theo kỳ là 408,1 triệu đồng [1], thấp hơn tổng ngân sách 520 triệu đồng [2]. ' +
  'Phòng Vận hành dùng 93,6% ngân sách, cao nhất công ty [3]. ' +
  'Dòng chưa phân bổ trung tâm chi phí còn 6,62 triệu đồng với 3 ngoại lệ đang chờ Người duyệt chi [4]. ' +
  'Tiết kiệm thực hiện ngay 18,4 triệu đồng; tiết kiệm tại kỳ gia hạn kế tiếp 41,2 triệu đồng — hai con số tách riêng [5].'

export const aiDraftSources = [
  '[1] Ngân sách so với thực chi · cơ sở theo kỳ · tổng',
  '[2] Ngân sách quý 3/2026 · 6 trung tâm chi phí',
  '[3] CC-OPS · thực chi theo kỳ ÷ ngân sách',
  '[4] Phân bổ · dòng chưa phân bổ',
  '[5] Báo cáo tiết kiệm'
]
