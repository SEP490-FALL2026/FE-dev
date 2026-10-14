import type { BudgetSnapshot, CostEstimate } from '../budget-figures'

/*
 * Demo data for the Spending Approver screens (UF-15). Amounts are VND borne cost; deductible VAT
 * is kept apart (FR-5.13, QĐ-60a). Budget snapshots mirror what Finance sees for the same period.
 */

export const approverNow = '2026-10-12T10:00:00+07:00'
export const approverPeriod = 'Q4-2026'
const asOf = '2026-10-12T08:30:00+07:00'

export const approverSnapshots: Record<string, BudgetSnapshot> = {
  'CC-COMPANY': {
    actual: 22_000_000,
    asOf,
    budget: 60_000_000,
    costCenter: 'CC-COMPANY',
    deductibleVat: 1_800_000,
    held: 0,
    pending: 0,
    period: approverPeriod
  },
  'CC-DES': {
    actual: 41_000_000,
    asOf,
    budget: 120_000_000,
    costCenter: 'CC-DES',
    deductibleVat: 3_100_000,
    held: 13_200_000,
    pending: 14_175_000,
    period: approverPeriod
  },
  'CC-ENG': {
    actual: 96_000_000,
    asOf,
    budget: 250_000_000,
    costCenter: 'CC-ENG',
    deductibleVat: 7_400_000,
    held: 38_500_000,
    pending: 0,
    period: approverPeriod
  },
  'CC-MKT': {
    actual: 6_200_000,
    asOf,
    budget: null,
    costCenter: 'CC-MKT',
    deductibleVat: 600_000,
    held: 24_000_000,
    pending: 4_200_000,
    period: approverPeriod
  },
  'CC-OPS': {
    actual: 48_000_000,
    asOf,
    budget: 80_000_000,
    costCenter: 'CC-OPS',
    deductibleVat: 3_900_000,
    held: 18_000_000,
    pending: 6_615_000,
    period: approverPeriod
  }
}

export const costCenterOptions = ['CC-ENG', 'CC-DES', 'CC-OPS', 'CC-MKT', 'CC-SAL', 'CC-COMPANY'] as const

// ---------------------------------------------------------------- APV-01 queue

export type QueueItemKind = 'CHARGE' | 'FINDING' | 'NEED_STEP' | 'RENEWAL' | 'SPEND_STEP'

export interface QueueItem {
  amount: number
  costCenter: string
  id: string
  kind: QueueItemKind
  receivedAt: string
  reference: string
  reminders: number
  slaDueAt: string
  software: string
  subtitle: string
}

export const approvalQueue: QueueItem[] = [
  {
    amount: 4_200_000,
    costCenter: 'CC-MKT',
    id: 'req-101',
    kind: 'SPEND_STEP',
    receivedAt: '2026-10-08T10:00:00+07:00',
    reference: 'REQ-2026-101',
    reminders: 2,
    slaDueAt: '2026-10-10T10:00:00+07:00',
    software: 'HubSpot Marketing Starter',
    subtitle: 'Lý Thu Trang · Phòng Marketing'
  },
  {
    amount: 14_175_000,
    costCenter: 'CC-DES',
    id: 'req-089',
    kind: 'SPEND_STEP',
    receivedAt: '2026-10-11T14:00:00+07:00',
    reference: 'REQ-2026-089',
    reminders: 0,
    slaDueAt: '2026-10-12T16:00:00+07:00',
    software: 'Figma Organization · 15 suất',
    subtitle: 'Trần Vũ Bảo · Phòng Thiết kế'
  },
  {
    amount: 6_615_000,
    costCenter: 'CC-OPS',
    id: 'req-104',
    kind: 'NEED_STEP',
    receivedAt: '2026-10-12T08:15:00+07:00',
    reference: 'REQ-2026-104',
    reminders: 0,
    slaDueAt: '2026-10-14T08:15:00+07:00',
    software: 'Datadog APM Pro · 5 máy chủ',
    subtitle: 'Đặng Thanh Hà · Trưởng phòng Vận hành'
  },
  {
    amount: 96_000_000,
    costCenter: 'CC-COMPANY',
    id: 'ren-slack',
    kind: 'RENEWAL',
    receivedAt: '2026-10-08T09:00:00+07:00',
    reference: 'SUB-SLACK-ENT',
    reminders: 1,
    slaDueAt: '2026-10-13T09:00:00+07:00',
    software: 'Slack Enterprise Grid',
    subtitle: 'Salesforce · 120 suất'
  },
  {
    amount: 45_000_000,
    costCenter: 'CC-ENG',
    id: 'ren-github',
    kind: 'RENEWAL',
    receivedAt: '2026-10-10T09:00:00+07:00',
    reference: 'SUB-GITHUB-ENT',
    reminders: 0,
    slaDueAt: '2026-10-14T09:00:00+07:00',
    software: 'GitHub Enterprise & Copilot',
    subtitle: 'GitHub · 50 suất'
  },
  {
    amount: 2_400_000,
    costCenter: '—',
    id: 'chg-0979',
    kind: 'CHARGE',
    receivedAt: '2026-10-09T15:30:00+07:00',
    reference: 'CHG-0979',
    reminders: 1,
    slaDueAt: '2026-10-13T15:30:00+07:00',
    software: 'Canva Pro',
    subtitle: 'Thẻ ••3341 · 12/09/2026'
  },
  {
    amount: 1_560_000,
    costCenter: 'CC-ENG',
    id: 'fnd-07',
    kind: 'FINDING',
    receivedAt: '2026-10-11T11:00:00+07:00',
    reference: 'FND-2026-07',
    reminders: 0,
    slaDueAt: '2026-10-15T11:00:00+07:00',
    software: 'OpenAI ChatGPT Plus',
    subtitle: '6 người dùng · Phòng Kỹ thuật'
  }
]

// ---------------------------------------------------------------- APV-02 request panel

export interface TrailStep {
  actor: string
  at?: string
  key: 'created' | 'itReview' | 'needStep' | 'spendStep'
  sameAsApprover?: boolean
  status: 'current' | 'done' | 'next'
}

export interface FinanceAnswer {
  answeredAt?: string
  answeredBy?: string
  askedAt: string
  note?: string
  opinion?: 'NO_BUDGET' | 'OVER' | 'WITHIN'
  question?: string
}

export interface RequestDetail {
  beneficiary: string
  branch: 'b' | 'c'
  costCenter: string
  estimate: CostEstimate
  financeAnswer?: FinanceAnswer
  id: string
  itAssessment?: { controlLevel: string; risk: 'HIGH' | 'LOW' | 'MEDIUM'; summary: string }
  justification: string
  requester: string
  trail: TrailStep[]
}

export const requestDetails: RequestDetail[] = [
  {
    beneficiary: '15 thành viên Phòng Thiết kế',
    branch: 'b',
    costCenter: 'CC-DES',
    estimate: { deductibleVat: 1_350_000, nonDeductibleTax: 675_000, preTax: 13_500_000 },
    financeAnswer: {
      askedAt: '2026-10-12T09:10:00+07:00',
      question: 'Phòng Thiết kế còn đủ ngân sách quý 4 để mua thêm 15 suất Figma không?'
    },
    id: 'req-089',
    justification:
      'Dự án Fintech Redesign cần thêm 15 nhà thiết kế cộng tác trên cùng thư viện thành phần trong quý 4.',
    requester: 'Trần Vũ Bảo',
    trail: [
      { actor: 'Trần Vũ Bảo', at: '2026-10-10T09:20:00+07:00', key: 'created', status: 'done' },
      { actor: 'Lê Thu Hà (Trưởng phòng Thiết kế)', at: '2026-10-11T14:00:00+07:00', key: 'needStep', status: 'done' },
      { actor: 'Phạm Hoàng Nam', key: 'spendStep', status: 'current' }
    ]
  },
  {
    beneficiary: 'Lý Thu Trang',
    branch: 'c',
    costCenter: 'CC-MKT',
    estimate: { deductibleVat: 400_000, nonDeductibleTax: 200_000, preTax: 4_000_000 },
    financeAnswer: {
      answeredAt: '2026-10-11T17:05:00+07:00',
      answeredBy: 'Ngọc Lan (Tài chính)',
      askedAt: '2026-10-11T16:40:00+07:00',
      note: 'Marketing chưa có ngân sách quý 4; Tài chính dự kiến lập trước 15/10. Ý kiến tham khảo, không chặn.',
      opinion: 'NO_BUDGET',
      question: 'Marketing chưa có ngân sách quý 4 — Tài chính có dự kiến lập trong tuần này không?'
    },
    id: 'req-101',
    itAssessment: {
      controlLevel: 'Kiểm soát được — đăng nhập một lần, quản trị tập trung',
      risk: 'LOW',
      summary: 'Không trùng chức năng với công cụ trong danh mục; dữ liệu khách hàng tiềm năng mức trung bình.'
    },
    justification: 'Tự động hóa chiến dịch email và chấm điểm khách hàng tiềm năng cho chiến dịch cuối năm.',
    requester: 'Lý Thu Trang',
    trail: [
      { actor: 'Lý Thu Trang', at: '2026-10-06T10:00:00+07:00', key: 'created', status: 'done' },
      {
        actor: 'Trịnh Quốc Bảo (Trưởng phòng Marketing)',
        at: '2026-10-07T09:00:00+07:00',
        key: 'needStep',
        status: 'done'
      },
      { actor: 'Quang Huy (Quản trị CNTT)', at: '2026-10-08T10:00:00+07:00', key: 'itReview', status: 'done' },
      { actor: 'Phạm Hoàng Nam', key: 'spendStep', status: 'current' }
    ]
  },
  {
    beneficiary: 'Đặng Thanh Hà (trưởng phòng — người thụ hưởng)',
    branch: 'b',
    costCenter: 'CC-OPS',
    estimate: { deductibleVat: 630_000, nonDeductibleTax: 315_000, preTax: 6_300_000 },
    id: 'req-104',
    justification: 'Giám sát hiệu năng 5 máy chủ thanh toán sau sự cố tháng 9.',
    requester: 'Đặng Thanh Hà',
    trail: [
      { actor: 'Đặng Thanh Hà', at: '2026-10-12T08:15:00+07:00', key: 'created', status: 'done' },
      { actor: 'Phạm Hoàng Nam', key: 'needStep', status: 'current' },
      { actor: 'Phạm Hoàng Nam', key: 'spendStep', sameAsApprover: true, status: 'next' }
    ]
  }
]

// ---------------------------------------------------------------- APV-03 renewal

export interface ReclaimCandidate {
  group: 'DECIDED' | 'G2' | 'G3' | 'G4' | 'OLDEST'
  id: string
  lastActivity?: string
  name: string
}

export interface RenewalDetail {
  annualCost: number
  assigned: number
  businessOwnerOpinion: string
  cancellationDeadline: string
  costCenter: string
  id: string
  itProposal: { action: 'CANCEL' | 'REDUCE' | 'RENEW'; quantity: number; rationale: string }
  purchased: number
  reclaimCandidates: ReclaimCandidate[]
  renewalDate: string
  usage: { active: number; inactive: number; noData: number; unmatched: number }
  vendor: string
  waste: { g1: number; g2: number; g3: number; g4: number }
}

export const renewalDetails: RenewalDetail[] = [
  {
    annualCost: 45_000_000,
    assigned: 44,
    businessOwnerOpinion: 'Nhóm lập trình máy chủ chỉ cần khoảng 40 suất cho năm tới. (Ý kiến tham khảo, không chặn.)',
    cancellationDeadline: '2026-10-20',
    costCenter: 'CC-ENG',
    id: 'ren-github',
    itProposal: {
      action: 'REDUCE',
      quantity: 40,
      rationale: '6 suất chưa gán, 1 suất của người đã nghỉ việc, 3 suất không hoạt động trên 60 ngày.'
    },
    purchased: 50,
    reclaimCandidates: [
      { group: 'DECIDED', id: 'u1', name: 'Vũ Đức Minh' },
      { group: 'G2', id: 'u2', name: 'Ngô Thị Lan' },
      { group: 'G3', id: 'u3', lastActivity: '2026-07-02', name: 'Hồ Quang Vinh' },
      { group: 'G4', id: 'u4', name: 'Tạ Minh Châu' },
      { group: 'OLDEST', id: 'u5', lastActivity: '2026-08-14', name: 'Phan Bảo Ngọc' },
      { group: 'OLDEST', id: 'u6', lastActivity: '2026-08-29', name: 'Lâm Gia Huy' }
    ],
    renewalDate: '2026-11-05',
    usage: { active: 31, inactive: 6, noData: 4, unmatched: 3 },
    vendor: 'GitHub (Microsoft)',
    waste: { g1: 6, g2: 1, g3: 3, g4: 2 }
  },
  {
    annualCost: 96_000_000,
    assigned: 118,
    businessOwnerOpinion: 'Toàn công ty dùng hằng ngày; đề nghị giữ nguyên. (Ý kiến tham khảo, không chặn.)',
    cancellationDeadline: '2026-10-15',
    costCenter: 'CC-COMPANY',
    id: 'ren-slack',
    itProposal: {
      action: 'RENEW',
      quantity: 120,
      rationale: 'Tỷ lệ hoạt động cao; 2 suất trống dành cho nhân sự mới tháng 11.'
    },
    purchased: 120,
    reclaimCandidates: [
      { group: 'G3', id: 's1', lastActivity: '2026-07-20', name: 'Đinh Văn Tú' },
      { group: 'OLDEST', id: 's2', lastActivity: '2026-09-01', name: 'Mai Thu Hằng' }
    ],
    renewalDate: '2026-11-15',
    usage: { active: 109, inactive: 3, noData: 4, unmatched: 2 },
    vendor: 'Salesforce',
    waste: { g1: 2, g2: 0, g3: 3, g4: 0 }
  }
]

// ---------------------------------------------------------------- APV-02 charge or finding

export interface ChargeDetail {
  amount: number
  basisTried: string[]
  date: string
  evidence: string[]
  financeNote: string
  id: string
  reason: 'MULTIPLE_BASES' | 'NO_BASIS' | 'OUT_OF_TERM' | 'OVER_APPROVED'
  statementLine: string
  vendor: string
}

export interface FindingDetail {
  assessment: { control: string; risk: 'HIGH' | 'LOW' | 'MEDIUM'; technical: string }
  charges: { amount: number; date: string; line: string }[]
  headContext?: string
  id: string
  payer: string
  responsible: string
  users: string[]
  vendor: string
}

export const chargeDetails: ChargeDetail[] = [
  {
    amount: 2_400_000,
    basisTried: [
      'Danh mục: không có Canva Pro',
      'Yêu cầu đã duyệt trong kỳ: không có',
      'Thuê bao đang hiệu lực: không có'
    ],
    date: '2026-09-12',
    evidence: ['sao-ke-vcb-09-2026-dong-12.pdf'],
    financeNote: 'Thẻ ••3341 do Phòng Marketing giữ. Tài chính đã đối soát, không tìm thấy căn cứ.',
    id: 'chg-0979',
    reason: 'NO_BASIS',
    statementLine: 'CANVA* PRO ANNUAL — 12/09/2026',
    vendor: 'Canva Pty Ltd'
  }
]

export const findingDetails: FindingDetail[] = [
  {
    assessment: {
      control: 'Kiểm soát một phần — có gói Team có đăng nhập một lần và tắt huấn luyện trên dữ liệu',
      risk: 'MEDIUM',
      technical: 'Dùng cho thử nghiệm câu lệnh AI; có thể chuyển sang gói Team quản trị tập trung.'
    },
    charges: [
      { amount: 520_000, date: '2026-08-03', line: 'OPENAI *CHATGPT PLUS' },
      { amount: 520_000, date: '2026-09-03', line: 'OPENAI *CHATGPT PLUS' },
      { amount: 520_000, date: '2026-10-03', line: 'OPENAI *CHATGPT PLUS' }
    ],
    headContext: 'Đội AI cần ChatGPT để thử nghiệm câu lệnh AI cho trợ lý chăm sóc khách hàng. — Trưởng phòng Kỹ thuật',
    id: 'fnd-07',
    payer: 'Thẻ công ty ••8812 (Phòng Kỹ thuật)',
    responsible: 'Lê Hoàng Anh',
    users: ['Lê Hoàng Anh', 'Trần Minh Đức', 'Nguyễn Hải Yến', 'Phùng Văn Long', 'Đỗ Khánh Linh', 'Bùi Tuấn Kiệt'],
    vendor: 'OpenAI'
  }
]

// ---------------------------------------------------------------- Overview and reports

export const approverAlerts = [
  { key: 'financeOver', reference: 'CMT-2026-047 · CC-OPS', tone: 'danger' },
  { key: 'budgetChanged', reference: 'CC-ENG · Quý 4/2026', tone: 'warning' },
  { key: 'deadlineSoon', reference: 'Slack Enterprise Grid · 15/10/2026', tone: 'warning' },
  { key: 'lateExecution', reference: 'Zoom Business · 30/09/2026', tone: 'info' }
] as const

export const approverReport = {
  branchASeats: [
    { app: 'Slack Enterprise Grid', costCenter: 'CC-COMPANY', seats: 12 },
    { app: 'Jira Software', costCenter: 'CC-ENG', seats: 9 },
    { app: 'Figma Organization', costCenter: 'CC-DES', seats: 4 }
  ],
  costCenters: [
    { budget: 240_000_000, code: 'CC-ENG', spend: 182_400_000 },
    { budget: 110_000_000, code: 'CC-DES', spend: 78_600_000 },
    { budget: 70_000_000, code: 'CC-OPS', spend: 63_100_000 },
    { budget: 30_000_000, code: 'CC-MKT', spend: 21_700_000 },
    { budget: 20_000_000, code: 'CC-SAL', spend: 14_200_000 },
    { budget: 50_000_000, code: 'CC-COMPANY', spend: 41_500_000 }
  ],
  financeResponseDays: 0.4,
  financeRecordingDays: 1.2,
  period: 'Q3-2026',
  savings: { immediate: 18_400_000, nextRenewal: 41_200_000, reclaimedSeats: 23 },
  stepDays: [
    { key: 'need', value: 0.8 },
    { key: 'itReview', value: 1.1 },
    { key: 'spend', value: 1.6 },
    { key: 'provisioning', value: 0.9 }
  ] as const,
  myOverdueRate: 0.14,
  totalBudget: 520_000_000,
  totalSpend: 408_120_000,
  unallocated: 6_620_000,
  usage: { active: 56, evaluated: 70, purchased: 100 }
}
